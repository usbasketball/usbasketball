import { cookies } from "next/headers";
import { CONSENT_COOKIE, parseConsent, type Consent } from "@/lib/consent";

/**
 * Reads the visitor's consent from the request cookie so the very first HTML
 * response already reflects it (no banner flash, no late script injection).
 */
export async function readConsent(): Promise<Consent | null> {
  const store = await cookies();
  return parseConsent(store.get(CONSENT_COOKIE)?.value);
}
