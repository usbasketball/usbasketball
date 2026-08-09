import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localizedAlternates } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates("/"),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  const highlights = Object.values(
    t.raw("highlights.items") as Record<
      string,
      { title: string; description: string }
    >
  );
  const news = Object.values(
    t.raw("news.items") as Record<
      string,
      { date: string; title: string; description: string }
    >
  );

  return (
    <div>
      <section className="bg-gradient-to-b from-orange-50 to-white dark:from-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6">
          <p className="inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800 dark:bg-orange-950 dark:text-orange-200">
            {t("badge")}
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            {t("title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            {t("subtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
            >
              {t("cta")}
            </Link>
            <Link
              href="/teams"
              className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {t("highlights.title")}
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {t("news.title")}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {news.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-orange-600">
                  {item.date}
                </p>
                <h3 className="mt-2 font-semibold text-zinc-900 dark:text-zinc-50">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {t("signupCta.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-zinc-600 dark:text-zinc-400">
          {t("signupCta.description")}
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex items-center justify-center rounded-md bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
        >
          {t("signupCta.cta")}
        </Link>
      </section>
    </div>
  );
}
