import type {Metadata} from "next";
import {notFound} from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
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
  return {title: getDictionary(locale).aanmelden.title};
}

export default async function Aanmelden({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!isValidLocale(locale)) notFound();
  const t = getDictionary(locale).aanmelden;

  const fields = [
    {label: t.firstName, type: "text"},
    {label: t.lastName, type: "text"},
    {label: t.emailField, type: "email"},
    {label: t.phone, type: "tel"},
    {label: t.birthDate, type: "date"},
  ];

  return (
    <>
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-us-gray border border-us-gray-light rounded p-6 flex flex-col gap-5">
          <p className="text-us-white/70 text-sm leading-relaxed">{t.intro}</p>

          {fields.map((field) => (
            <div key={field.label} className="flex flex-col gap-1">
              <label className="text-us-white/50 text-xs uppercase tracking-wide">
                {field.label}
              </label>
              <div className="h-11 bg-us-gray-light rounded border border-us-gray-light" />
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <label className="text-us-white/50 text-xs uppercase tracking-wide">
              {t.teamPreference}
            </label>
            <div className="h-11 bg-us-gray-light rounded border border-us-gray-light" />
          </div>

          <div className="h-12 bg-us-red/40 rounded flex items-center justify-center mt-2">
            <span className="text-us-white/40 text-xs uppercase tracking-wide">
              {t.formComingSoon}
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
