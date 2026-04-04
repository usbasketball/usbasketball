import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import { ADDRESS, CONTACT_EMAIL, SOCIAL } from "@/lib/constants";
import { isValidLocale, getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export async function generateStaticParams() {
  return [{ locale: "nl" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(locale).contact.title };
}

export default async function Contact({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const t = getDictionary(locale).contact;

  return (
    <>
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact info */}
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-us-gold text-xs font-bold uppercase tracking-widest mb-3">
              {t.address}
            </h2>
            <a
              href={ADDRESS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-us-white/70 hover:text-us-white text-sm leading-relaxed transition-colors"
            >
              {ADDRESS.name}
              <br />
              {ADDRESS.street}
              <br />
              {ADDRESS.city}
            </a>
          </div>
          <div>
            <h2 className="text-us-gold text-xs font-bold uppercase tracking-widest mb-3">
              {t.emailField}
            </h2>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-us-white/70 hover:text-us-white text-sm transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
          <div>
            <h2 className="text-us-gold text-xs font-bold uppercase tracking-widest mb-3">
              {t.socialMedia}
            </h2>
            <div className="flex flex-col gap-1">
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-us-white/70 hover:text-us-white text-sm transition-colors"
              >
                Instagram: {SOCIAL.instagramHandle}
              </a>
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-us-white/70 hover:text-us-white text-sm transition-colors"
              >
                Facebook: /usbasketbal
              </a>
            </div>
          </div>
        </div>

        {/* Placeholder form */}
        <div className="bg-us-gray border border-us-gray-light rounded p-6 flex flex-col gap-4">
          <h2 className="text-us-white font-bold uppercase tracking-wide text-sm">
            {t.sendMessage}
          </h2>
          <div className="flex flex-col gap-1">
            <label className="text-us-white/50 text-xs uppercase tracking-wide">{t.name}</label>
            <div className="h-11 bg-us-gray-light rounded border border-us-gray-light" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-us-white/50 text-xs uppercase tracking-wide">{t.emailField}</label>
            <div className="h-11 bg-us-gray-light rounded border border-us-gray-light" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-us-white/50 text-xs uppercase tracking-wide">{t.message}</label>
            <div className="h-28 bg-us-gray-light rounded border border-us-gray-light" />
          </div>
          <div className="h-11 bg-us-red/40 rounded flex items-center justify-center">
            <span className="text-us-white/40 text-xs uppercase tracking-wide">
              {t.formComingSoon}
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
