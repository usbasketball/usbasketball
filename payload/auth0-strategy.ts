import type { AuthStrategy } from "payload";
import { auth0, authEnabled } from "@/lib/auth";

function adminEmails(): string[] {
  return (process.env.PAYLOAD_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Signs editors into the Payload admin with their existing Auth0 session.
 * Only emails listed in PAYLOAD_ADMIN_EMAILS get access; a matching Payload
 * user is created on first sign-in. Unset-safe: with Auth0 or the allowlist
 * unconfigured nobody is authenticated.
 */
export const auth0Strategy: AuthStrategy = {
  name: "auth0",
  authenticate: async ({ payload }) => {
    if (!authEnabled()) return { user: null };

    const allowed = adminEmails();
    if (allowed.length === 0) return { user: null };

    const session = await auth0.getSession();
    const email = session?.user?.email?.toLowerCase();
    // Fail closed: the claim must be present and true, not merely not-false.
    if (!email || session?.user?.email_verified !== true) return { user: null };
    if (!allowed.includes(email)) return { user: null };

    const existing = await payload.find({
      collection: "users",
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });

    const user =
      existing.docs[0] ??
      (await payload.create({
        collection: "users",
        data: { email },
        overrideAccess: true,
      }));

    return { user: { ...user, collection: "users" } };
  },
};
