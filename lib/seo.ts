import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { getSiteName, siteConfig } from "@/lib/site";

const OG_IMAGE = "/images/hero.jpg";

export function localizedAlternates(
  pathname: string
): NonNullable<Metadata["alternates"]> {
  const base = pathname === "/" ? "" : pathname;
  const languages: Record<string, string> = {
    "x-default": `${siteConfig.url}/${routing.defaultLocale}${base}`,
  };
  for (const locale of routing.locales) {
    languages[locale] = `${siteConfig.url}/${locale}${base}`;
  }
  return {
    canonical: languages[routing.defaultLocale],
    languages,
  };
}

type PageMetadataOptions = {
  locale: string;
  pathname: string;
  title: string;
  description: string;
  robots?: Metadata["robots"];
};

export function pageMetadata({
  locale,
  pathname,
  title,
  description,
  robots,
}: PageMetadataOptions): Metadata {
  const path = pathname === "/" ? "" : pathname;
  const url = `${siteConfig.url}/${locale}${path}`;
  const ogLocale = locale === "nl" ? "nl_NL" : "en_US";
  const alternateLocale = locale === "nl" ? ["en_US"] : ["nl_NL"];
  const siteName = getSiteName(locale);
  const imageAlt = siteName;

  return {
    title,
    description,
    alternates: localizedAlternates(pathname),
    openGraph: {
      type: "website",
      siteName,
      title,
      description,
      url,
      locale: ogLocale,
      alternateLocale,
      images: [{ url: OG_IMAGE, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
    ...(robots !== undefined ? { robots } : {}),
  };
}
