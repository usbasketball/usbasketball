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
    <footer className="bg-us-gray border-t border-us-gray-light mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-us-red font-black text-xl">U.S.</span>
            <span className="text-us-white font-bold text-base uppercase tracking-wide">
              Basketball
            </span>
          </div>
          <p className="text-us-white/60 text-sm italic">{SITE_TAGLINE}</p>
          <div className="flex items-center gap-4 mt-1">
            {/* Instagram */}
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-us-white/60 hover:text-us-gold transition-colors"
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
              className="text-us-white/60 hover:text-us-gold transition-colors"
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
          <h3 className="text-us-gold text-xs font-bold uppercase tracking-widest mb-1">
            {dict.common.contact}
          </h3>
          <a
            href={ADDRESS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-us-white/70 hover:text-us-white text-sm transition-colors"
          >
            {ADDRESS.name}
            <br />
            {ADDRESS.street}
            <br />
            {ADDRESS.city}
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-us-white/70 hover:text-us-white text-sm transition-colors mt-1"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2">
          <h3 className="text-us-gold text-xs font-bold uppercase tracking-widest mb-1">
            {dict.common.links}
          </h3>
          <Link
            href={`/${locale}/aanmelden`}
            className="text-us-white/70 hover:text-us-white text-sm transition-colors"
          >
            {dict.nav.aanmelden}
          </Link>
          <Link
            href={`/${locale}/vertrouwenspersoon`}
            className="text-us-white/70 hover:text-us-white text-sm transition-colors"
          >
            {dict.footer.vertrouwenspersoon}
          </Link>
          <Link
            href={`/${locale}/help-us`}
            className="text-us-white/70 hover:text-us-white text-sm transition-colors"
          >
            {dict.nav.helpUs}
          </Link>
        </div>
      </div>

      <div className="border-t border-us-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center text-us-white/30 text-xs">
          &copy; {new Date().getFullYear()} {SITE_NAME} &mdash; Amsterdam
        </div>
      </div>
    </footer>
  );
}
