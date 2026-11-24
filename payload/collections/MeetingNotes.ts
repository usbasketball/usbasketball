import type { CollectionConfig } from "payload";
import { ALV_NOTES_TAG } from "@/lib/cms-tags";
import { revalidateTags } from "../revalidate";

export const MeetingNotes: CollectionConfig = {
  slug: "meeting-notes",
  admin: { useAsTitle: "title" },
  access: { read: ({ req }) => Boolean(req.user) },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateTags(ALV_NOTES_TAG);
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateTags(ALV_NOTES_TAG);
        return doc;
      },
    ],
  },
  fields: [
    { name: "year", type: "number", required: true },
    { name: "title", type: "text" },
    { name: "document", type: "upload", relationTo: "media", required: true },
  ],
};
