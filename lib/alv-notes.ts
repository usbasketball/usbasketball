import { unstable_cache } from "next/cache";
import { contentfulClient } from "@/lib/contentful";

export const ALV_NOTES_TAG = "alv-notes";

export type AlvNote = {
  id: string;
  year: number | null;
  title: string;
  documentUrl: string;
};

type MeetingNoteFields = {
  year?: unknown;
  title?: unknown;
  document?: {
    sys?: { id?: unknown; linkType?: unknown };
    fields?: {
      title?: unknown;
      file?: { url?: unknown };
    };
  };
};

function toDocumentUrl(value: MeetingNoteFields["document"]): string | null {
  const raw = String(value?.fields?.file?.url ?? "").trim();
  if (!raw) return null;
  return raw.startsWith("//") ? `https:${raw}` : raw;
}

async function fetchAlvNotes(): Promise<AlvNote[]> {
  if (!contentfulClient) return [];

  try {
    const result = await contentfulClient.getEntries({
      content_type: "meetingNote",
      include: 1,
      order: ["-fields.year"],
      limit: 100,
    });

    const notes: AlvNote[] = [];
    for (const entry of result.items) {
      const fields = entry.fields as unknown as MeetingNoteFields;
      const documentUrl = toDocumentUrl(fields.document);
      if (!documentUrl) continue;

      notes.push({
        id: entry.sys.id,
        year:
          typeof fields.year === "number" && Number.isFinite(fields.year)
            ? fields.year
            : null,
        title:
          String(fields.title ?? "").trim() ||
          String(fields.document?.fields?.title ?? "").trim(),
        documentUrl,
      });
    }
    return notes.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  } catch (error) {
    console.error("Failed to fetch ALV notes from Contentful", error);
    return [];
  }
}

export const getAlvNotes = unstable_cache(fetchAlvNotes, ["alv-notes"], {
  tags: [ALV_NOTES_TAG],
});
