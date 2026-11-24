import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { InterestForm } from "@/components/interest-form";
import { CapacityNote } from "@/components/signup/capacity-note";
import { getRecruitmentNotice, pickNotice } from "@/lib/recruitment-notice";

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

  const capacityNote = pickNotice(await getRecruitmentNotice(), locale);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl uppercase tracking-wide text-ink sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 leading-relaxed text-ink-muted">{t("intro")}</p>

      {capacityNote && <CapacityNote notice={capacityNote} />}

      <div className="mt-8 border border-line bg-white p-6">
        <InterestForm />
      </div>
    </div>
  );
}
