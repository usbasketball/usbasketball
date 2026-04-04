"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
}

export default function NavLink({ href, label, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        text-sm font-medium tracking-wide uppercase transition-colors duration-150
        ${isActive ? "text-us-gold" : "text-us-white hover:text-us-gold"}
      `}
    >
      {label}
    </Link>
  );
}
