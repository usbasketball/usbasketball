import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {locales, defaultLocale, isValidLocale} from "@/lib/i18n";

const isProtectedRoute = createRouteMatcher([
  "/:locale/takenschema(.*)",
  "/:locale/trainingschema(.*)",
  "/:locale/vertrouwenspersoon(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const {pathname} = request.nextUrl;

  // Protect GDPR-sensitive routes — redirect to Clerk sign-in if not authenticated
  if (isProtectedRoute(request)) {
    await auth.protect();
  }

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
  return NextResponse.redirect(url, 308);
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
