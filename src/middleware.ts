import {auth0} from "@/lib/auth0";
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {locales, defaultLocale, isValidLocale} from "@/lib/i18n";

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // Delegate all /auth/* routes to the Auth0 SDK (login, logout, callback, profile, etc.)
  if (pathname.startsWith("/auth")) {
    return await auth0.middleware(request);
  }

  // Skip internal Next.js paths and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // If pathname already has a valid locale, call auth0.middleware for session rolling
  const pathnameLocale = pathname.split("/")[1];
  if (isValidLocale(pathnameLocale)) {
    return await auth0.middleware(request);
  }

  // Try to detect preferred locale from Accept-Language header
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const preferredLocale = locales.find((locale) =>
    acceptLanguage.toLowerCase().includes(locale),
  );

  const locale = preferredLocale ?? defaultLocale;

  // Redirect to the locale-prefixed path
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
