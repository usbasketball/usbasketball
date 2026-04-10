"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function NavLink({href, label, onClick, disabled}: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  if (disabled) {
    return (
      <span className="text-sm font-medium tracking-wide uppercase text-gray-300 cursor-not-allowed select-none">
        {label}
      </span>
    );
  }

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
