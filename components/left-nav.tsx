"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ActiveLink } from "@/components/active-link";
import { getSiteName } from "@/lib/site";

function MenuIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

type LeftNavProps = {
  items: Array<{ href: string; label: string }>;
  isLoggedIn: boolean;
};

export function LeftNav({ items, isLoggedIn }: LeftNavProps) {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const siteName = getSiteName(locale);
  const [open, setOpen] = useState(false);

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-40 hidden bg-black/60 lg:block"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <div
        className={`fixed inset-y-0 left-0 z-50 hidden flex-col border-r border-white/10 bg-black transition-all duration-300 ease-in-out lg:flex ${
          open ? "w-64 shadow-2xl" : "w-20"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            className="flex h-11 w-11 shrink-0 items-center justify-center text-white transition-colors hover:bg-white/10"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
          {open ? (
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center"
              aria-label={t("home")}
            >
              <Image
                src="/Logo_US_DEF_mettekst.svg"
                alt={siteName}
                width={34}
                height={42}
                className="h-10 w-auto invert"
                priority
              />
            </Link>
          ) : null}
        </div>

        {open ? (
          <>
            <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
              {items.map((item) => (
                <ActiveLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-l-2 border-transparent px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  activeClassName="border-l-2 border-white bg-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white"
                >
                  {item.label}
                </ActiveLink>
              ))}
            </nav>
            <div className="space-y-5 border-t border-white/10 px-5 py-5">
              <div className="flex items-center justify-between gap-2">
                {isLoggedIn ? (
                  <Link
                    href="/me"
                    onClick={() => setOpen(false)}
                    className="text-sm font-semibold uppercase tracking-wide text-white/70 transition-colors hover:text-white"
                  >
                    {t("account")}
                  </Link>
                ) : (
                  // eslint-disable-next-line @next/next/no-html-link-for-pages -- Auth0 route, intentionally a plain <a>
                  <a
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="text-sm font-semibold uppercase tracking-wide text-white/70 transition-colors hover:text-white"
                  >
                    {t("login")}
                  </a>
                )}
                <LocaleSwitcher variant="dark" />
              </div>
              {isLoggedIn ? (
                // eslint-disable-next-line @next/next/no-html-link-for-pages -- Auth0 route, intentionally a plain <a>
                <a
                  href="/auth/logout"
                  onClick={() => setOpen(false)}
                  className="block bg-white px-5 py-3 text-center text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-white"
                >
                  {t("logout")}
                </a>
              ) : (
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="block bg-white px-5 py-3 text-center text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-white"
                >
                  {t("signup")}
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-start justify-center pt-10">
            <Link href="/" className="flex items-center" aria-label={t("home")}>
              <Image
                src="/Logo_US_DEF_mettekst.svg"
                alt={siteName}
                width={34}
                height={42}
                className="h-10 w-auto invert"
                priority
              />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
