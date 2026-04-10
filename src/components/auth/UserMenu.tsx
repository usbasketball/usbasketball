"use client";

import {useRef, useState, useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import {useUser} from "@auth0/nextjs-auth0";
import type {Dictionary} from "@/lib/i18n";

interface UserMenuProps {
  dict: Dictionary;
  locale: string;
}

export default function UserMenu({dict, locale}: UserMenuProps) {
  const {user, isLoading} = useUser();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) return null;

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        {}
        <a
          href={`/auth/login?returnTo=/${locale}`}
          className="inline-flex items-center justify-center h-9 px-4 border border-gray-300 text-sm font-bold uppercase tracking-wide text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors"
        >
          {dict.login.login}
        </a>
        <Link
          href={`/${locale}/aanmelden`}
          className="inline-flex items-center justify-center h-9 px-4 bg-gray-900 text-white text-sm font-bold uppercase tracking-wide hover:bg-gray-700 transition-colors"
        >
          {dict.nav.aanmelden}
        </Link>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center cursor-pointer focus:outline-none rounded-full ring-2 ring-transparent hover:ring-4 hover:ring-gray-100 transition-all"
        aria-label={dict.login.account}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {user.picture ? (
          <Image
            src={user.picture as string}
            alt={String(user.name ?? "User")}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
            referrerPolicy="no-referrer"
            unoptimized
          />
        ) : (
          <span className="h-8 w-8 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center uppercase">
            {String(user.name ?? user.email ?? "?").charAt(0)}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg border border-gray-100 py-2 z-50">
          {/* User info */}
          <div className="px-4 py-2 border-b border-gray-100">
            {user.name && (
              <p className="text-gray-900 font-semibold text-sm truncate">
                {String(user.name)}
              </p>
            )}
            {user.email && (
              <p className="text-gray-400 text-xs truncate">
                {String(user.email)}
              </p>
            )}
          </div>

          {/* Logout */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/auth/logout"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {dict.login.logout}
          </a>
        </div>
      )}
    </div>
  );
}
