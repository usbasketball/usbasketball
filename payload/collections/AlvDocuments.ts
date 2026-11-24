import type { CollectionConfig } from "payload";
import { ALV_DOCUMENTS_TAG } from "@/lib/cms-tags";
import { revalidateTags } from "../revalidate";

export const AlvDocuments: CollectionConfig = {
  slug: "alv-documents",
  labels: { singular: "ALV documents", plural: "ALV documents" },
  admin: { useAsTitle: "year" },
  access: { read: ({ req }) => Boolean(req.user) },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateTags(ALV_DOCUMENTS_TAG);
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateTags(ALV_DOCUMENTS_TAG);
        return doc;
      },
    ],
  },
  fields: [
    { name: "year", type: "number", required: true, unique: true },
    {
      name: "documents",
      type: "array",
      fields: [
        { name: "title", type: "text" },
        { name: "file", type: "upload", relationTo: "media", required: true },
      ],
    },
  ],
};
