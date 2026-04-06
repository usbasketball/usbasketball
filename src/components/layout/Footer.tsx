import Image from "next/image";
import Link from "next/link";
import {
  ADDRESS,
  CONTACT_EMAIL,
  SITE_NAME,
  SITE_TAGLINE,
  SOCIAL,
} from "@/lib/constants";
import type {Locale, Dictionary} from "@/lib/i18n";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Footer({locale, dict}: FooterProps) {
  return (
    <footer className="bg-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/us_logo_png.avif"
              alt="U.S. Basketball"
              width={28}
              height={28}
              className="h-7 w-7 brightness-0 invert"
            />
            <span className="text-white font-black text-base uppercase tracking-wide">
              U.S. Basketball
            </span>
          </div>
          <p className="text-gray-400 text-sm italic">{SITE_TAGLINE}</p>
          <div className="flex items-center gap-4 mt-1">
            {/* Instagram */}
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
            {/* Facebook */}
            <a
              href={SOCIAL.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-2">
          <h3 className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-1">
            {dict.common.contact}
          </h3>
          <a
            href={ADDRESS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            {ADDRESS.name}
            <br />
            {ADDRESS.street}
            <br />
            {ADDRESS.city}
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-gray-400 hover:text-white text-sm transition-colors mt-1"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2">
          <h3 className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-1">
            {dict.common.links}
          </h3>
          <Link
            href={`/${locale}/aanmelden`}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            {dict.nav.aanmelden}
          </Link>
          <Link
            href={`/${locale}/vertrouwenspersoon`}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            {dict.footer.vertrouwenspersoon}
          </Link>
          <Link
            href={`/${locale}/help-us`}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            {dict.nav.helpUs}
          </Link>
          <Link
            href={`/${locale}/privacy`}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            {dict.footer.privacy}
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center text-gray-600 text-xs">
          &copy; {new Date().getFullYear()} {SITE_NAME}
        </div>
      </div>
    </footer>
  );
}
