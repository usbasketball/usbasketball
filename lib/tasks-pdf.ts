import { unstable_cache } from "next/cache";
import { contentfulClient } from "@/lib/contentful";

export const TASKS_PDF_TAG = "tasks-pdf";

export type TasksPdf = {
  url: string;
  fileName: string;
};

type AssetLink = {
  fields?: {
    title?: unknown;
    file?: { url?: unknown; fileName?: unknown };
  };
};

function toDocumentUrl(value: unknown): string | null {
  const asset = value as AssetLink | null | undefined;
  const raw = String(asset?.fields?.file?.url ?? "").trim();
  if (!raw) return null;
  return raw.startsWith("//") ? `https:${raw}` : raw;
}

function assetFromFields(
  fields: Record<string, unknown>
): { url: string; fileName: string } | null {
  for (const value of Object.values(fields)) {
    const url = toDocumentUrl(value);
    if (!url) continue;

    const asset = value as AssetLink;
    const fileName =
      String(asset.fields?.file?.fileName ?? "").trim() || "takenschema.pdf";
    return { url, fileName };
  }
  return null;
}

async function fetchTasksPdf(): Promise<TasksPdf | null> {
  if (!contentfulClient) return null;

  try {
    const result = await contentfulClient.getEntries({
      content_type: "takenschemaPdf",
      include: 2,
      limit: 1,
    });

    const entry = result.items[0];
    if (!entry) return null;

    return assetFromFields(entry.fields as Record<string, unknown>);
  } catch (error) {
    console.error("Failed to fetch tasks PDF from Contentful", error);
    return null;
  }
}

export const getTasksPdf = unstable_cache(fetchTasksPdf, ["tasks-pdf"], {
  tags: [TASKS_PDF_TAG],
});
