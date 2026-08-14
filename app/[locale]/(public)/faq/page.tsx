import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { faqJsonLd, type FaqItem } from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
};

const FAQ_ITEMS = [
  "age",
  "join",
  "trial",
  "fees",
  "student",
  "training",
  "competition",
  "cancel",
] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.faq" });

  return pageMetadata({
    locale,
    pathname: "/faq",
    title: t("title"),
    description: t("description"),
  });
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FAQ" });

  const items: FaqItem[] = FAQ_ITEMS.map((key) => ({
    question: t(`items.${key}.question`),
    answer: t(`items.${key}.answer`),
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <JsonLd data={faqJsonLd(items)} />
      <h1 className="font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-muted">{t("intro")}</p>

      <div className="mt-10 space-y-10">
        {items.map((item) => (
          <section key={item.question}>
            <h2 className="text-xl font-bold text-ink">{item.question}</h2>
            <p className="mt-3 leading-relaxed text-ink-muted">
              {item.answer}
            </p>
          </section>
        ))}
      </div>

      <p className="mt-12 border-t border-line pt-6 text-ink-muted">{t("cta")}</p>
      <Link
        href="/signup"
        className="mt-4 inline-flex items-center justify-center bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-brand-darker"
      >
        {t("ctaButton")}
      </Link>
    </div>
  );
}
