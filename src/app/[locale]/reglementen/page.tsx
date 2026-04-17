import type {Metadata} from "next";
import {notFound, redirect} from "next/navigation";
import {auth0} from "@/lib/auth0";
import PageHeader from "@/components/ui/PageHeader";
import RichText from "@/components/ui/RichText";
import {isValidLocale, getDictionary} from "@/lib/i18n";
import type {Locale} from "@/lib/i18n";
import {getAlternates} from "@/lib/seo";
import {getTeamAgreements} from "@/lib/contentful";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = getDictionary(locale).reglementen;
  return {
    title: t.title,
    description: t.subtitle,
    alternates: getAlternates(locale, "/reglementen"),
  };
}

export default async function Reglementen({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!isValidLocale(locale)) notFound();
  const session = await auth0.getSession();
  if (!session) redirect(`/auth/login?returnTo=/${locale}/reglementen`);

  const t = getDictionary(locale).reglementen;
  const content = await getTeamAgreements(locale);

  if (!content) {
    return (
      <>
        <PageHeader title={t.title} subtitle={t.subtitle} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <p className="text-gray-400 text-sm italic">
            {locale === "nl"
              ? "Inhoud wordt binnenkort toegevoegd."
              : "Content coming soon."}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <RichText document={content.teamAfspraken} />
      </div>
    </>
  );
}
