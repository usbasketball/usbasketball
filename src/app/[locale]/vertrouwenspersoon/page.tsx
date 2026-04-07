import type {Metadata} from "next";
import {notFound, redirect} from "next/navigation";
import {auth0} from "@/lib/auth0";
import PageHeader from "@/components/ui/PageHeader";
import {CONTACT_EMAIL} from "@/lib/constants";
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
  const t = getDictionary(locale).vertrouwenspersoon;
  return {
    title: t.title,
    description: t.subtitle,
    alternates: getAlternates(locale, "/vertrouwenspersoon"),
  };
}

export default async function Vertrouwenspersoon({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!isValidLocale(locale)) notFound();
  const session = await auth0.getSession();
  if (!session) redirect(`/auth/login?returnTo=/${locale}/vertrouwenspersoon`);
  const t = getDictionary(locale).vertrouwenspersoon;

  return (
    <>
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-8 flex flex-col gap-4">
          <p className="text-gray-600 text-sm leading-relaxed">{t.text1}</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t.text2}{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-gray-900 font-medium hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="text-gray-400 text-xs mt-2">{t.moreInfo}</p>
        </div>
      </section>
    </>
  );
}
