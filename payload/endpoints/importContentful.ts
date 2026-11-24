// TEMPORARY one-off migration endpoint. Remove (with payload/import/) once the
// content has been imported and verified.
//
//   POST /api/import-contentful            -> dry run, reports what would change
//   POST /api/import-contentful?dryRun=false -> writes to Payload
//
// Editors only. Needs CONTENTFUL_SPACE_ID + CONTENTFUL_ACCESS_TOKEN (and
// optionally CONTENTFUL_ENVIRONMENT) set temporarily. Re-runnable: media is
// reused by filename and ALV entries are matched by year.
import type { Endpoint, Payload } from "payload";
import { contentfulRichTextToLexical } from "../import/contentful-to-lexical";

type Fields = Record<string, unknown>;
type CfAsset = { sys: { id: string }; fields: Fields };
type CfResponse = {
  items: { sys: { id: string }; fields: Fields }[];
  includes?: { Asset?: CfAsset[] };
};
type CfFile = { url?: string; fileName?: string; contentType?: string };

async function cfFetch(contentType: string, order?: string): Promise<{
  items: CfResponse["items"];
  asset: (link: unknown) => CfAsset | null;
}> {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const token = process.env.CONTENTFUL_ACCESS_TOKEN;
  const env = process.env.CONTENTFUL_ENVIRONMENT ?? "master";
  const url = new URL(
    `https://cdn.contentful.com/spaces/${space}/environments/${env}/entries`
  );
  url.searchParams.set("access_token", token ?? "");
  url.searchParams.set("content_type", contentType);
  url.searchParams.set("include", "2");
  url.searchParams.set("limit", "1000");
  if (order) url.searchParams.set("order", order);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Contentful ${contentType}: ${res.status} ${res.statusText}`);
  }
  const body = (await res.json()) as CfResponse;
  const assets = new Map(
    (body.includes?.Asset ?? []).map((a) => [a.sys.id, a] as const)
  );
  return {
    items: body.items,
    asset: (link) => {
      const id = (link as { sys?: { id?: string } } | null)?.sys?.id;
      return (id && assets.get(id)) || null;
    },
  };
}

function fileOf(asset: CfAsset | null): CfFile | null {
  const file = asset?.fields.file as CfFile | undefined;
  return file?.url ? file : null;
}

export const importContentfulEndpoint: Endpoint = {
  path: "/import-contentful",
  method: "post",
  handler: async (req) => {
    if (!req.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
      return Response.json(
        { error: "Set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN first." },
        { status: 400 }
      );
    }

    const payload: Payload = req.payload;
    const dryRun = req.searchParams.get("dryRun") !== "false";
    const report = {
      dryRun,
      schedule: "skipped",
      tasksPdf: "skipped",
      alvDocuments: [] as string[],
      meetingNotes: [] as string[],
      mediaUploaded: 0,
      mediaReused: 0,
    };

    // Reuse media by filename; upload (download from Contentful) otherwise.
    const mediaIds = new Map<string, number | string>();
    async function ensureMedia(asset: CfAsset | null) {
      const file = fileOf(asset);
      if (!asset || !file) return null;
      const name = file.fileName ?? `${asset.sys.id}.pdf`;
      const cached = mediaIds.get(name);
      if (cached !== undefined) return cached;

      const existing = await payload.find({
        collection: "media",
        where: { filename: { equals: name } },
        limit: 1,
        depth: 0,
      });
      if (existing.docs[0]) {
        report.mediaReused++;
        mediaIds.set(name, existing.docs[0].id);
        return existing.docs[0].id;
      }
      report.mediaUploaded++;
      if (dryRun) return -1;

      const res = await fetch(`https:${file.url}`);
      if (!res.ok) throw new Error(`Download ${name}: ${res.status}`);
      const data = Buffer.from(await res.arrayBuffer());
      const created = await payload.create({
        collection: "media",
        data: { alt: String(asset.fields.title ?? name) },
        file: {
          data,
          mimetype: file.contentType ?? "application/pdf",
          name,
          size: data.length,
        },
      });
      mediaIds.set(name, created.id);
      return created.id;
    }

    try {
      // Training schedule
      const schedule = (await cfFetch("trainingSchedules")).items[0];
      if (schedule) {
        const f = schedule.fields;
        const date = f.fridayTrainingScheduleLastUpdatedAt
          ? new Date(String(f.fridayTrainingScheduleLastUpdatedAt))
          : null;
        report.schedule = dryRun ? "would update" : "updated";
        if (!dryRun) {
          await payload.updateGlobal({
            slug: "training-schedule",
            data: {
              season: String(f.season ?? "").trim() || null,
              firstHalf: f.wednesdaySchedule1stHalf
                ? contentfulRichTextToLexical(f.wednesdaySchedule1stHalf)
                : null,
              secondHalf: f.wednesdayTrainingSchedule2ndHalf
                ? contentfulRichTextToLexical(f.wednesdayTrainingSchedule2ndHalf)
                : null,
              friday: f.fridayTrainingSchedule
                ? contentfulRichTextToLexical(f.fridayTrainingSchedule)
                : null,
              fridayLastUpdatedAt:
                date && !Number.isNaN(date.getTime()) ? date.toISOString() : null,
            } as never,
          });
        }
      }

      // Task roster PDF: the asset field id is unknown, so take the first asset.
      const roster = await cfFetch("takenschemaPdf", "-sys.createdAt");
      const rosterEntry = roster.items[0];
      if (rosterEntry) {
        const asset = Object.values(rosterEntry.fields)
          .map((value) => roster.asset(value))
          .find((a) => fileOf(a));
        const mediaId = await ensureMedia(asset ?? null);
        if (mediaId !== null) {
          report.tasksPdf = dryRun ? "would update" : "updated";
          if (!dryRun) {
            await payload.updateGlobal({ slug: "tasks-pdf", data: { file: mediaId as number } });
          }
        }
      }

      // ALV documents, matched by year
      const alv = await cfFetch("alvDocumenten", "-fields.year");
      for (const entry of alv.items) {
        const year = Number(entry.fields.year);
        if (!Number.isFinite(year)) continue;
        const links = Array.isArray(entry.fields.documents) ? entry.fields.documents : [];
        const documents: { title: string; file: number }[] = [];
        for (const link of links) {
          const asset = alv.asset(link);
          const mediaId = await ensureMedia(asset);
          if (asset && mediaId !== null) {
            documents.push({
              title: String(asset.fields.title ?? fileOf(asset)?.fileName ?? "Document"),
              file: mediaId as number,
            });
          }
        }
        const existing = await payload.find({
          collection: "alv-documents",
          where: { year: { equals: year } },
          limit: 1,
          depth: 0,
        });
        const action = existing.docs[0] ? "update" : "create";
        report.alvDocuments.push(`${year}: ${dryRun ? "would " : ""}${action} (${documents.length} files)`);
        if (!dryRun) {
          if (existing.docs[0]) {
            await payload.update({ collection: "alv-documents", id: existing.docs[0].id, data: { documents } });
          } else {
            await payload.create({ collection: "alv-documents", data: { year, documents } });
          }
        }
      }

      // Meeting notes, matched by year + title
      const notes = await cfFetch("meetingNote", "-fields.year");
      for (const entry of notes.items) {
        const year = Number(entry.fields.year);
        const asset = notes.asset(entry.fields.document);
        if (!Number.isFinite(year) || !asset) continue;
        const title = String(entry.fields.title ?? asset.fields.title ?? "").trim();
        const existing = await payload.find({
          collection: "meeting-notes",
          where: { and: [{ year: { equals: year } }, { title: { equals: title } }] },
          limit: 1,
          depth: 0,
        });
        if (existing.docs[0]) {
          report.meetingNotes.push(`${year} ${title}: exists, skipped`);
          continue;
        }
        const mediaId = await ensureMedia(asset);
        report.meetingNotes.push(`${year} ${title}: ${dryRun ? "would create" : "created"}`);
        if (!dryRun && mediaId !== null) {
          await payload.create({
            collection: "meeting-notes",
            data: { year, title, document: mediaId as number },
          });
        }
      }

      return Response.json(report);
    } catch (error) {
      payload.logger.error({ err: error }, "Contentful import failed");
      return Response.json(
        { error: error instanceof Error ? error.message : String(error), report },
        { status: 500 }
      );
    }
  },
};
