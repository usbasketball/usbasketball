"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = {
  en: "English",
  nl: "Nederlands",
};

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

  function onSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  const isDark = variant === "dark";

  return (
    <select
      aria-label="Language"
      defaultValue={locale}
      onChange={onSelectChange}
      disabled={isPending}
      className={
        isDark
          ? "rounded-none border border-white/20 bg-black/40 px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white"
          : "rounded-none border border-line bg-white px-2 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
      }
    >
      {routing.locales.map((loc) => (
        <option key={loc} value={loc}>
          {LABELS[loc] ?? loc}
        </option>
      ))}
    </select>
  );
}
