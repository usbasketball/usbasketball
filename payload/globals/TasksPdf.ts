import type { GlobalConfig } from "payload";
import { TASKS_PDF_TAG } from "@/lib/cms-tags";
import { revalidateTags } from "../revalidate";

export const TasksPdf: GlobalConfig = {
  slug: "tasks-pdf",
  label: "Task roster PDF",
  access: { read: ({ req }) => Boolean(req.user) },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateTags(TASKS_PDF_TAG);
        return doc;
      },
    ],
  },
  fields: [{ name: "file", type: "upload", relationTo: "media", required: true }],
};
