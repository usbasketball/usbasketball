import { afterEach, describe, expect, it, vi } from "vitest";

const rootParamsMock = vi.hoisted(() => ({
  locale: vi.fn(),
}));

vi.mock("next/root-params", () => rootParamsMock);

vi.mock("next-intl/server", () => ({
  getRequestConfig: (createRequestConfig: (params: unknown) => unknown) =>
    createRequestConfig,
}));

import getRequestConfig from "@/i18n/request";

function isNotFoundError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "digest" in error &&
    (error as { digest?: string }).digest === "NEXT_HTTP_ERROR_FALLBACK;404"
  );
}

afterEach(() => {
  rootParamsMock.locale.mockReset();
});

describe("getRequestConfig", () => {
  it("resolves the EN messages for a valid locale", async () => {
    const config = await getRequestConfig({
      locale: "en",
      requestLocale: Promise.resolve("en"),
    });

    expect(config.locale).toBe("en");
    expect(config.messages).toHaveProperty("Home");
  });

  it("resolves the NL messages for a valid locale", async () => {
    const config = await getRequestConfig({
      locale: "nl",
      requestLocale: Promise.resolve("nl"),
    });

    expect(config.locale).toBe("nl");
    expect(config.messages).toHaveProperty("Home");
  });

  it("throws a 404 when an explicit locale is invalid (e.g. /sitemap.txt)", async () => {
    await expect(
      getRequestConfig({
        locale: "sitemap.txt",
        requestLocale: Promise.resolve("sitemap.txt"),
      }),
    ).rejects.toSatisfy(isNotFoundError);
  });

  it("throws a 404 for dot-prefixed single segments like /foo.txt", async () => {
    await expect(
      getRequestConfig({
        locale: "foo.txt",
        requestLocale: Promise.resolve("foo.txt"),
      }),
    ).rejects.toSatisfy(isNotFoundError);
  });

  it("falls back to the root param locale when none is provided", async () => {
    rootParamsMock.locale.mockResolvedValue("nl");

    const config = await getRequestConfig({
      locale: undefined,
      requestLocale: Promise.resolve(undefined),
    });

    expect(config.locale).toBe("nl");
    expect(rootParamsMock.locale).toHaveBeenCalled();
  });

  it("throws a 404 when the root param locale is invalid", async () => {
    rootParamsMock.locale.mockResolvedValue("favicon.ico");

    await expect(
      getRequestConfig({
        locale: undefined,
        requestLocale: Promise.resolve(undefined),
      }),
    ).rejects.toSatisfy(isNotFoundError);
  });
});
