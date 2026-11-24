import { ALV_NOTES_TAG } from "@/lib/cms-tags";
import { cmsRead, toFile } from "@/lib/payload";

export { ALV_NOTES_TAG };

export type AlvNote = {
  id: string;
  year: number | null;
  title: string;
  documentUrl: string;
};

export const getAlvNotes = cmsRead<AlvNote[]>(
  "alv-notes",
  ALV_NOTES_TAG,
  async (payload) => {
    const result = await payload.find({
      collection: "meeting-notes",
      sort: "-year",
      limit: 100,
      depth: 1,
    });

    return result.docs.flatMap((note) => {
      const file = toFile(note.document);
      if (!file) return [];
      return [
        {
          id: String(note.id),
          year: note.year ?? null,
          title: note.title?.trim() || file.fileName || "Document",
          documentUrl: file.url,
        },
      ];
    });
  },
  []
);
