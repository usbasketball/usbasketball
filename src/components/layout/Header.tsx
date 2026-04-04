"use client";

import { useState } from "react";
import Link from "next/link";
import NavLink from "./NavLink";
import MobileNav from "./MobileNav";
import LanguageSwitcher from "./LanguageSwitcher";
import { getNavItems } from "@/lib/constants";
import type { Locale, Dictionary } from "@/lib/i18n";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Header({ locale, dict }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = getNavItems(locale, dict);

  return (
    <>
      <header className="sticky top-0 z-30 bg-us-black border-b border-us-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
            <span className="text-us-red font-black text-xl tracking-tight leading-none">U.S.</span>
            <span className="text-us-white font-bold text-base tracking-wide leading-none uppercase">
              Basketball
            </span>
          </Link>

          {/* Desktop nav + language switcher */}
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} />
              ))}
            </nav>
            <div className="border-l border-us-gray-light pl-5">
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>

          {/* Hamburger (mobile) */}
          <button
            className="lg:hidden text-us-white hover:text-us-gold transition-colors p-2 -mr-2"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      <MobileNav
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        locale={locale}
        dict={dict}
      />
    </>
  );
}
