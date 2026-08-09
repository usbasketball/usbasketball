import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

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
