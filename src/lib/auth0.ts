import {Auth0Client} from "@auth0/nextjs-auth0/server";
import {User} from "@auth0/nextjs-auth0/types";

const ROLES_CLAIM = "https://usbasketball.nl/roles";

export const auth0 = new Auth0Client({
  async beforeSessionSaved(session) {
    // The SDK strips all non-standard claims by default (whitelist: sub, name,
    // email, picture, etc.). We need to preserve the roles custom claim that
    // the Auth0 Post-Login Action injects into the ID token.
    if (
      session.user &&
      !session.user[ROLES_CLAIM] &&
      session.tokenSet?.idToken
    ) {
      try {
        const payload = JSON.parse(
          Buffer.from(
            session.tokenSet.idToken.split(".")[1],
            "base64url",
          ).toString(),
        );
        if (payload[ROLES_CLAIM]) {
          session.user[ROLES_CLAIM] = payload[ROLES_CLAIM];
        }
      } catch {
        // Ignore decode errors — roles will just be empty
      }
    }
    return session;
  },
});

export function getUserRoles(user: User | undefined): string[] {
  if (!user) return [];
  return (user[ROLES_CLAIM] as string[]) ?? [];
}

export function hasRole(user: User | undefined, role: string): boolean {
  return getUserRoles(user).includes(role);
}
