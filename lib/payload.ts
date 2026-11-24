import { unstable_cache } from "next/cache";
import { getPayload, type Payload } from "payload";
import config from "@payload-config";

/**
 * Payload needs a database and a secret. Like Auth0, it must stay unset-safe:
 * without them the public site builds and renders empty content states.
 */
export function payloadEnabled(): boolean {
  return Boolean(process.env.DATABASE_URL && process.env.PAYLOAD_SECRET);
}

export async function getPayloadClient(): Promise<Payload> {
  return getPayload({ config });
}

/**
 * Wraps a Payload read in `unstable_cache` (tagged, no expiry; Payload hooks
 * revalidate the tag on publish). Neither "Payload not configured" nor a failed
 * read is ever cached: errors throw inside the cached function so Next skips
 * storing them, and the wrapper turns them into the empty value.
 */
export function cmsRead<T>(
  key: string,
  tag: string,
  read: (payload: Payload) => Promise<T>,
  empty: T
): () => Promise<T> {
  const cached = unstable_cache(
    async () => read(await getPayloadClient()),
    [key],
    { tags: [tag] }
  );

  return async () => {
    if (!payloadEnabled()) return empty;
    try {
      return await cached();
    } catch (error) {
      console.error(`Failed to read "${key}" from Payload`, error);
      return empty;
    }
  };
}

/** Resolves a populated upload relation to a usable file, or null. */
export function toFile(
  value: unknown
): { url: string; fileName: string | null } | null {
  if (!value || typeof value !== "object") return null;
  const media = value as { url?: unknown; filename?: unknown };
  const url = typeof media.url === "string" ? media.url.trim() : "";
  if (!url) return null;
  return {
    url,
    fileName: typeof media.filename === "string" ? media.filename : null,
  };
}
