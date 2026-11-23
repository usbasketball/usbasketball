/**
 * Cookie-consent model shared by server and client code (no browser or
 * Next.js imports here, so it is trivially unit-testable).
 *
 * Only categories that something on the site actually depends on are listed.
 * "Necessary" cookies (Auth0 session, this consent cookie) need no consent and
 * are not stored. To add a category (e.g. "marketing"), append it to
 * CONSENT_CATEGORIES, add its strings under `Consent` in messages/, and gate
 * whatever it controls with `useConsent().has("<category>")`. Bump
 * CONSENT_VERSION to re-prompt everyone when the meaning of a category changes.
 */
export const CONSENT_COOKIE = "usbasketball_consent";
export const CONSENT_VERSION = 1;
/** Consent is re-requested after ~6 months. */
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

export const CONSENT_CATEGORIES = ["analytics"] as const;
export type ConsentCategory = (typeof CONSENT_CATEGORIES)[number];

export type Consent = { v: typeof CONSENT_VERSION } & Record<
  ConsentCategory,
  boolean
>;

export function createConsent(
  choices: Record<ConsentCategory, boolean>,
): Consent {
  return { v: CONSENT_VERSION, ...choices };
}

/**
 * Parses a raw cookie value. Anything missing, malformed or from another
 * version yields `null`, which means "ask again", never "granted".
 */
export function parseConsent(raw: string | null | undefined): Consent | null {
  if (!raw) return null;

  let value: unknown;
  try {
    value = JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }

  if (typeof value !== "object" || value === null) return null;
  const record = value as Record<string, unknown>;
  if (record.v !== CONSENT_VERSION) return null;

  const choices = {} as Record<ConsentCategory, boolean>;
  for (const category of CONSENT_CATEGORIES) {
    if (typeof record[category] !== "boolean") return null;
    choices[category] = record[category];
  }
  return createConsent(choices);
}

export function serializeConsent(consent: Consent): string {
  return encodeURIComponent(JSON.stringify(consent));
}

/** Value for `document.cookie`. First-party, Secure on https, no PII. */
export function consentCookieString(
  consent: Consent,
  options: { secure: boolean; domain?: string },
): string {
  return [
    `${CONSENT_COOKIE}=${serializeConsent(consent)}`,
    "Path=/",
    `Max-Age=${CONSENT_MAX_AGE_SECONDS}`,
    "SameSite=Lax",
    options.secure ? "Secure" : "",
    options.domain ? `Domain=${options.domain}` : "",
  ]
    .filter(Boolean)
    .join("; ");
}
