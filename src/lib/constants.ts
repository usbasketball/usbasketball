import type {Locale, Dictionary} from "@/lib/i18n";
import {getUserRoles} from "@/lib/auth0";
import {User} from "@auth0/nextjs-auth0/types";

export const SITE_NAME = "U.S. Basketball";
export const SITE_TAGLINE = "If you can't beat US, Join US!";
export const CONTACT_EMAIL = "bestuur@usbasketball.nl";

export const ADDRESS = {
  name: "Amstelcampushal",
  street: "Tweede Boerhaavestraat 10",
  city: "1091 AN Amsterdam",
  mapsUrl:
    "https://maps.google.com/?q=Amstelcampushal,+Tweede+Boerhaavestraat+10,+1091+AN+Amsterdam",
};

export const SOCIAL = {
  instagram: "https://instagram.com/usbasketbal",
  instagramHandle: "@usbasketbal",
  facebook: "https://facebook.com/usbasketbal",
};

/**
 * Determines whether a nav item should be visible given the current user.
 *
 * visibility values:
 *   "public"        — visible to everyone
 *   "guest"         — visible only when NOT logged in
 *   "authenticated" — visible to any logged-in user
 *   "role:<name>"   — visible to users with the named Auth0 role (e.g. "role:bestuur")
 */
export function isNavItemVisible(
  visibility: string,
  user: User | undefined,
): boolean {
  if (visibility === "public") return true;
  if (visibility === "guest") return !user;
  if (visibility === "authenticated") return !!user;
  if (visibility.startsWith("role:")) {
    return getUserRoles(user).includes(visibility.slice(5));
  }
  return false;
}

export function getNavItems(locale: Locale, dict: Dictionary) {
  return [
    {
      label: dict.nav.informatie,
      href: `/${locale}/informatie`,
      visibility: "public",
    },
    {
      label: dict.nav.trainingschema,
      href: `/${locale}/trainingschema`,
      visibility: "authenticated",
    },
    {
      label: dict.nav.takenschema,
      href: `/${locale}/takenschema`,
      visibility: "authenticated",
    },
    {
      label: dict.nav.vergaderingen,
      href: `/${locale}/vergaderingen`,
      visibility: "authenticated",
    },
    {
      label: dict.nav.reglementen,
      href: `/${locale}/reglementen`,
      visibility: "authenticated",
    },
    {
      label: dict.nav.aanmelden,
      href: `/${locale}/aanmelden`,
      visibility: "guest",
    },
    {
      label: dict.nav.dashboard,
      href: `/${locale}/dashboard`,
      visibility: "role:Bestuur",
      disabled: false,
    },
  ];
}
