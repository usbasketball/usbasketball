import type {Metadata} from "next";
import {notFound, redirect} from "next/navigation";
import {auth0} from "@/lib/auth0";
import PageHeader from "@/components/ui/PageHeader";
import PlaceholderContent from "@/components/ui/PlaceholderContent";
import {isValidLocale, getDictionary} from "@/lib/i18n";
import type {Locale} from "@/lib/i18n";
import {getAlternates} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = getDictionary(locale).trainingschema;
  return {
    title: t.title,
    description: t.subtitle,
    alternates: getAlternates(locale, "/trainingschema"),
    robots: {index: false, follow: false},
  };
}

export default async function Trainingschema({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!isValidLocale(locale)) notFound();
  const session = await auth0.getSession();
  if (!session) redirect(`/auth/login?returnTo=/${locale}/trainingschema`);
  const t = getDictionary(locale).trainingschema;
  return (
    <>
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <PlaceholderContent
        title={getDictionary(locale).placeholder.underConstruction}
        description={t.placeholder}
      />
    </>
  );
}
