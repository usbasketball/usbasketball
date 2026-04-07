import type {Locale, Dictionary} from "@/lib/i18n";

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

export function getNavItems(locale: Locale, dict: Dictionary) {
  return [
    {label: dict.nav.informatie, href: `/${locale}/informatie`},
    {label: dict.nav.trainingschema, href: `/${locale}/trainingschema`},
    {label: dict.nav.takenschema, href: `/${locale}/takenschema`},
    {label: dict.nav.aanmelden, href: `/${locale}/aanmelden`},
  ] as const;
}
