"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type LocaleSwitcherProps = {
  variant?: "light" | "dark";
};

export function LocaleSwitcher({
  variant = "light",
}: LocaleSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale(nextLocale: string) {
    if (nextLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  const isDark = variant === "dark";

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-none text-sm font-medium ${
        isDark ? "text-white" : "text-ink"
      }`}
      aria-label="Language"
    >
      {routing.locales.map((loc) => {
        const isActive = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchLocale(loc)}
            disabled={isPending}
            className={`px-2 py-1 uppercase transition-colors ${
              isActive
                ? isDark
                  ? "bg-white/20 text-white"
                  : "bg-accent text-white"
                : isDark
                  ? "text-white/60 hover:text-white"
                  : "text-ink/50 hover:text-ink"
            }`}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
