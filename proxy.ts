import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import {
  isRegisterPathname,
  isRegistrationAccessValid,
} from "@/lib/registration-link";

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  if (isRegisterPathname(request.nextUrl.pathname)) {
    const accessValid = await isRegistrationAccessValid({
      secret: process.env.REGISTRATION_SECRET,
      expires: request.nextUrl.searchParams.get("expires"),
      token: request.nextUrl.searchParams.get("token"),
    });

    if (!accessValid) {
      return new NextResponse(
        "Access denied: missing, invalid or expired registration link.",
        {
          status: 403,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        }
      );
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: "/((?!api|trpc|sentry-tunnel|_next|_vercel|.*\\..*).*)",
};
