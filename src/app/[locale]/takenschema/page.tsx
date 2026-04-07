import type {Metadata} from "next";
import {notFound, redirect} from "next/navigation";
import {auth} from "@clerk/nextjs/server";
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
  const t = getDictionary(locale).takenschema;
  return {
    title: t.title,
    description: t.subtitle,
    alternates: getAlternates(locale, "/takenschema"),
  };
}

export default async function Takenschema({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!isValidLocale(locale)) notFound();
  const {userId} = await auth();
  if (!userId) redirect(`/${locale}`);
  const t = getDictionary(locale).takenschema;
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
