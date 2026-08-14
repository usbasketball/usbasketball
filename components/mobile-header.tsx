"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MobileNav } from "@/components/mobile-nav";
import { getSiteName } from "@/lib/site";

type MobileHeaderProps = {
  items: Array<{ href: string; label: string }>;
};

export function MobileHeader({ items }: MobileHeaderProps) {
  const locale = useLocale();
  const siteName = getSiteName(locale);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      if (y > lastY.current && y > 120) {
        setHidden(true);
        setMenuOpen(false);
      } else if (y < lastY.current) {
        setHidden(false);
      }
      lastY.current = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b border-white/10 bg-black transition-[transform,opacity] duration-300 ease-in-out lg:hidden ${
        hidden ? "-translate-y-[70%] opacity-40" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/Logo_US_DEF_mettekst.svg"
            alt={siteName}
            width={54}
            height={66}
            className="h-14 w-auto invert"
            priority
          />
        </Link>
        <MobileNav items={items} open={menuOpen} onOpenChange={setMenuOpen} />
      </div>
    </header>
  );
}
