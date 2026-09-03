export const ANALYTICS_CONSENT_COOKIE = "usbasketball_analytics_consent";

export type AnalyticsConsent = "yes" | "no";

export function readAnalyticsConsentCookie(): AnalyticsConsent | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${ANALYTICS_CONSENT_COOKIE}=`));

  if (!match) {
    return null;
  }

  const value = decodeURIComponent(match.split("=")[1] ?? "");

  return value === "yes" || value === "no" ? value : null;
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

  document.cookie = `${ANALYTICS_CONSENT_COOKIE}=${encodeURIComponent(
    value,
  )}; path=/; max-age=${maxAgeInSeconds}; SameSite=Lax${
    isSecure ? "; Secure" : ""
  }`;
}
