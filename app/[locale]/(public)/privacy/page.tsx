import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localizedAlternates } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.privacy" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates("/privacy"),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });

  const sections = [
    "who",
    "data",
    "purpose",
    "rights",
    "retention",
    "cookies",
  ] as const;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        {t("title")}
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
        {t("updated")}
      </p>

      <div className="mt-10 space-y-10">
        {sections.map((key) => (
          <section key={key}>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {t(`sections.${key}.title`)}
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              {t(`sections.${key}.p`)}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
