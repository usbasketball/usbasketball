import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

export async function Footer() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-bold text-zinc-900 dark:text-zinc-50">
            {siteConfig.name}
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {t("tagline")}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {t("navigation")}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              <Link href="/about" className="hover:text-orange-600">
                {nav("about")}
              </Link>
            </li>
            <li>
              <Link href="/teams" className="hover:text-orange-600">
                {nav("teams")}
              </Link>
            </li>
            <li>
              <Link href="/membership" className="hover:text-orange-600">
                {nav("membership")}
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-orange-600">
                {nav("signup")}
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-orange-600">
                {nav("account")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {t("contact")}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <li>{siteConfig.email}</li>
            <li>{siteConfig.address}</li>
            <li>
              <Link href="/privacy" className="hover:text-orange-600">
                {t("privacy")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
        &copy; {year} {siteConfig.name}. {t("rights")}
      </div>
    </footer>
  );
}
