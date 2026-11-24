import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  signInReturnToPath: "/me",
  // With an audience (an Auth0 API with RBAC + "Add Permissions in the Access
  // Token") the access token carries the user's permissions, which gate CMS
  // editing. Unset-safe: without it no permissions are issued.
  ...(process.env.AUTH0_AUDIENCE && {
    authorizationParameters: { audience: process.env.AUTH0_AUDIENCE },
  }),
});

// Keep the app functional (and buildable) without Auth0 credentials, mirroring
// the guarded Payload client. The SDK throws at request time when unset.
export function authEnabled() {
  return Boolean(
    process.env.AUTH0_DOMAIN &&
      process.env.AUTH0_CLIENT_ID &&
      process.env.AUTH0_CLIENT_SECRET &&
      process.env.AUTH0_SECRET
  );
}
