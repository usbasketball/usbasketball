import type {Metadata} from "next";
import {notFound} from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import RegistrationForm from "@/components/ui/RegistrationForm";
import {isValidLocale, getDictionary} from "@/lib/i18n";
import type {Locale} from "@/lib/i18n";
import {getAlternates} from "@/lib/seo";

export async function generateStaticParams() {
  return [{locale: "nl"}, {locale: "en"}];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = getDictionary(locale).aanmelden;
  return {
    title: t.title,
    description: t.subtitle,
    alternates: getAlternates(locale, "/aanmelden"),
  };
}

export default async function Aanmelden({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!isValidLocale(locale)) notFound();
  const t = getDictionary(locale).aanmelden;

  return (
    <>
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-gray-600 text-sm leading-relaxed mb-6">{t.intro}</p>
        <RegistrationForm t={t} locale={locale} />
      </section>
    </>
  );
}
