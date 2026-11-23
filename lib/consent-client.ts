import { CONSENT_COOKIE, parseConsent, type ConsentCategory } from "@/lib/consent";

/**
 * Reads the consent cookie straight from `document.cookie`. For code that runs
 * outside React (e.g. Sentry's client init), where the provider is unavailable.
 * Evaluate it at call time, not at init time, so later choices are honoured.
 */
export function hasConsentInBrowser(category: ConsentCategory): boolean {
  if (typeof document === "undefined") return false;
  const prefix = `${CONSENT_COOKIE}=`;
  const entry = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(prefix));
  return parseConsent(entry?.slice(prefix.length))?.[category] === true;
}
