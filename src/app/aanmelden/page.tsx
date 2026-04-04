import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Aanmelden",
  description: "Meld je aan als nieuw lid van U.S. Basketball Amsterdam.",
};

export default function Aanmelden() {
  return (
    <>
      <PageHeader
        title="Aanmelden"
        subtitle="Word lid van U.S. Basketball Amsterdam — voor dames en heren vanaf 18 jaar."
      />
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-us-gray border border-us-gray-light rounded p-6 flex flex-col gap-5">
          <p className="text-us-white/70 text-sm leading-relaxed">
            Wil je lid worden van U.S. Basketball? Vul het aanmeldformulier in en we nemen zo
            snel mogelijk contact met je op.
          </p>

          {/* Placeholder form fields */}
          {[
            { label: "Voornaam", type: "text" },
            { label: "Achternaam", type: "text" },
            { label: "E-mailadres", type: "email" },
            { label: "Telefoonnummer", type: "tel" },
            { label: "Geboortedatum", type: "date" },
          ].map((field) => (
            <div key={field.label} className="flex flex-col gap-1">
              <label className="text-us-white/50 text-xs uppercase tracking-wide">
                {field.label}
              </label>
              <div className="h-11 bg-us-gray-light rounded border border-us-gray-light" />
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <label className="text-us-white/50 text-xs uppercase tracking-wide">
              Team voorkeur
            </label>
            <div className="h-11 bg-us-gray-light rounded border border-us-gray-light" />
          </div>

          <div className="h-12 bg-us-red/40 rounded flex items-center justify-center mt-2">
            <span className="text-us-white/40 text-xs uppercase tracking-wide">
              Aanmeldformulier komt binnenkort
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
