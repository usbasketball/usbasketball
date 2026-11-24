import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// `unstable_cache` needs Next's incremental cache; run the function directly.
vi.mock("next/cache", () => ({
  unstable_cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
}));
vi.mock("@payload-config", () => ({ default: {} }));
const getPayload = vi.fn();
vi.mock("payload", () => ({ getPayload: (...args: unknown[]) => getPayload(...args) }));

import { cmsRead, payloadEnabled, toFile } from "./payload";

const ENV_KEYS = ["DATABASE_URL", "PAYLOAD_SECRET"] as const;
const saved: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const key of ENV_KEYS) saved[key] = process.env[key];
  getPayload.mockReset();
});
afterEach(() => {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
  vi.restoreAllMocks();
});

describe("payloadEnabled", () => {
  it("needs both DATABASE_URL and PAYLOAD_SECRET", () => {
    delete process.env.DATABASE_URL;
    delete process.env.PAYLOAD_SECRET;
    expect(payloadEnabled()).toBe(false);
    process.env.DATABASE_URL = "postgres://x";
    expect(payloadEnabled()).toBe(false);
    process.env.PAYLOAD_SECRET = "s";
    expect(payloadEnabled()).toBe(true);
  });
});

describe("cmsRead", () => {
  it("returns the empty value without touching Payload when unconfigured", async () => {
    delete process.env.DATABASE_URL;
    delete process.env.PAYLOAD_SECRET;
    const read = vi.fn();
    const result = await cmsRead("k", "t", read, ["empty"])();
    expect(result).toEqual(["empty"]);
    expect(read).not.toHaveBeenCalled();
    expect(getPayload).not.toHaveBeenCalled();
  });

  it("returns what the read produces when configured", async () => {
    process.env.DATABASE_URL = "postgres://x";
    process.env.PAYLOAD_SECRET = "s";
    const client = { marker: true };
    getPayload.mockResolvedValue(client);
    const read = vi.fn().mockResolvedValue("data");
    expect(await cmsRead("k", "t", read, "empty")()).toBe("data");
    expect(read).toHaveBeenCalledWith(client);
  });

  it("falls back to the empty value (and logs) when the read fails", async () => {
    process.env.DATABASE_URL = "postgres://x";
    process.env.PAYLOAD_SECRET = "s";
    getPayload.mockResolvedValue({});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const read = vi.fn().mockRejectedValue(new Error("db down"));
    expect(await cmsRead("k", "t", read, null)()).toBeNull();
    expect(error).toHaveBeenCalled();
  });
});

describe("toFile", () => {
  it("resolves a populated upload", () => {
    expect(toFile({ url: " https://blob/x.pdf ", filename: "x.pdf" })).toEqual({
      url: "https://blob/x.pdf",
      fileName: "x.pdf",
    });
  });

  it("returns null for unpopulated ids, missing urls and non-objects", () => {
    expect(toFile(12)).toBeNull();
    expect(toFile(null)).toBeNull();
    expect(toFile({ filename: "x.pdf" })).toBeNull();
    expect(toFile({ url: "  " })).toBeNull();
  });
});
