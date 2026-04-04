import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Vertrouwenspersoon",
  description: "De vertrouwenspersoon van U.S. Basketball Amsterdam.",
};

export default function Vertrouwenspersoon() {
  return (
    <>
      <PageHeader
        title="Vertrouwenspersoon"
        subtitle="Bij U.S. Basketball kun je altijd terecht bij onze vertrouwenspersoon."
      />
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-us-gray border border-us-gray-light rounded p-6 flex flex-col gap-4">
          <p className="text-us-white/70 text-sm leading-relaxed">
            Heb je iets meegemaakt binnen de club dat niet oké voelde? Of wil je ergens over praten
            in vertrouwen? Onze vertrouwenspersoon is er voor alle leden.
          </p>
          <p className="text-us-white/70 text-sm leading-relaxed">
            Je kunt contact opnemen via:{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-us-gold hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="text-us-white/40 text-xs mt-2">
            Meer informatie volgt binnenkort op deze pagina.
          </p>
        </div>
      </section>
    </>
  );
}
