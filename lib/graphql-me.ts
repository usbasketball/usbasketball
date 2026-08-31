import { cookies } from "next/headers";

export async function fetchMyNbbNumber(): Promise<string | null> {
  const endpoint = process.env.BESTUUR_GRAPHQL_URL;
  if (!endpoint) return null;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

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
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
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
