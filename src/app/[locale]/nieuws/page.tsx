import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
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
  return { title: getDictionary(locale).nieuws.title };
}

const placeholderArticles: Record<Locale, { title: string; date: string; category: string }[]> = {
  nl: [
    { title: "Trainingstijden 2024-2025 zijn bekend!", date: "Sep 2024", category: "Nieuws" },
    { title: "US zoekt nieuwe bestuursleden", date: "Okt 2024", category: "Nieuws" },
    { title: "US zoekt een nieuwe penningmeester!", date: "Nov 2024", category: "Nieuws" },
    { title: "US zoekt een nieuwe secretaris!", date: "Nov 2024", category: "Nieuws" },
    { title: "US zoekt een coordinator scheidsrechterscursus", date: "Dec 2024", category: "Nieuws" },
    { title: "Wedstrijdprogramma seizoen 2024-2025", date: "Jan 2025", category: "Nieuws" },
  ],
  en: [
    { title: "Training times 2024-2025 announced!", date: "Sep 2024", category: "News" },
    { title: "US looking for new board members", date: "Oct 2024", category: "News" },
    { title: "US looking for a new treasurer!", date: "Nov 2024", category: "News" },
    { title: "US looking for a new secretary!", date: "Nov 2024", category: "News" },
    { title: "US looking for a referee course coordinator", date: "Dec 2024", category: "News" },
    { title: "Match schedule for the 2024-2025 season", date: "Jan 2025", category: "News" },
  ],
};

export default async function Nieuws({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.nieuws;
  const articles = placeholderArticles[locale];

  return (
    <>
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.title}
              className="bg-us-gray border border-us-gray-light rounded overflow-hidden flex flex-col"
            >
              <div className="h-40 bg-us-gray-light flex items-center justify-center">
                <span className="text-us-white/20 text-xs uppercase tracking-wider">
                  {t.image}
                </span>
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <span className="text-us-gold text-xs font-bold uppercase tracking-widest">
                  {article.category}
                </span>
                <h2 className="text-us-white font-semibold leading-snug">{article.title}</h2>
                <p className="text-us-white/40 text-xs mt-auto pt-2">{article.date}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
