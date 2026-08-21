import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  isRegisterPathname,
  isRegistrationAccessValid,
  signRegistrationExpires,
} from "@/lib/registration-link";

const SECRET = "test-secret";
const HOURS = 48;

function expiresInSeconds(seconds: number): number {
  return Math.floor(Date.now() / 1000) + seconds;
}

describe("isRegistrationAccessValid", () => {
  it("accepts a freshly signed token", async () => {
    const expires = String(expiresInSeconds(HOURS * 3600));
    const token = await signRegistrationExpires(SECRET, Number(expires));

    expect(
      await isRegistrationAccessValid({ secret: SECRET, expires, token })
    ).toBe(true);
  });

  it("accepts a token produced by node:crypto (generator script parity)", async () => {
    const expires = String(expiresInSeconds(HOURS * 3600));
    const token = createHmac("sha256", SECRET).update(expires).digest("hex");

    expect(
      await isRegistrationAccessValid({ secret: SECRET, expires, token })
    ).toBe(true);
  });

  it("rejects a wrong secret", async () => {
    const expires = String(expiresInSeconds(HOURS * 3600));
    const token = await signRegistrationExpires("other-secret", Number(expires));

    expect(
      await isRegistrationAccessValid({ secret: SECRET, expires, token })
    ).toBe(false);
  });

  it("rejects a tampered expires value", async () => {
    const expires = String(expiresInSeconds(HOURS * 3600));
    const token = await signRegistrationExpires(SECRET, Number(expires));
    const tampered = String(expiresInSeconds(HOURS * 3600 + 1));

    expect(
      await isRegistrationAccessValid({ secret: SECRET, expires: tampered, token })
    ).toBe(false);
  });

  it("rejects an expired link", async () => {
    const expires = String(expiresInSeconds(-10));
    const token = await signRegistrationExpires(SECRET, Number(expires));

    expect(
      await isRegistrationAccessValid({ secret: SECRET, expires, token })
    ).toBe(false);
  });

  it("rejects missing parameters", async () => {
    const expires = String(expiresInSeconds(HOURS * 3600));
    const token = await signRegistrationExpires(SECRET, Number(expires));

    await expect(
      isRegistrationAccessValid({ secret: undefined, expires, token })
    ).resolves.toBe(false);
    await expect(
      isRegistrationAccessValid({ secret: SECRET, expires: null, token })
    ).resolves.toBe(false);
    await expect(
      isRegistrationAccessValid({ secret: SECRET, expires, token: "" })
    ).resolves.toBe(false);
  });

  it("rejects malformed tokens", async () => {
    const expires = String(expiresInSeconds(HOURS * 3600));

    await expect(
      isRegistrationAccessValid({
        secret: SECRET,
        expires,
        token: "not-hex-at-all",
      })
    ).resolves.toBe(false);
    await expect(
      isRegistrationAccessValid({ secret: SECRET, expires, token: "abc" })
    ).resolves.toBe(false);
  });
});

describe("isRegisterPathname", () => {
  it("matches the bare and localized register paths", () => {
    expect(isRegisterPathname("/register")).toBe(true);
    expect(isRegisterPathname("/en/register")).toBe(true);
    expect(isRegisterPathname("/nl/register")).toBe(true);
    expect(isRegisterPathname("/nl/register/")).toBe(true);
  });

  it("does not match other paths", () => {
    expect(isRegisterPathname("/registerx")).toBe(false);
    expect(isRegisterPathname("/en/register/extra")).toBe(false);
    expect(isRegisterPathname("/signup")).toBe(false);
    expect(isRegisterPathname("/")).toBe(false);
  });
});
