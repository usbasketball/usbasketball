import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: "/((?!api|trpc|sentry-tunnel|_next|_vercel|.*\\..*).*)",
};
