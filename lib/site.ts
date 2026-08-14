export const siteNames = {
  nl: "US Basketbal",
  en: "US Basketball",
} as const;

export function getSiteName(locale: string): string {
  return siteNames[locale as keyof typeof siteNames] ?? siteNames.nl;
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? siteNames.nl,
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    ""
  ),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "bestuur@usbasketball.nl",
  secretariatEmail:
    process.env.NEXT_PUBLIC_SECRETARIAT_EMAIL ?? "secretaris@usbasketball.nl",
  technicalCommitteeEmail:
    process.env.NEXT_PUBLIC_TC_EMAIL ?? "tc@usbasketball.nl",
  address: "Tweede Boerhaavestraat 10, 1091BD Amsterdam",
  streetAddress: "Tweede Boerhaavestraat 10",
  postalCode: "1091BD",
  city: "Amsterdam",
  country: "NL",
  foundedYear: 1951,
  social: {
    instagram: "https://www.instagram.com/usbasketbal/",
    facebook: "https://www.facebook.com/usbasketbal",
  },
} as const;

type JsonLdObject = Record<string, unknown>;

function alternateSiteName(locale: string): string {
  return locale === "nl" ? siteNames.en : siteNames.nl;
}

export function organizationJsonLd(locale: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "@id": `${siteConfig.url}/#organization`,
    name: getSiteName(locale),
    alternateName: alternateSiteName(locale),
    url: siteConfig.url,
    email: siteConfig.email,
    foundingDate: String(siteConfig.foundedYear),
    sport: "Basketball",
    logo: `${siteConfig.url}/Logo_US_DEF_mettekst.svg`,
    sameAs: [siteConfig.social.instagram, siteConfig.social.facebook],
    location: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.streetAddress,
        postalCode: siteConfig.postalCode,
        addressLocality: siteConfig.city,
        addressCountry: siteConfig.country,
      },
    },
  };
}

export function websiteJsonLd(locale: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: getSiteName(locale),
    alternateName: alternateSiteName(locale),
    url: siteConfig.url,
    inLanguage: ["nl", "en"],
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function scheduleJsonLd(locale: string): JsonLdObject {
  const clubName = getSiteName(locale);
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name:
      locale === "nl"
        ? `${clubName} woensdagtrainingen`
        : `${clubName} Wednesday trainings`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    organizer: { "@id": `${siteConfig.url}/#organization` },
    location: {
      "@type": "Place",
      name: "Amstelcampushal",
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.city,
        addressCountry: siteConfig.country,
      },
    },
    schedule: {
      "@type": "Schedule",
      byDay: "http://schema.org/Wednesday",
      repeatFrequency: "P1W",
    },
  };
}

export type FaqItem = {
  question: string;
  answer: string;
};

export function faqJsonLd(items: FaqItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
