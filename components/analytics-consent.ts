export const ANALYTICS_CONSENT_COOKIE = "usbasketball_analytics_consent";
// Allow the CMP cookie name to be configured via env for deterministic detection
export const CMP_CONSENT_COOKIE =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_CMP_CONSENT_COOKIE_NAME) || "consent-policy";

// Optional explicit cookie domain (set in Vercel env) to control where domain
// cookie is written (e.g. .usbasketball.nl). When unset, we only write a
// domain cookie for the common www -> apex case.
const EXPLICIT_COOKIE_DOMAIN =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_COOKIE_DOMAIN) || "";

export type AnalyticsConsent = "yes" | "no";

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split(";").map((c) => c.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));

  if (!match) return null;

  const idx = match.indexOf("=");
  if (idx === -1) return null;

  // Preserve entire value even if it contains '=' characters
  const rawValue = match.slice(idx + 1);
  try {
    return decodeURIComponent(rawValue) || null;
  } catch {
    return rawValue || null;
  }
}

function parseCmpConsent(): boolean {
  // First, try the known/configured CMP cookie name
  const value = getCookieValue(CMP_CONSENT_COOKIE);

  if (value) {
    try {
      const parsed = JSON.parse(value);
      return Boolean(parsed?.anl || parsed?.adv || parsed?.func || parsed?.ess);
    } catch {
      // fallthrough to scanning all cookies
    }
  }

  // Fallback: scan cookies with conservative heuristics. Only consider cookie
  // values that start with '{' and are not huge to avoid wasted work.
  if (typeof document === "undefined") return false;

  const cookies = document.cookie.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    const eq = cookie.indexOf("=");
    if (eq === -1) continue;
    const rawValue = cookie.slice(eq + 1);
    let decoded = rawValue;
    if (rawValue.length > 2000) continue; // skip very large blobs
    try {
      decoded = decodeURIComponent(rawValue);
    } catch {
      // ignore decode errors
    }
    if (!decoded || !decoded.startsWith("{")) continue;
    try {
      const parsed = JSON.parse(decoded);
      if (parsed && (parsed.anl || parsed.adv || parsed.func || parsed.ess)) {
        if (process.env.NODE_ENV !== "production") {
          // helpful in development to know which cookie matched
          // eslint-disable-next-line no-console
          console.info("[analytics-consent] CMP cookie matched during scan");
        }
        return true;
      }
    } catch {
      // not JSON
    }
  }

  return false;
}

export function readAnalyticsConsentCookie(): AnalyticsConsent | null {
  const appConsent = getCookieValue(ANALYTICS_CONSENT_COOKIE);
  if (appConsent === "yes" || appConsent === "no") {
    return appConsent;
  }

  const cmpConsent = parseCmpConsent();
  if (cmpConsent) {
    return "yes";
  }

  return null;
}

export function hasAnalyticsConsent(): boolean {
  return readAnalyticsConsentCookie() === "yes";
}

export function setAnalyticsConsentCookie(value: AnalyticsConsent) {
  if (typeof document === "undefined") {
    return;
  }

  const maxAgeInSeconds = 60 * 60 * 24 * 365;
  const isSecure = window.location.protocol === "https:";
  const host = window.location.hostname;

  const baseCookie = `${ANALYTICS_CONSENT_COOKIE}=${encodeURIComponent(
    value,
  )}; path=/; max-age=${maxAgeInSeconds}; SameSite=Lax${isSecure ? "; Secure" : ""}`;

  // Always set a host-scoped cookie first
  document.cookie = baseCookie;

  try {
    const isLocalhost = host === "localhost" || host === "127.0.0.1";
    const isIP = /^\d+\.\d+\.\d+\.\d+$/.test(host);

    if (!isLocalhost && !isIP) {
      // If an explicit cookie domain is provided (e.g. .usbasketball.nl), use it.
      if (EXPLICIT_COOKIE_DOMAIN) {
        document.cookie = `${baseCookie}; Domain=${EXPLICIT_COOKIE_DOMAIN}`;
        return;
      }

      // Only write the Domain attribute for the common www -> apex case to avoid
      // surprising behavior on arbitrary subdomains.
      if (host.startsWith("www.")) {
        const apex = host.replace(/^www\./, "");
        if (apex.includes(".")) {
          document.cookie = `${baseCookie}; Domain=.${apex}`;
        }
      }
    }
  } catch {
    // no-op: best-effort write for cross-host resilience.
  }
}
