export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "US Basketbal",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    ""
  ),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "bestuur@usbasketball.nl",
  secretariatEmail: process.env.NEXT_PUBLIC_SECRETARIAT_EMAIL ?? "secretaris@usbasketball.nl",
  technicalCommitteeEmail: process.env.NEXT_PUBLIC_TC_EMAIL ?? "tc@usbasketball.nl",
  address: "Tweede Boerhaavestraat 10, 1091BD Amsterdam",
  city: "Amsterdam",
  country: "NL",
  foundedYear: 1951,
  social: {
    instagram: "https://www.instagram.com/usbasketbal/",
    facebook: "https://www.facebook.com/usbasketbal",
  },
} as const;

type JsonLdObject = Record<string, unknown>;

export function organizationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    foundingDate: String(siteConfig.foundedYear),
    sport: "Basketball",
    location: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.city,
        addressCountry: siteConfig.country,
      },
    },
  };
}

export function websiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: ["nl", "en"],
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function scheduleJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "US Basketball Wednesday trainings",
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
