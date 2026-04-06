import {
  SITE_NAME,
  SITE_TAGLINE,
  ADDRESS,
  SOCIAL,
  CONTACT_EMAIL,
} from "@/lib/constants";
import {BASE_URL} from "@/lib/seo";
import type {Locale} from "@/lib/i18n";

export default function JsonLd({locale}: {locale: Locale}) {
  const sportsOrganization = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "U.S. Basketball Amsterdam",
    alternateName: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/icon.png`,
    description:
      locale === "nl"
        ? "Basketbalclub in Amsterdam met dames- en herenteams voor spelers 18+."
        : "Basketball club in Amsterdam with women's and men's teams for players 18+.",
    sport: "Basketball",
    email: CONTACT_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS.street,
      addressLocality: "Amsterdam",
      postalCode: "1091 AN",
      addressCountry: "NL",
    },
    location: {
      "@type": "Place",
      name: ADDRESS.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: ADDRESS.street,
        addressLocality: "Amsterdam",
        postalCode: "1091 AN",
        addressCountry: "NL",
      },
    },
    sameAs: [SOCIAL.instagram, SOCIAL.facebook],
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "U.S. Basketball Amsterdam",
    alternateName: SITE_TAGLINE,
    url: BASE_URL,
    inLanguage: ["nl", "en"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(sportsOrganization)}}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(webSite)}}
      />
    </>
  );
}
