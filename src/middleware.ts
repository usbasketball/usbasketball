import {NextRequest, NextResponse} from "next/server";
import {locales, defaultLocale, isValidLocale} from "@/lib/i18n";

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // Check if the pathname already has a valid locale
  const pathnameLocale = pathname.split("/")[1];
  if (isValidLocale(pathnameLocale)) {
    return NextResponse.next();
  }

  // Skip internal Next.js paths and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
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
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon\\.ico|images).*)"],
};
