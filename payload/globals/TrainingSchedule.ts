import type { GlobalConfig } from "payload";
import { TRAINING_SCHEDULE_TAG } from "@/lib/cms-tags";
import { writeAccess } from "../access";
import { CMS_PERMISSIONS } from "../permissions";
import { revalidateTags } from "../revalidate";

export const TrainingSchedule: GlobalConfig = {
  slug: "training-schedule",
  access: {
    read: ({ req }) => Boolean(req.user),
    update: writeAccess(CMS_PERMISSIONS.schedule).update,
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateTags(TRAINING_SCHEDULE_TAG);
        return doc;
      },
    ],
  },
  fields: [
    { name: "season", type: "text" },
    { name: "firstHalf", type: "richText", label: "Wednesday schedule, 1st half" },
    { name: "secondHalf", type: "richText", label: "Wednesday schedule, 2nd half" },
    { name: "friday", type: "richText", label: "Friday schedule" },
    {
      name: "fridayLastUpdatedAt",
      type: "date",
      label: "Friday schedule last updated",
    },
  ],
};
