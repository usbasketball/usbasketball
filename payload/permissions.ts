// Auth0 permissions that gate editing in the Payload admin. Auth0 is the single
// source of truth: nothing is stored in Payload.
export const CMS_PERMISSIONS = {
  schedule: "write:cms_schedule",
  alv: "write:cms_alv",
  tasks: "write:cms_tasks",
  recruitment: "write:cms_recruitment",
} as const;

export type CmsPermission = (typeof CMS_PERMISSIONS)[keyof typeof CMS_PERMISSIONS];

export const ALL_CMS_PERMISSIONS: CmsPermission[] = Object.values(CMS_PERMISSIONS);

export function isCmsPermission(value: string): value is CmsPermission {
  return (ALL_CMS_PERMISSIONS as string[]).includes(value);
}
