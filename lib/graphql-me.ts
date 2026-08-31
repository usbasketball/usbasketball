import { auth0, authEnabled } from "@/lib/auth";

export async function fetchMyNbbNumber(token?: string): Promise<string | null> {
  const endpoint = process.env.BESTUUR_GRAPHQL_URL;
  if (!endpoint) return null;

  let bearerToken = token;
  if (!bearerToken && authEnabled()) {
    const session = await auth0.getSession();
    bearerToken =
      session?.tokenSet?.idToken ??
      (session as unknown as { idToken?: string })?.idToken;
  }

  if (!bearerToken) return null;

  const query = /* GraphQL */ `
    query Me {
      me {
        nbbNumber
      }
    }
  `;

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });
  } catch {
    return null;
  }

  if (!res.ok) return null;

  const body = (await res.json()) as {
    data?: { me?: { nbbNumber?: string | null } | null };
    errors?: unknown;
  };

  if (body.errors || !body.data?.me) return null;
  return body.data.me.nbbNumber ?? null;
}

