import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { Parallax } from "@/components/parallax";
import { Reveal } from "@/components/scroll-reveal";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return pageMetadata({
    locale,
    pathname: "/",
    title: t("title"),
    description: t("description"),
  });
}

function highlightLastWord(title: string) {
  const parts = title.split(" ");
  const last = parts.pop();
  return (
    <>
      {parts.join(" ")} <span className="text-accent">{last}</span>
    </>
  );
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  return (
    <div>
      <section className="relative flex min-h-[80svh] items-center justify-center overflow-hidden bg-accent">
        <Parallax className="absolute inset-0" intensity={0.12}>
          <Image
            src="/images/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-125 object-cover opacity-[0.72]"
          />
        </Parallax>
        <Reveal className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center text-white sm:px-6">
          <h1 className="font-display text-6xl uppercase leading-none tracking-wide sm:text-7xl lg:text-8xl">
            {t("hero.title")}
          </h1>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.3em] text-white/80 sm:text-base">
            {t("hero.tagline")}
          </p>
        </Reveal>
        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/70">
          <svg
            className="h-8 w-8 animate-bounce"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <Reveal>
          <h2 className="font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl">
            {highlightLastWord(t("welcome.title"))}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            {t("welcome.p")}
          </p>
          <Link
            href="/about"
            className="mt-10 inline-flex items-center justify-center bg-accent px-10 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-brand-darker"
          >
            {t("welcome.cta")}
          </Link>
        </Reveal>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-muted">
              {t("sponsors.title")}
            </p>
            <div className="mt-6 flex items-center justify-center">
              <a
                href="https://www.vitals.nl/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
                aria-label="Vitals"
              >
                <Image
                  src="/images/vitals.svg"
                  alt="Vitals"
                  width={298}
                  height={84}
                  className="h-14 w-auto"
                />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div>
              <h2 className="font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl">
                {highlightLastWord(t("join.title"))}
              </h2>
              <p className="mt-6 leading-relaxed text-ink-muted">
                {t("join.p")}
              </p>
              <Link
                href="/signup"
                className="mt-10 inline-flex items-center justify-center bg-accent px-10 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-brand-darker"
              >
                {t("join.cta")}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative aspect-[4/5] overflow-hidden bg-paper">
              <Image
                src="/images/team-d1.jpg"
                alt="US Basketball team"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
