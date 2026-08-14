import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSiteName, siteConfig } from "@/lib/site";

function InstagramIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export async function Footer() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav");
  const locale = await getLocale();
  const siteName = getSiteName(locale);
  const year = new Date().getFullYear();

  const navLinks = [
    { href: "/about" as const, label: nav("about") },
    { href: "/membership" as const, label: nav("membership") },
    { href: "/schedule" as const, label: nav("schedule") },
    { href: "/faq" as const, label: nav("faq") },
    { href: "/signup" as const, label: nav("signup") },
    { href: "/login" as const, label: nav("account") },
  ];

  return (
    <footer className="bg-brand-darker text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center">
            <Image
              src="/Logo_US_DEF_mettekst.svg"
              alt={siteName}
              width={65}
              height={80}
              className="h-16 w-auto invert"
            />
          </div>
          <p className="mt-4 max-w-sm text-sm text-white/70">
            {t("tagline")}
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center border border-white/20 text-white/80 transition-colors hover:border-white hover:text-white"
            >
              <InstagramIcon />
            </a>
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center border border-white/20 text-white/80 transition-colors hover:border-white hover:text-white"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>

        <div>
          <p className="font-display text-lg uppercase tracking-wide text-white">
            {t("navigation")}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-lg uppercase tracking-wide text-white">
            {t("contact")}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>{siteConfig.email}</li>
            <li>{siteConfig.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        &copy; {year} {siteConfig.name}. {t("rights")}{" "}
        <Link href="/privacy" className="ml-2 transition-colors hover:text-white">
          {t("privacy")}
        </Link>
      </div>
    </footer>
  );
}
