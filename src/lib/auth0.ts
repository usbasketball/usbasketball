import {Auth0Client} from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client();

// To enable role-based nav items, add this Post-Login Action in the Auth0 Dashboard:
// Dashboard → Actions → Flows → Login → Add Action (custom)
//
// exports.onExecutePostLogin = async (event, api) => {
//   api.idToken.setCustomClaim(
//     "https://usbasketball.nl/roles",
//     event.authorization?.roles ?? []
//   );
// };
//
// Then create roles (e.g. "admin") in Dashboard → User Management → Roles
// and assign them to users. Nav items with visibility "role:admin" will
// automatically appear for those users.

const ROLES_CLAIM = "https://usbasketball.nl/roles";

export function getUserRoles(
  user: {[key: string]: unknown} | undefined,
): string[] {
  if (!user) return [];
  return (user[ROLES_CLAIM] as string[]) ?? [];
}

export function hasRole(
  user: {[key: string]: unknown} | undefined,
  role: string,
): boolean {
  return getUserRoles(user).includes(role);
}
