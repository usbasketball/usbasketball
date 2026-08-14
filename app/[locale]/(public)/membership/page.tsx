import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
};

const SHOP_URL = "https://www.bbtshop.nl/clubshop/us-amsterdam.html";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.membership" });

  return pageMetadata({
    locale,
    pathname: "/membership",
    title: t("title"),
    description: t("description"),
  });
}

export default async function MembershipPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Membership" });

  const matchFees = Object.values(
    t.raw("fees.matchRows") as Record<string, { label: string; amount: string }>
  );
  const matchRows = Object.values(
    t.raw("leave.matchRows") as Record<string, string>
  );
  const recRows = Object.values(
    t.raw("leave.recRows") as Record<string, string>
  );

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
          {t("join.title")}
        </h2>
        <div className="mt-4 space-y-4 leading-relaxed text-ink-muted">
          <p>{t("join.p1")}</p>
          <p>{t("join.p2")}</p>
          <Link
            href="/signup"
            className="mt-2 inline-flex items-center justify-center bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-brand-darker"
          >
            {t("join.cta")}
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl uppercase tracking-wide text-ink">
          {t("fees.title")}
        </h2>
        <p className="mt-3 leading-relaxed text-ink-muted">{t("fees.intro")}</p>

        <h3 className="mt-8 font-display text-xl uppercase tracking-wide text-ink">
          {t("fees.matchTitle")}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {t("fees.matchIntro")}
        </p>
        <ul className="mt-3">
          {matchFees.map((fee) => (
            <li
              key={fee.label}
              className="flex items-baseline justify-between gap-4 py-1.5"
            >
              <span className="text-ink">{fee.label}</span>
              <span>
                <span className="font-display text-xl uppercase text-ink">
                  {fee.amount}
                </span>{" "}
                <span className="text-sm text-ink-muted">{t("fees.per")}</span>
              </span>
            </li>
          ))}
        </ul>

        <h3 className="mt-8 font-display text-xl uppercase tracking-wide text-ink">
          {t("fees.recTitle")}
        </h3>
        <ul className="mt-3">
          <li className="flex items-baseline justify-between gap-4 py-1.5">
            <span className="text-ink">{t("fees.recIntro")}</span>
            <span>
              <span className="font-display text-xl uppercase text-ink">
                {t("fees.recAmount")}
              </span>{" "}
              <span className="text-sm text-ink-muted">{t("fees.per")}</span>
            </span>
          </li>
        </ul>

        <p className="mt-6 font-medium text-ink">{t("fees.studentNote")}</p>
        <div className="mt-2 space-y-1 text-sm leading-relaxed text-ink-muted">
          <p>{t("fees.timing.full")}</p>
          <p>{t("fees.timing.reduced")}</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl uppercase tracking-wide text-ink">
          {t("merch.title")}
        </h2>
        <p className="mt-4 leading-relaxed text-ink-muted">
          {t.rich("merch.p", {
            shopLink: (chunks) => (
              <a
                href={SHOP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent hover:underline"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl uppercase tracking-wide text-ink">
          {t("leave.title")}
        </h2>
        <div className="mt-4 space-y-4 leading-relaxed text-ink-muted">
          <p>
            {t.rich("leave.p1", {
              email: (chunks) => (
                <a
                  href={`mailto:${siteConfig.secretariatEmail}`}
                  className="font-semibold text-accent hover:underline"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
          <p>{t("leave.p2")}</p>
        </div>

        <h3 className="mt-8 font-display text-xl uppercase tracking-wide text-ink">
          {t("leave.matchTitle")}
        </h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
          {matchRows.map((row) => (
            <li key={row}>{row}</li>
          ))}
        </ul>

        <h3 className="mt-8 font-display text-xl uppercase tracking-wide text-ink">
          {t("leave.recTitle")}
        </h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
          {recRows.map((row) => (
            <li key={row}>{row}</li>
          ))}
        </ul>

        <p className="mt-6 text-sm leading-relaxed text-ink-muted">
          {t("leave.disclaimer")}
        </p>
      </section>

      <section className="mt-12 bg-brand p-8 text-center text-white">
        <h2 className="font-display text-3xl uppercase tracking-wide">
          {t("cta.title")}
        </h2>
        <p className="mt-2 text-white/80">{t("cta.description")}</p>
        <Link
          href="/signup"
          className="mt-6 inline-flex items-center justify-center bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-brand-darker"
        >
          {t("cta.button")}
        </Link>
      </section>
    </div>
  );
}
