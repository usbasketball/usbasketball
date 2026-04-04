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

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Informatie", href: "/informatie" },
  { label: "Nieuws", href: "/nieuws" },
  { label: "Trainingschema", href: "/trainingschema" },
  { label: "Takenschema", href: "/takenschema" },
  { label: "Help US", href: "/help-us" },
  { label: "Contact", href: "/contact" },
  { label: "Aanmelden", href: "/aanmelden" },
] as const;
