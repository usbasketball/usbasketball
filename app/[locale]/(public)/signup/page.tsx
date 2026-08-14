import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { InterestForm } from "@/components/interest-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.signup" });

  return pageMetadata({
    locale,
    pathname: "/signup",
    title: t("title"),
    description: t("description"),
  });
}

export default async function SignupPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Signup" });

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 leading-relaxed text-ink-muted">{t("intro")}</p>

      <div className="mt-6 border-l-4 border-accent bg-paper/60 p-4 text-sm leading-relaxed text-ink">
        {t("capacityNote")}
      </div>

      <div className="mt-8 border border-line bg-white p-6">
        <InterestForm />
      </div>
    </div>
  );
}
