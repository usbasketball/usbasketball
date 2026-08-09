import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localizedAlternates } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.about" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates("/about"),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        {t("title")}
      </h1>
      <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
        {t("intro")}
      </p>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {t("sections.history.title")}
        </h2>
        <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
          <p>{t("sections.history.p1")}</p>
          <p>{t("sections.history.p2")}</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {t("sections.facts.title")}
        </h2>
        <dl className="mt-6 divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          <div className="grid grid-cols-2 gap-4 px-6 py-4">
            <dt className="font-medium text-zinc-900 dark:text-zinc-50">
              {t("sections.facts.founded")}
            </dt>
            <dd className="text-zinc-600 dark:text-zinc-400">
              {t("sections.facts.foundedValue")}
            </dd>
          </div>
          <div className="grid grid-cols-2 gap-4 px-6 py-4">
            <dt className="font-medium text-zinc-900 dark:text-zinc-50">
              {t("sections.facts.city")}
            </dt>
            <dd className="text-zinc-600 dark:text-zinc-400">
              {t("sections.facts.cityValue")}
            </dd>
          </div>
          <div className="grid grid-cols-2 gap-4 px-6 py-4">
            <dt className="font-medium text-zinc-900 dark:text-zinc-50">
              {t("sections.facts.teams")}
            </dt>
            <dd className="text-zinc-600 dark:text-zinc-400">
              {t("sections.facts.teamsValue")}
            </dd>
          </div>
          <div className="grid grid-cols-2 gap-4 px-6 py-4">
            <dt className="font-medium text-zinc-900 dark:text-zinc-50">
              {t("sections.facts.players")}
            </dt>
            <dd className="text-zinc-600 dark:text-zinc-400">
              {t("sections.facts.playersValue")}
            </dd>
          </div>
          <div className="grid grid-cols-2 gap-4 px-6 py-4">
            <dt className="font-medium text-zinc-900 dark:text-zinc-50">
              {t("sections.facts.values")}
            </dt>
            <dd className="text-zinc-600 dark:text-zinc-400">
              {t("sections.facts.valuesValue")}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
