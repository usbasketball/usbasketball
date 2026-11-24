import type { Field, GlobalConfig } from "payload";
import { RECRUITMENT_NOTICE_TAG } from "@/lib/cms-tags";
import { hasPermission } from "../access";
import { CMS_PERMISSIONS } from "../permissions";
import { revalidateTags } from "../revalidate";

const localeGroup = (name: "en" | "nl", label: string): Field => ({
  name,
  label,
  type: "group",
  fields: [
    { name: "title", type: "text", required: true },
    { name: "intro", type: "textarea", required: true },
    {
      name: "spots",
      type: "array",
      labels: { singular: "Open spot", plural: "Open spots" },
      fields: [
        { name: "label", type: "text", required: true, admin: { description: "E.g. Men / Women" } },
        { name: "text", type: "text", required: true },
      ],
    },
    {
      name: "outro",
      type: "textarea",
      admin: { description: "Separate paragraphs with a blank line." },
    },
  ],
});

export const RecruitmentNotice: GlobalConfig = {
  slug: "recruitment-notice",
  label: "Recruitment notice",
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => hasPermission(req.user, CMS_PERMISSIONS.recruitment),
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateTags(RECRUITMENT_NOTICE_TAG);
        return doc;
      },
    ],
  },
  fields: [
    {
      name: "enabled",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Show the capacity note on the signup page and in the confirmation email." },
    },
    localeGroup("en", "English"),
    localeGroup("nl", "Nederlands"),
  ],
};
