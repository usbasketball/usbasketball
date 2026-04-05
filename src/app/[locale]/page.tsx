import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {SITE_TAGLINE} from "@/lib/constants";
import {isValidLocale, getDictionary} from "@/lib/i18n";
import type {Locale} from "@/lib/i18n";
import {getAlternates} from "@/lib/seo";

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
              {label: t.teams, value: "12"},
              {label: t.womensTeams, value: "6"},
              {label: t.mensTeams, value: "6"},
              {label: t.season, value: "2024–25"},
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-us-gray-light rounded p-4 flex flex-col items-center text-center"
              >
                <span className="text-3xl font-black text-us-red">
                  {stat.value}
                </span>
                <span className="text-us-white/50 text-xs uppercase tracking-wide mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-us-red px-4 sm:px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="text-us-white font-black text-2xl uppercase">
              {t.newSeason}
            </h2>
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
    </>
  );
}
