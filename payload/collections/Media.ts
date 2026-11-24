import type { CollectionConfig } from "payload";
import { ALL_CMS_TAGS } from "@/lib/cms-tags";
import { writeAccess } from "../access";
import { CMS_PERMISSIONS } from "../permissions";
import { revalidateTags } from "../revalidate";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: ({ req }) => Boolean(req.user),
    // Uploads back the ALV documents/notes and the task roster PDF.
    ...writeAccess(CMS_PERMISSIONS.alv, CMS_PERMISSIONS.tasks),
  },
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
