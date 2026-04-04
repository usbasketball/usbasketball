"use client";

import NavLink from "./NavLink";
import LanguageSwitcher from "./LanguageSwitcher";
import { getNavItems } from "@/lib/constants";
import type { Locale, Dictionary } from "@/lib/i18n";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  dict: Dictionary;
}

export default function MobileNav({ isOpen, onClose, locale, dict }: MobileNavProps) {
  const navItems = getNavItems(locale, dict);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-us-gray flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Close button */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-us-gray-light">
          <span className="text-us-gold font-bold tracking-widest text-sm uppercase">
            {dict.common.menu}
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-us-white hover:text-us-gold transition-colors p-1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 p-6 flex-1">
          {navItems.map((item) => (
            <div key={item.href} className="py-3 border-b border-us-gray-light">
              <NavLink href={item.href} label={item.label} onClick={onClose} />
            </div>
          ))}
        </nav>

        {/* Language switcher at bottom */}
        <div className="px-6 py-5 border-t border-us-gray-light">
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </div>
    </>
  );
}
