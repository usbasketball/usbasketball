import type {Metadata} from "next";
import {notFound, redirect} from "next/navigation";
import {auth0} from "@/lib/auth0";
import PageHeader from "@/components/ui/PageHeader";
import {isValidLocale, getDictionary} from "@/lib/i18n";
import type {Locale} from "@/lib/i18n";
import {getAlternates} from "@/lib/seo";
import {getMeetingNotes} from "@/lib/contentful";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = getDictionary(locale).vergaderingen;
  return {
    title: t.title,
    description: t.subtitle,
    alternates: getAlternates(locale, "/vergaderingen"),
  };
}

const fallbackNotes = [
  {
    id: "fallback-1",
    year: 2024,
    title: "Jaarlijkse Vergadering 2024",
    documentUrl: "#",
  },
  {
    id: "fallback-2",
    year: 2023,
    title: "Jaarlijkse Vergadering 2023",
    documentUrl: "#",
  },
];

export default async function Vergaderingen({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!isValidLocale(locale)) notFound();
  const session = await auth0.getSession();
  if (!session) redirect(`/auth/login?returnTo=/${locale}/vergaderingen`);

  const t = getDictionary(locale).vergaderingen;
  const notes = (await getMeetingNotes()) ?? fallbackNotes;

  return (
    <>
      <PageHeader title={t.title} subtitle={t.subtitle} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {notes.length === 0 ? (
          <p className="text-gray-500">{t.noDocuments}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="border border-gray-100 bg-gray-50 px-5 py-4 flex flex-col gap-3"
              >
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                    {note.year}
                  </span>
                  <h2 className="font-black uppercase text-sm tracking-wide text-gray-900 mt-1">
                    {note.title}
                  </h2>
                </div>
                <a
                  href={note.documentUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-10 px-5 bg-gray-900 text-white text-sm font-bold uppercase tracking-wide hover:bg-gray-700 transition-colors self-start"
                >
                  {t.downloadBtn}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
