"use client";

import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";

type ActiveLinkProps = {
  href: string;
  className: string;
  activeClassName?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export function ActiveLink({
  href,
  className,
  activeClassName = "",
  children,
  onClick,
}: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={isActive ? activeClassName : className}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
