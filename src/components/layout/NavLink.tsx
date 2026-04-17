"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  isRoleGated?: boolean;
}

export default function NavLink({
  href,
  label,
  onClick,
  disabled,
  isRoleGated,
}: NavLinkProps) {
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

  if (isRoleGated) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`
          inline-flex items-center gap-1.5 text-sm font-medium tracking-wide uppercase transition-colors duration-150
          ${isActive ? "text-amber-700 font-semibold" : "text-amber-600 hover:text-amber-800"}
        `}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="shrink-0 opacity-80"
        >
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
        </svg>
        {label}
      </Link>
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
