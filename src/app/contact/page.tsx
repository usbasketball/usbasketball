import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { ADDRESS, CONTACT_EMAIL, SOCIAL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Neem contact op met U.S. Basketball Amsterdam.",
};

export default function Contact() {
  return (
    <>
      <PageHeader title="Contact" subtitle="Vragen, opmerkingen of interesse? Neem gerust contact op." />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact info */}
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-us-gold text-xs font-bold uppercase tracking-widest mb-3">Adres</h2>
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
            <h2 className="text-us-gold text-xs font-bold uppercase tracking-widest mb-3">Email</h2>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-us-white/70 hover:text-us-white text-sm transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
          <div>
            <h2 className="text-us-gold text-xs font-bold uppercase tracking-widest mb-3">Social media</h2>
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
          <h2 className="text-us-white font-bold uppercase tracking-wide text-sm">Stuur een bericht</h2>
          <div className="flex flex-col gap-1">
            <label className="text-us-white/50 text-xs uppercase tracking-wide">Naam</label>
            <div className="h-11 bg-us-gray-light rounded border border-us-gray-light" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-us-white/50 text-xs uppercase tracking-wide">E-mail</label>
            <div className="h-11 bg-us-gray-light rounded border border-us-gray-light" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-us-white/50 text-xs uppercase tracking-wide">Bericht</label>
            <div className="h-28 bg-us-gray-light rounded border border-us-gray-light" />
          </div>
          <div className="h-11 bg-us-red/40 rounded flex items-center justify-center">
            <span className="text-us-white/40 text-xs uppercase tracking-wide">Formulier komt binnenkort</span>
          </div>
        </div>
      </section>
    </>
  );
}
