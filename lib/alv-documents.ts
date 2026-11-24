import { ALV_DOCUMENTS_TAG } from "@/lib/cms-tags";
import { cmsRead, toFile } from "@/lib/payload";

export { ALV_DOCUMENTS_TAG };

export type AlvDocument = {
  id: string;
  title: string;
  documentUrl: string;
};

export type AlvDocuments = {
  year: number | null;
  documents: AlvDocument[];
};

export const getAlvDocuments = cmsRead<AlvDocuments | null>(
  "alv-documents",
  ALV_DOCUMENTS_TAG,
  async (payload) => {
    const result = await payload.find({
      collection: "alv-documents",
      sort: "-year",
      limit: 1,
      depth: 1,
    });
    const doc = result.docs[0];
    if (!doc) return null;

    const documents = (doc.documents ?? []).flatMap((item, index) => {
      const file = toFile(item.file);
      if (!file) return [];
      return [
        {
          id: item.id ?? `document-${index}`,
          title: item.title?.trim() || file.fileName || "Document",
          documentUrl: file.url,
        },
      ];
    });

    return { year: doc.year ?? null, documents };
  },
  null
);
