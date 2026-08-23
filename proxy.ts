import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { auth0, authEnabled } from "@/lib/auth";

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  if (!authEnabled()) {
    if (request.nextUrl.pathname.startsWith("/auth")) {
      return new NextResponse("Authentication is not configured.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    return handleI18nRouting(request);
  }

  // Auth0 handles /auth/login, /auth/logout and /auth/callback; on all other
  // routes its pass-through response carries session rolling cookies that we
  // merge into the i18n response (see SDK docs on combining middlewares).
  const authResponse = await auth0.middleware(request);

  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authResponse;
  }

  const response = handleI18nRouting(request);

  for (const [key, value] of authResponse.headers) {
    if (key.toLowerCase() === "x-middleware-next" && response.status >= 300) {
      continue;
    }
    response.headers.append(key, value);
  }

  return response;
}

export const config = {
  matcher: "/((?!api|trpc|sentry-tunnel|_next|_vercel|.*\\..*).*)",
};
