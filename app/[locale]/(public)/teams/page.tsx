import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/json-ld";
import { localizedAlternates } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.teams" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates("/teams"),
  };
}

export default async function TeamsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Teams" });

  const teams = Object.values(
    t.raw("items") as Record<
      string,
      { name: string; age: string; description: string; practice: string }
    >
  );

  const teamJsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: siteConfig.name,
    sport: "Basketball",
    memberOf: { "@id": `${siteConfig.url}/#organization` },
    location: { "@type": "Place", name: siteConfig.city },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <JsonLd data={teamJsonLd} />
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
        {t("intro")}
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {teams.map((team) => (
          <article
            key={team.name}
            className="flex flex-col rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {team.name}
            </h2>
            <p className="mt-1 text-sm font-medium text-orange-600">
              {t("age")}: {team.age}
            </p>
            <p className="mt-3 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
              {team.description}
            </p>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                {t("practice")}:
              </span>{" "}
              {team.practice}
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
            >
              {t("teamCta")}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
