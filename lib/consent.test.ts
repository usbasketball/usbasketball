import { describe, expect, it } from "vitest";
import {
  CONSENT_COOKIE,
  consentCookieString,
  createConsent,
  parseConsent,
  serializeConsent,
} from "@/lib/consent";

describe("parseConsent", () => {
  it("returns null when there is no cookie", () => {
    expect(parseConsent(undefined)).toBeNull();
    expect(parseConsent("")).toBeNull();
  });

  it("round-trips a stored choice", () => {
    for (const analytics of [true, false]) {
      const consent = createConsent({ analytics });
      expect(parseConsent(serializeConsent(consent))).toEqual(consent);
    }
  });

  it("treats malformed, legacy or wrong-version values as 'ask again'", () => {
    expect(parseConsent("yes")).toBeNull();
    expect(parseConsent("{not json")).toBeNull();
    expect(parseConsent(encodeURIComponent('{"v":0,"analytics":true}'))).toBeNull();
    expect(parseConsent(encodeURIComponent('{"v":1,"analytics":"yes"}'))).toBeNull();
    expect(parseConsent(encodeURIComponent('{"v":1}'))).toBeNull();
    expect(parseConsent(encodeURIComponent("null"))).toBeNull();
  });
});

describe("consentCookieString", () => {
  const consent = createConsent({ analytics: true });

  it("is first-party, Lax and expiring", () => {
    const cookie = consentCookieString(consent, { secure: false });
    expect(cookie.startsWith(`${CONSENT_COOKIE}=`)).toBe(true);
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toMatch(/Max-Age=\d+/);
    expect(cookie).not.toContain("Secure");
    expect(cookie).not.toContain("Domain=");
  });

  it("adds Secure and Domain when asked", () => {
    const cookie = consentCookieString(consent, {
      secure: true,
      domain: ".example.nl",
    });
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("Domain=.example.nl");
  });
});
