import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { fetchMyNbbNumber } from "@/lib/graphql-me";
import * as authModule from "@/lib/auth";

describe("fetchMyNbbNumber", () => {
  const originalEnv = process.env;
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv, BESTUUR_GRAPHQL_URL: "https://bestuur.usbasketball.nl/api/graphql" };
    global.fetch = mockFetch;
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("returns null when BESTUUR_GRAPHQL_URL is unset", async () => {
    delete process.env.BESTUUR_GRAPHQL_URL;
    const result = await fetchMyNbbNumber("test-token");
    expect(result).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns null when no token is provided and auth is disabled/no session", async () => {
    vi.spyOn(authModule, "authEnabled").mockReturnValue(false);
    const result = await fetchMyNbbNumber();
    expect(result).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("fetches nbbNumber successfully with an explicit token", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { me: { nbbNumber: "1234567" } },
      }),
    });

    const result = await fetchMyNbbNumber("explicit-token");
    expect(result).toBe("1234567");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://bestuur.usbasketball.nl/api/graphql",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer explicit-token",
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("extracts token from session when no token parameter is passed", async () => {
    vi.spyOn(authModule, "authEnabled").mockReturnValue(true);
    vi.spyOn(authModule.auth0, "getSession").mockResolvedValueOnce({
      tokenSet: { idToken: "session-id-token" },
    } as unknown as Awaited<ReturnType<typeof authModule.auth0.getSession>>);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { me: { nbbNumber: "7654321" } },
      }),
    });

    const result = await fetchMyNbbNumber();
    expect(result).toBe("7654321");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://bestuur.usbasketball.nl/api/graphql",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer session-id-token",
        }),
      })
    );
  });

  it("returns null on 401 response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const result = await fetchMyNbbNumber("invalid-token");
    expect(result).toBeNull();
  });

  it("returns null on network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network connection failed"));

    const result = await fetchMyNbbNumber("test-token");
    expect(result).toBeNull();
  });

  it("returns null when GraphQL returns errors or null me", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        errors: [{ message: "Unauthorized" }],
      }),
    });

    const result = await fetchMyNbbNumber("test-token");
    expect(result).toBeNull();
  });
});
