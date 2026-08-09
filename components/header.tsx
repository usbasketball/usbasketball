import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { LocaleSwitcher } from "@/components/locale-switcher";

export async function Header() {
  const t = await getTranslations("Nav");

  const items = [
    { href: "/" as const, label: t("home") },
    { href: "/about" as const, label: t("about") },
    { href: "/teams" as const, label: t("teams") },
    { href: "/membership" as const, label: t("membership") },
  ];

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          {siteConfig.name}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 md:flex dark:text-zinc-300">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-orange-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-orange-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
          >
            {t("signup")}
          </Link>
        </div>
      </div>
    </header>
  );
}
