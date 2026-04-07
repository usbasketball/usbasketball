import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import {SITE_TAGLINE} from "@/lib/constants";
import {isValidLocale, getDictionary} from "@/lib/i18n";
import type {Locale} from "@/lib/i18n";
import {getAlternates} from "@/lib/seo";
import heroImage from "@/../public/kampioenschap-heren1.webp";
import InstagramFeed from "@/components/ui/InstagramFeed";

export async function generateStaticParams() {
  return [{locale: "nl"}, {locale: "en"}];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const isNl = locale === "nl";
  return {
    title: "U.S. Basketball Amsterdam",
    description: isNl
      ? "Basketbal, bier & ballen — U.S. Basketball Amsterdam heeft 12 teams voor dames en heren (18+). If you can't beat US, join US!"
      : "Basketball, beer & good vibes — U.S. Basketball Amsterdam has 12 teams for women and men (18+). If you can't beat US, join US!",
    alternates: getAlternates(locale),
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.home;

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          placeholder="blur"
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 px-4 sm:px-6 py-20 sm:py-28 text-center max-w-2xl flex flex-col items-center">
          <Image
            src="/us_logo_png.avif"
            alt="U.S. Basketball Amsterdam"
            width={80}
            height={80}
            className="h-20 w-20 mb-6 brightness-0 invert"
          />
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">
            {t.heroSubtitle}
          </p>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-none mb-4">
            U.S. Basketball
          </h1>
          <p className="text-white/60 text-lg mb-8 italic">{SITE_TAGLINE}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${locale}/aanmelden`}
              className="inline-flex items-center justify-center h-12 px-6 bg-white text-gray-900 font-bold text-sm uppercase tracking-wide hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              {t.registerBtn}
            </Link>
            <Link
              href={`/${locale}/informatie`}
              className="inline-flex items-center justify-center h-12 px-6 border border-white/30 text-white font-bold text-sm uppercase tracking-wide hover:border-white hover:bg-white/10 transition-all"
            >
              {t.aboutBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome */}
      <section className="bg-gray-50 px-4 sm:px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
            {t.welcome}
          </p>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-gray-900 mb-4">
            {t.welcomeTitle}
          </h2>
          <p className="text-gray-600 leading-relaxed">{t.welcomeText}</p>
        </div>
      </section>

      {/* Instagram */}
      <section className="bg-gray-50 px-4 sm:px-6 py-16">
        <div className="max-w-xl mx-auto">
          <InstagramFeed />
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 sm:px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="text-white font-black text-2xl uppercase">
              {t.newSeason}
            </h2>
            <p className="text-white/70 text-sm mt-1">{t.newSeasonText}</p>
          </div>
          <Link
            href={`/${locale}/aanmelden`}
            className="inline-flex items-center justify-center h-12 px-6 bg-white text-gray-900 font-bold text-sm uppercase tracking-wide hover:bg-gray-100 transition-all shrink-0"
          >
            {t.registerNow}
          </Link>
        </div>
      </section>
    </>
  );
}
