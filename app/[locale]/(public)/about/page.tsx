import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

const PLATFORM_URL =
  "https://basketball.nl/basketball/competities/vereniging-zoeken/#/clubs/2f1e5e8e-e2c5-4d8b-9d21-1584bc6c8d5a/details";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.about" });

  return pageMetadata({
    locale,
    pathname: "/about",
    title: t("title"),
    description: t("description"),
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-muted">
        {t("intro")}
      </p>

      <section className="mt-12">
        <h2 className="font-display text-2xl uppercase tracking-wide text-ink">
          {t("options.competition.title")}
        </h2>
        <p className="mt-3 leading-relaxed text-ink-muted">
          {t("options.competition.intro")}
        </p>
        <p className="mt-4">
          <span className="font-semibold text-ink">
            {t("options.competition.playingTitle")}.
          </span>{" "}
          <span className="text-ink-muted">
            {t("options.competition.playingP")}
          </span>
        </p>
        <p className="mt-3">
          <span className="font-semibold text-ink">
            {t("options.competition.trainingTitle")}.
          </span>{" "}
          <span className="text-ink-muted">
            {t("options.competition.trainingP")}
          </span>
        </p>
        <p className="mt-5 leading-relaxed text-ink-muted">
          {t.rich("options.competition.resultsP", {
            link: (chunks) => (
              <a
                href={PLATFORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent hover:underline"
              >
                {chunks}
              </a>
            ),
          })}
        </p>

        <h2 className="mt-10 font-display text-xl uppercase tracking-wide text-ink">
          {t("options.recreation.title")}
        </h2>
        <p className="mt-2 leading-relaxed text-ink-muted">
          {t("options.recreation.p")}
        </p>

        <Link
          href="/membership"
          className="mt-8 inline-flex items-center justify-center bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-brand-darker"
        >
          {t("options.cta")}
        </Link>
      </section>

      <p className="mt-12 border-t border-line pt-6 text-sm italic text-ink-muted">
        {t("note")}
      </p>
    </div>
  );
}
