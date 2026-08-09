"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = {
  en: "English",
  nl: "Nederlands",
};

export function LocaleSwitcher() {
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

  return (
    <select
      aria-label="Language"
      defaultValue={locale}
      onChange={onSelectChange}
      disabled={isPending}
      className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
    >
      {routing.locales.map((loc) => (
        <option key={loc} value={loc}>
          {LABELS[loc] ?? loc}
        </option>
      ))}
    </select>
  );
}
