"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();

  function getLocalePath(locale: Locale) {
    // Replace /nl/... or /en/... with /<locale>/...
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/") || "/";
  }

  return (
    <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && <span className="text-us-gray-light">/</span>}
          {locale === currentLocale ? (
            <span className="text-us-gold">{locale.toUpperCase()}</span>
          ) : (
            <Link
              href={getLocalePath(locale)}
              className="text-us-white/50 hover:text-us-white transition-colors"
            >
              {locale.toUpperCase()}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
