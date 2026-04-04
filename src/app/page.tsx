import type { Metadata } from "next";
import Link from "next/link";
import { SITE_TAGLINE, CONTACT_EMAIL, ADDRESS, SOCIAL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "U.S. Basketball Amsterdam",
  description:
    "Welkom bij U.S. Basketball Amsterdam — basketbalclub met 12 teams voor spelers 18+.",
};

const newsPlaceholders = [
  { title: "Trainingstijden 2024-2025 bekend", date: "Sep 2024" },
  { title: "US zoekt nieuwe bestuursleden", date: "Okt 2024" },
  { title: "Wedstrijdprogramma seizoen gestart", date: "Nov 2024" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-us-black px-4 sm:px-6 py-20 sm:py-28 flex flex-col items-center text-center">
        <div className="max-w-2xl">
          <p className="text-us-gold text-xs font-bold uppercase tracking-widest mb-4">
            Amsterdam &bull; Amstelcampushal
          </p>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-us-white uppercase leading-none mb-4">
            U.S.{" "}
            <span className="text-us-red">Basketball</span>
          </h1>
          <p className="text-us-white/60 text-lg mb-8 italic">{SITE_TAGLINE}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/aanmelden"
              className="inline-flex items-center justify-center h-12 px-6 bg-us-red text-us-white font-bold text-sm uppercase tracking-wide rounded hover:bg-us-orange transition-colors"
            >
              Aanmelden
            </Link>
            <Link
              href="/informatie"
              className="inline-flex items-center justify-center h-12 px-6 border border-us-gray-light text-us-white font-bold text-sm uppercase tracking-wide rounded hover:border-us-gold hover:text-us-gold transition-colors"
            >
              Over ons
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome */}
      <section className="bg-us-gray px-4 sm:px-6 py-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-us-gold text-xs font-bold uppercase tracking-widest mb-3">
              Welkom
            </p>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-us-white mb-4">
              Welkom bij U.S. Basketball
            </h2>
            <p className="text-us-white/70 leading-relaxed">
              De Amstelcampushal is het tweede thuis voor US-leden. Hier schieten we zowel op het
              veld als in de kantine hoopjes. Met zes dames- (damUS) en zes herenteams vind je altijd
              een gezellige groep op jouw niveau (18+).
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Teams", value: "12" },
              { label: "Damens teams", value: "6" },
              { label: "Heren teams", value: "6" },
              { label: "Seizoen", value: "2024–25" },
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
              <p className="text-us-gold text-xs font-bold uppercase tracking-widest mb-1">Nieuws</p>
              <h2 className="text-2xl font-black uppercase text-us-white">US Nieuws</h2>
            </div>
            <Link href="/nieuws" className="text-us-white/50 hover:text-us-gold text-sm transition-colors">
              Alle nieuws →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsPlaceholders.map((item) => (
              <div
                key={item.title}
                className="bg-us-gray border border-us-gray-light rounded p-5 flex flex-col gap-3"
              >
                <div className="h-32 bg-us-gray-light rounded flex items-center justify-center">
                  <span className="text-us-white/20 text-xs uppercase tracking-wider">Foto</span>
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
            <h2 className="text-us-white font-black text-2xl uppercase">Nieuw seizoen!</h2>
            <p className="text-us-white/80 text-sm mt-1">
              Aanmelden voor het seizoen 2024–2025 is open.
            </p>
          </div>
          <Link
            href="/aanmelden"
            className="inline-flex items-center justify-center h-12 px-6 bg-us-white text-us-red font-bold text-sm uppercase tracking-wide rounded hover:bg-us-gold hover:text-us-black transition-colors shrink-0"
          >
            Aanmelden nu
          </Link>
        </div>
      </section>

      {/* Contact teaser */}
      <section className="bg-us-gray px-4 sm:px-6 py-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-us-gold text-2xl">📍</span>
            <h3 className="text-us-white font-bold text-sm uppercase tracking-wide">Locatie</h3>
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
            <h3 className="text-us-white font-bold text-sm uppercase tracking-wide">Email</h3>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-us-white/60 text-sm hover:text-us-white transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-us-gold text-2xl">📱</span>
            <h3 className="text-us-white font-bold text-sm uppercase tracking-wide">Social</h3>
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
