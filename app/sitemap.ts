import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

const pathnames = ["", "/about", "/schedule", "/membership", "/faq", "/privacy", "/signup"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const pathname of pathnames) {
      const languages: Record<string, string> = {
        "x-default": `${siteConfig.url}/${routing.defaultLocale}${pathname}`,
      };
      for (const l of routing.locales) {
        languages[l] = `${siteConfig.url}/${l}${pathname}`;
      }

      entries.push({
        url: `${siteConfig.url}/${locale}${pathname}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: pathname === "" ? 1 : 0.8,
        alternates: { languages },
      });
    }
  }

  return entries;
}
