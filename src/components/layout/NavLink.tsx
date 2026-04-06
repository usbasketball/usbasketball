"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
}

export default function NavLink({href, label, onClick}: NavLinkProps) {
  const pathname = usePathname();
  // Active if exact match or sub-path (but not root clashing with sub-pages)
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        text-sm font-medium tracking-wide uppercase transition-colors duration-150
        ${isActive ? "text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-900"}
      `}
    >
      {label}
    </Link>
  );
}
