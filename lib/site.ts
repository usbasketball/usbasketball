export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "US Basketball NL",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    ""
  ),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@usbasketballnl.example",
  address: "Sportpark Olympos, 3584 JL Utrecht",
  city: "Utrecht",
  country: "NL",
  foundedYear: 1985,
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
