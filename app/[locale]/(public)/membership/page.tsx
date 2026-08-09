import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/json-ld";
import { localizedAlternates } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.membership" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates("/membership"),
  };
}

export default async function MembershipPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Membership" });

  const fees = Object.values(
    t.raw("fees.items") as Record<
      string,
      { label: string; amount: string; per: string }
    >
  );
  const faq = Object.values(
    t.raw("faq.items") as Record<string, { q: string; a: string }>
  );

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <JsonLd data={faqJsonLd} />
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
        {t("intro")}
      </p>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {t("fees.title")}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {fees.map((fee) => (
            <div
              key={fee.label}
              className="rounded-lg border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {fee.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {fee.amount}
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {fee.per}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
          {t("fees.note")}
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {t("register.title")}
        </h2>
        <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
          <p>{t("register.p1")}</p>
          <p>{t("register.p2")}</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {t("deregister.title")}
        </h2>
        <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
          <p>{t("deregister.p1")}</p>
          <p>{t("deregister.p2")}</p>
          <p>{t("deregister.p3")}</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {t("faq.title")}
        </h2>
        <div className="mt-6 space-y-4">
          {faq.map((item) => (
            <details
              key={item.q}
              className="group rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <summary className="cursor-pointer list-none font-semibold text-zinc-900 dark:text-zinc-50">
                {item.q}
              </summary>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-lg bg-orange-600 p-8 text-center text-white">
        <h2 className="text-2xl font-bold">{t("cta.title")}</h2>
        <p className="mt-2">{t("cta.description")}</p>
        <Link
          href="/signup"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-50"
        >
          {t("cta.button")}
        </Link>
      </section>
    </div>
  );
}
