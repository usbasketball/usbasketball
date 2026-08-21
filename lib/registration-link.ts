import { routing } from "@/i18n/routing";

const REGISTER_PATH = "/register";

export function isRegisterPathname(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === REGISTER_PATH) return true;
  return routing.locales.some(
    (locale) => normalized === `/${locale}${REGISTER_PATH}`
  );
}

type RegistrationTokenInput = {
  secret?: string | undefined;
  expires?: string | null | undefined;
  token?: string | null | undefined;
};

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(hex.length / 2));
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

function importHmacKey(
  secret: string,
  usages: KeyUsage[]
): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usages
  );
}

/**
 * Verifies that `expires` (unix seconds) has not passed and that `token` is a
 * valid hex HMAC-SHA256 signature of the `expires` string under `secret`.
 */
export async function isRegistrationAccessValid({
  secret,
  expires,
  token,
}: RegistrationTokenInput): Promise<boolean> {
  if (!secret || !expires || !token) return false;

  const expiresAt = Number.parseInt(expires, 10);
  if (!Number.isInteger(expiresAt)) return false;
  if (Math.floor(Date.now() / 1000) > expiresAt) return false;

  if (!/^[0-9a-f]+$/i.test(token) || token.length % 2 !== 0) return false;

  try {
    const key = await importHmacKey(secret, ["verify"]);
    return crypto.subtle.verify(
      "HMAC",
      key,
      hexToBytes(token),
      new TextEncoder().encode(expires)
    );
  } catch {
    return false;
  }
}

/** Produces the hex HMAC-SHA256 token for an `expires` value. */
export async function signRegistrationExpires(
  secret: string,
  expires: number
): Promise<string> {
  const key = await importHmacKey(secret, ["sign"]);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(String(expires))
  );
  return Array.from(new Uint8Array(signature), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}
