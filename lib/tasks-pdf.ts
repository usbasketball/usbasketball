import { TASKS_PDF_TAG } from "@/lib/cms-tags";
import { cmsRead, toFile } from "@/lib/payload";

export { TASKS_PDF_TAG };

export type TasksPdf = {
  url: string;
  fileName: string;
};

export const getTasksPdf = cmsRead<TasksPdf | null>(
  "tasks-pdf",
  TASKS_PDF_TAG,
  async (payload) => {
    const doc = await payload.findGlobal({ slug: "tasks-pdf", depth: 1 });
    const file = toFile(doc.file);
    if (!file) return null;
    return { url: file.url, fileName: file.fileName ?? "takenschema.pdf" };
  },
  null
);
