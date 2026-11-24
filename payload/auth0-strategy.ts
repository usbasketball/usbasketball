import type { AuthStrategy } from "payload";
import { auth0, authEnabled } from "@/lib/auth";
import { ALL_CMS_PERMISSIONS, isCmsPermission, type CmsPermission } from "./permissions";

function adminEmails(): string[] {
  return (process.env.PAYLOAD_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

const allowedFallback = (email: string) => adminEmails().includes(email);

/**
 * CMS permissions from the access token's `permissions` claim. The token comes
 * from the encrypted session cookie, so it is decoded, not re-verified. An
 * opaque token (no audience configured) yields no permissions.
 */
function tokenPermissions(accessToken: string | undefined): CmsPermission[] {
  const payload = accessToken?.split(".")[1];
  if (!payload) return [];
  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    const raw: unknown = claims?.permissions;
    return Array.isArray(raw)
      ? raw.filter((p): p is CmsPermission => typeof p === "string" && isCmsPermission(p))
      : [];
  } catch {
    return [];
  }
}

/**
 * Signs editors into the Payload admin with their existing Auth0 session.
 * Access needs a verified email plus at least one `write:cms_*` Auth0
 * permission (Auth0 is the source of truth; permissions are attached to the
 * request user, not stored). Emails in PAYLOAD_ADMIN_EMAILS remain a temporary
 * fallback granting every permission. A matching Payload user is created on
 * first sign-in. Unset-safe: with Auth0 unconfigured nobody is authenticated.
 */
export const auth0Strategy: AuthStrategy = {
  name: "auth0",
  authenticate: async ({ payload }) => {
    if (!authEnabled()) return { user: null };

    const session = await auth0.getSession();
    const email = session?.user?.email?.toLowerCase();
    // Fail closed: the claim must be present and true, not merely not-false.
    if (!email || session?.user?.email_verified !== true) return { user: null };

    const permissions = allowedFallback(email)
      ? ALL_CMS_PERMISSIONS
      : tokenPermissions(session?.tokenSet?.accessToken);
    if (permissions.length === 0) return { user: null };

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

    return { user: { ...user, collection: "users", permissions } };
  },
};
