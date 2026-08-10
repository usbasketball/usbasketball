"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ActiveLink } from "@/components/active-link";

type MobileNavProps = {
  items: Array<{ href: string; label: string }>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function MobileNav({ items, open, onOpenChange }: MobileNavProps) {
  const t = useTranslations("Nav");

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

      <div
        className={`absolute inset-x-0 top-20 overflow-hidden border-b border-white/10 bg-black shadow-lg transition-all duration-300 ease-in-out ${
          open
            ? "max-h-[480px] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
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

          <div className="mt-6 flex items-center justify-between gap-4">
            <Link
              href="/login"
              onClick={() => onOpenChange(false)}
              className="text-sm font-semibold uppercase tracking-wide text-white/70 transition-colors hover:text-white"
            >
              {t("login")}
            </Link>
            <LocaleSwitcher variant="dark" />
          </div>

          <Link
            href="/signup"
            onClick={() => onOpenChange(false)}
            className="mt-4 inline-flex w-full items-center justify-center bg-white px-5 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-white"
          >
            {t("signup")}
          </Link>
        </div>
      </div>
    </div>
  );
}
