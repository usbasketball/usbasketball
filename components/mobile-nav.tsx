"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ActiveLink } from "@/components/active-link";

type MobileNavProps = {
  items: Array<{ href: string; label: string }>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoggedIn: boolean;
};

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

type MobileNavOverlayProps = MobileNavProps;

export function MobileNavOverlay({ items, open, onOpenChange, isLoggedIn }: MobileNavOverlayProps) {
  const t = useTranslations("Nav");

  return (
    <div
      className={`fixed inset-x-0 bottom-0 top-20 z-50 overflow-y-auto border-b border-white/10 bg-black shadow-lg transition-opacity duration-300 ease-in-out ${
        open
          ? "opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div className="mx-auto flex min-h-full max-w-6xl flex-col px-4 py-6 sm:px-6">
        <nav className="flex flex-col">
          {items.map((item) => (
            <ActiveLink
              key={item.href}
              href={item.href}
              onClick={() => onOpenChange(false)}
              className="border-b border-white/10 py-4 text-base font-semibold uppercase tracking-wide text-white/70 transition-colors hover:text-white"
              activeClassName="border-b border-white/10 bg-white/10 py-4 text-base font-semibold uppercase tracking-wide text-white"
            >
              {item.label}
            </ActiveLink>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between gap-4">
            {isLoggedIn ? (
              <Link
                href="/me"
                onClick={() => onOpenChange(false)}
                className="text-sm font-semibold uppercase tracking-wide text-white/70 transition-colors hover:text-white"
              >
                {t("account")}
              </Link>
            ) : (
              // eslint-disable-next-line @next/next/no-html-link-for-pages -- Auth0 route, intentionally a plain <a>
              <a
                href="/auth/login"
                onClick={() => onOpenChange(false)}
                className="text-sm font-semibold uppercase tracking-wide text-white/70 transition-colors hover:text-white"
              >
                {t("login")}
              </a>
            )}
            <LocaleSwitcher variant="dark" />
          </div>

          <div className="mt-4">
            {isLoggedIn ? (
              // eslint-disable-next-line @next/next/no-html-link-for-pages -- Auth0 route, intentionally a plain <a>
              <a
                href="/auth/logout"
                onClick={() => onOpenChange(false)}
                className="inline-flex w-full items-center justify-center bg-white px-5 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-white"
              >
                {t("logout")}
              </a>
            ) : (
              <Link
                href="/signup"
                onClick={() => onOpenChange(false)}
                className="inline-flex w-full items-center justify-center bg-white px-5 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-white"
              >
                {t("signup")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileNav({ items, open, onOpenChange, isLoggedIn }: MobileNavProps) {
  const t = useTranslations("Nav");

  // The header carries `translate-y-*`/opacity classes for its hide-on-scroll
  // animation. A value on the CSS `translate` property makes the header the
  // containing block for `position: fixed` descendants, which would collapse a
  // `fixed` overlay to the header's height. Portaling the overlay to <body>
  // keeps it relative to the viewport regardless of the header's transform.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-label={t(open ? "closeMenu" : "openMenu")}
        onClick={() => onOpenChange(!open)}
        className="flex h-11 w-11 items-center justify-center border border-white/20 text-white transition-colors hover:bg-white/10"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {mounted
        ? createPortal(
            <MobileNavOverlay
              items={items}
              open={open}
              onOpenChange={onOpenChange}
              isLoggedIn={isLoggedIn}
            />,
            document.body,
          )
        : null}
    </div>
  );
}
