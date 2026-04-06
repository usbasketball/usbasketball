"use client";

import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import NavLink from "./NavLink";
import MobileNav from "./MobileNav";
import LanguageSwitcher from "./LanguageSwitcher";
import {getNavItems} from "@/lib/constants";
import type {Locale, Dictionary} from "@/lib/i18n";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Header({locale, dict}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = getNavItems(locale, dict);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 shrink-0"
          >
            <Image
              src="/us_logo_png.avif"
              alt="U.S. Basketball"
              width={36}
              height={36}
              className="h-9 w-9"
            />
            <span className="text-gray-900 font-black text-base tracking-wide leading-none uppercase">
              U.S. Basketball
            </span>
          </Link>

          {/* Desktop nav + language switcher */}
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} />
              ))}
            </nav>
            <div className="border-l border-gray-200 pl-5">
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>

          {/* Hamburger (mobile) */}
          <button
            className="lg:hidden text-gray-700 hover:text-gray-900 transition-colors p-2 -mr-2"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
