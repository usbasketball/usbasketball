import type {Metadata} from "next";
import type {Locale} from "@/lib/i18n";

export const BASE_URL = "https://www.usbasketball.nl";

export function getAlternates(
  locale: Locale,
  path: string = "",
): Metadata["alternates"] {
  return {
    canonical: `${BASE_URL}/${locale}${path}`,
    languages: {
      nl: `${BASE_URL}/nl${path}`,
      en: `${BASE_URL}/en${path}`,
    },
  };
}
