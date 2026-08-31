import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

const ROLE_KEYS = [
  "board",
  "coaches",
  "omni",
  "borrel",
  "trustPerson",
  "tc",
  "sponsor",
  "socials",
  "refereeCourse",
  "kasco",
  "omni5kamp",
  "zaaldienst",
  "itus",
] as const;

const APPLY_EMAIL = "bestuur@usbasketball.nl";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.committees" });

  return pageMetadata({
    locale,
    pathname: "/committees",
    title: t("title"),
    description: t("description"),
  });
}

export default async function CommitteesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Committees" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-muted">{t("intro")}</p>

      <section className="mt-12">
        <div className="grid gap-5">
          {ROLE_KEYS.map((key) => (
            <div
              key={key}
              className="border border-line bg-white p-6 transition-colors hover:border-accent"
            >
              <h2 className="font-display text-xl uppercase tracking-wide text-ink">
                {t(`roles.${key}.name`)}
              </h2>
              <p className="mt-2 leading-relaxed text-ink-muted">
                {t(`roles.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-12 border-t border-line pt-6 text-sm italic text-ink-muted">
        {t.rich("apply", {
          email: (chunks) => (
            <a
              href={`mailto:${APPLY_EMAIL}`}
              className="font-semibold text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
    </div>
  );
}
