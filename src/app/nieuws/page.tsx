import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Nieuws",
  description: "Het laatste nieuws van U.S. Basketball Amsterdam.",
};

const placeholderArticles = [
  { title: "Trainingstijden 2024-2025 zijn bekend!", date: "Sep 2024", category: "Nieuws" },
  { title: "US zoekt nieuwe bestuursleden", date: "Okt 2024", category: "Nieuws" },
  { title: "US zoekt een nieuwe penningmeester!", date: "Nov 2024", category: "Nieuws" },
  { title: "US zoekt een nieuwe secretaris!", date: "Nov 2024", category: "Nieuws" },
  { title: "US zoekt een coordinator scheidsrechterscursus", date: "Dec 2024", category: "Nieuws" },
  { title: "Wedstrijdprogramma seizoen 2024-2025", date: "Jan 2025", category: "Nieuws" },
];

export default function Nieuws() {
  return (
    <>
      <PageHeader title="Nieuws" subtitle="Blijf op de hoogte van het laatste US nieuws." />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholderArticles.map((article) => (
            <article
              key={article.title}
              className="bg-us-gray border border-us-gray-light rounded overflow-hidden flex flex-col"
            >
              <div className="h-40 bg-us-gray-light flex items-center justify-center">
                <span className="text-us-white/20 text-xs uppercase tracking-wider">Afbeelding</span>
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
