import { unstable_cache } from "next/cache";
import { contentfulClient } from "@/lib/contentful";

export const ALV_DOCUMENTS_TAG = "alv-documents";

export type AlvDocument = {
  id: string;
  title: string;
  documentUrl: string;
};

export type AlvDocuments = {
  year: number | null;
  documents: AlvDocument[];
};

type AssetLink = {
  sys?: { id?: unknown };
  fields?: {
    title?: unknown;
    file?: { url?: unknown; fileName?: unknown };
  };
};

type AlvDocumentenFields = {
  year?: unknown;
  documents?: AssetLink[];
};

function toDocumentUrl(asset: AssetLink | undefined): string | null {
  const raw = String(asset?.fields?.file?.url ?? "").trim();
  if (!raw) return null;
  return raw.startsWith("//") ? `https:${raw}` : raw;
}

function toDocumentTitle(asset: AssetLink | undefined): string {
  return (
    String(asset?.fields?.title ?? "").trim() ||
    String(asset?.fields?.file?.fileName ?? "").trim()
  );
}

async function fetchAlvDocuments(): Promise<AlvDocuments | null> {
  if (!contentfulClient) return null;

  try {
    const result = await contentfulClient.getEntries({
      content_type: "alvDocumenten",
      include: 1,
      order: ["-fields.year"],
      limit: 1,
    });

    const entry = result.items[0];
    if (!entry) return null;

    const fields = entry.fields as unknown as AlvDocumentenFields;
    const yearValue = fields.year;
    const parsedYear =
      (typeof yearValue === "number" && Number.isFinite(yearValue)) ||
      (typeof yearValue === "string" && yearValue.trim() !== "")
        ? Number(yearValue)
        : null;
    const year =
      parsedYear !== null && Number.isFinite(parsedYear) ? parsedYear : null;

    const documents: AlvDocument[] = [];
    for (const [index, asset] of (fields.documents ?? []).entries()) {
      const documentUrl = toDocumentUrl(asset);
      if (!documentUrl) continue;

      documents.push({
        id: String(asset?.sys?.id ?? `document-${index}`),
        title: toDocumentTitle(asset) || "Document",
        documentUrl,
      });
    }

    return { year, documents };
  } catch (error) {
    console.error("Failed to fetch ALV documents from Contentful", error);
    return null;
  }
}

export const getAlvDocuments = unstable_cache(
  fetchAlvDocuments,
  ["alv-documents"],
  {
    tags: [ALV_DOCUMENTS_TAG],
  }
);