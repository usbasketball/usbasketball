"use client";

import Image from "next/image";
import {useUser} from "@auth0/nextjs-auth0";
import type {Dictionary} from "@/lib/i18n";

interface AuthButtonsProps {
  dict: Dictionary;
  locale: string;
}

export default function AuthButtons({dict, locale}: AuthButtonsProps) {
  const {user, isLoading} = useUser();

  if (isLoading) return null;

  if (!user) {
    return (
      <a
        href={`/auth/login?returnTo=/${locale}`}
        className="text-sm font-semibold tracking-wide uppercase text-gray-700 hover:text-gray-900 transition-colors"
      >
        {dict.login.login}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-2">
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
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/auth/logout"
        className="text-sm font-semibold tracking-wide uppercase text-gray-500 hover:text-gray-900 transition-colors"
      >
        {dict.login.logout}
      </a>
    </div>
  );
}
