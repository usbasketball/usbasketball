import type { CmsPermission } from "./permissions";

/**
 * True when the signed-in admin user holds the Auth0 permission. Permissions
 * are attached to `req.user` by the Auth0 strategy on every request.
 */
export function hasPermission(user: unknown, permission: CmsPermission): boolean {
  const permissions = (user as { permissions?: unknown } | null)?.permissions;
  return Array.isArray(permissions) && permissions.includes(permission);
}

type Req = { req: { user?: unknown } };

/** Access function: the user must hold at least one of the given permissions. */
export const requirePermission =
  (...permissions: CmsPermission[]) =>
  ({ req }: Req): boolean =>
    permissions.some((p) => hasPermission(req.user, p));

/** Write access (create/update/delete) for a permission; reads stay signed-in only. */
export const writeAccess = (...permissions: CmsPermission[]) => {
  const allowed = requirePermission(...permissions);
  return { create: allowed, update: allowed, delete: allowed };
};
