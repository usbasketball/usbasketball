import type { CollectionConfig } from "payload";
import { ALL_CMS_TAGS } from "@/lib/cms-tags";
import { revalidateTags } from "../revalidate";

export const Media: CollectionConfig = {
  slug: "media",
  access: { read: ({ req }) => Boolean(req.user) },
  upload: { mimeTypes: ["application/pdf"] },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateTags(...ALL_CMS_TAGS);
        return doc;
      },
    ],
  },
  fields: [{ name: "alt", type: "text" }],
};
