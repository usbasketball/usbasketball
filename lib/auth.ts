import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  signInReturnToPath: "/me",
});

// Keep the app functional (and buildable) without Auth0 credentials, mirroring
// the guarded Contentful client. The SDK throws at request time when unset.
export function authEnabled() {
  return Boolean(
    process.env.AUTH0_DOMAIN &&
      process.env.AUTH0_CLIENT_ID &&
      process.env.AUTH0_CLIENT_SECRET &&
      process.env.AUTH0_SECRET
  );
}
