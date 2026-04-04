import type {Metadata} from "next";
import {notFound} from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import PlaceholderContent from "@/components/ui/PlaceholderContent";
import {isValidLocale, getDictionary} from "@/lib/i18n";
import type {Locale} from "@/lib/i18n";

export async function generateStaticParams() {
  return [{locale: "nl"}, {locale: "en"}];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const {locale} = await params;
  return {title: getDictionary(locale).informatie.title};
}

export default async function Informatie({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!isValidLocale(locale)) notFound();
  const t = getDictionary(locale).informatie;
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
