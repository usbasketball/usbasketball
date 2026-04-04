import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ADDRESS, CONTACT_EMAIL, SITE_TAGLINE, SOCIAL } from "@/lib/constants";
import { isValidLocale, getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export async function generateStaticParams() {
  return [{ locale: "nl" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isNl = locale === "nl";
  return {
    title: "U.S. Basketball Amsterdam",
    description: isNl
      ? "Welkom bij U.S. Basketball Amsterdam — basketbalclub met 12 teams voor spelers 18+."
      : "Welcome to U.S. Basketball Amsterdam — basketball club with 12 teams for players 18+.",
  };
}

const newsPlaceholders: Record<Locale, { title: string; date: string }[]> = {
  nl: [
    { title: "Trainingstijden 2024-2025 bekend", date: "Sep 2024" },
    { title: "US zoekt nieuwe bestuursleden", date: "Okt 2024" },
    { title: "Wedstrijdprogramma seizoen gestart", date: "Nov 2024" },
  ],
  en: [
    { title: "Training times 2024-2025 announced", date: "Sep 2024" },
    { title: "US looking for new board members", date: "Oct 2024" },
    { title: "Match schedule for the season has started", date: "Nov 2024" },
  ],
};

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.home;
  const news = newsPlaceholders[locale];

  return (
    <>
      {/* Hero */}
      <section className="bg-us-black px-4 sm:px-6 py-20 sm:py-28 flex flex-col items-center text-center">
        <div className="max-w-2xl">
          <p className="text-us-gold text-xs font-bold uppercase tracking-widest mb-4">
            {t.heroSubtitle}
          </p>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-us-white uppercase leading-none mb-4">
            U.S. <span className="text-us-red">Basketball</span>
          </h1>
          <p className="text-us-white/60 text-lg mb-8 italic">{SITE_TAGLINE}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${locale}/aanmelden`}
              className="inline-flex items-center justify-center h-12 px-6 bg-us-red text-us-white font-bold text-sm uppercase tracking-wide rounded hover:bg-us-orange transition-colors"
            >
              {t.registerBtn}
            </Link>
            <Link
              href={`/${locale}/informatie`}
              className="inline-flex items-center justify-center h-12 px-6 border border-us-gray-light text-us-white font-bold text-sm uppercase tracking-wide rounded hover:border-us-gold hover:text-us-gold transition-colors"
            >
              {t.aboutBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome */}
      <section className="bg-us-gray px-4 sm:px-6 py-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-us-gold text-xs font-bold uppercase tracking-widest mb-3">
              {t.welcome}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-us-white mb-4">
              {t.welcomeTitle}
            </h2>
            <p className="text-us-white/70 leading-relaxed">{t.welcomeText}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: t.teams, value: "12" },
              { label: t.womensTeams, value: "6" },
              { label: t.mensTeams, value: "6" },
              { label: t.season, value: "2024–25" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-us-gray-light rounded p-4 flex flex-col items-center text-center"
              >
                <span className="text-3xl font-black text-us-red">{stat.value}</span>
                <span className="text-us-white/50 text-xs uppercase tracking-wide mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News preview */}
      <section className="bg-us-black px-4 sm:px-6 py-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-us-gold text-xs font-bold uppercase tracking-widest mb-1">
                {t.news}
              </p>
              <h2 className="text-2xl font-black uppercase text-us-white">{t.usNews}</h2>
            </div>
            <Link
              href={`/${locale}/nieuws`}
              className="text-us-white/50 hover:text-us-gold text-sm transition-colors"
            >
              {t.allNews}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((item) => (
              <div
                key={item.title}
                className="bg-us-gray border border-us-gray-light rounded p-5 flex flex-col gap-3"
              >
                <div className="h-32 bg-us-gray-light rounded flex items-center justify-center">
                  <span className="text-us-white/20 text-xs uppercase tracking-wider">
                    {t.photo}
                  </span>
                </div>
                <div>
                  <p className="text-us-white/40 text-xs mb-1">{item.date}</p>
                  <h3 className="text-us-white font-semibold text-sm leading-snug">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-us-red px-4 sm:px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="text-us-white font-black text-2xl uppercase">{t.newSeason}</h2>
            <p className="text-us-white/80 text-sm mt-1">{t.newSeasonText}</p>
          </div>
          <Link
            href={`/${locale}/aanmelden`}
            className="inline-flex items-center justify-center h-12 px-6 bg-us-white text-us-red font-bold text-sm uppercase tracking-wide rounded hover:bg-us-gold hover:text-us-black transition-colors shrink-0"
          >
            {t.registerNow}
          </Link>
        </div>
      </section>

      {/* Contact teaser */}
      <section className="bg-us-gray px-4 sm:px-6 py-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-us-gold text-2xl">📍</span>
            <h3 className="text-us-white font-bold text-sm uppercase tracking-wide">
              {dict.common.locatie}
            </h3>
            <a
              href={ADDRESS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-us-white/60 text-sm hover:text-us-white transition-colors"
            >
              {ADDRESS.name}
              <br />
              {ADDRESS.street}
              <br />
              {ADDRESS.city}
            </a>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-us-gold text-2xl">✉️</span>
            <h3 className="text-us-white font-bold text-sm uppercase tracking-wide">
              {dict.common.email}
            </h3>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-us-white/60 text-sm hover:text-us-white transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-us-gold text-2xl">📱</span>
            <h3 className="text-us-white font-bold text-sm uppercase tracking-wide">
              {dict.common.social}
            </h3>
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-us-white/60 text-sm hover:text-us-white transition-colors"
            >
              {SOCIAL.instagramHandle}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
