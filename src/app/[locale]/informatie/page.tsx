import type {Metadata} from "next";
import {notFound} from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import {isValidLocale, getDictionary} from "@/lib/i18n";
import type {Locale} from "@/lib/i18n";
import {getAlternates} from "@/lib/seo";
import {getInformatieSections} from "@/lib/contentful";
import type {InformatieSection} from "@/lib/contentful";

export async function generateStaticParams() {
  return [{locale: "nl"}, {locale: "en"}];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = getDictionary(locale).informatie;
  return {
    title: t.title,
    description: t.subtitle,
    alternates: getAlternates(locale, "/informatie"),
  };
}

const fallbackContent = {
  nl: {
    sections: [
      {
        id: "teams",
        title: "Teams",
        body: [
          'US Basketball is al sinds 1951 een van de basketbalverenigingen in Amsterdam. Ons motto: "If you can\'t beat US, join US". Wees gewaarschuwd: US voelt als een extra familie!',
          "Alle US-competitieteams hebben op woensdagavond een training van 75 minuten. Sommige teams trainen daarnaast ook op vrijdagavond.",
          "Thuiswedstrijden spelen we op zondag in de Amstelcampushal.",
          "Wil je basketballen maar liever geen competitie? Dat kan ook bij US! We hebben een enthousiast recreatieteam dat op dinsdag- en donderdagavond traint in de Apollohal.",
          "Na trainingen en wedstrijden zijn veel leden te vinden in de kantine voor de nodige gezelligheid — of op de tribune om andere teams aan te moedigen. Een heerlijke mix van sport en plezier waar iedereen zich thuis voelt.",
        ],
        cta: {
          text: "Bekijk de standen en competities op basketball.nl",
          href: "https://www.basketball.nl",
          external: true,
        },
      },
      {
        id: "aanmelden",
        title: "Meedoen",
        body: [
          "Hou je van basketbal én van gezelligheid? Dan zit je goed bij US Basketball! Bij US kun je twee keer gratis meetrainen om te zien welk team het beste bij je past. Ben je enthousiast? Vul dan het aanmeldformulier in. We nodigen je snel uit voor een proeftraining met een van onze teams of de recreatiegroep. Wanneer een geschikt team is gevonden, ontvang je een inschrijfformulier en ronden we je registratie af.",
          "Heb je de afgelopen 5 jaar bij een andere club gespeeld? Zorg dan dat je daar uitgeschreven bent. De schuldbriefkwijting wordt via Sportlink online verklaard.",
        ],
        cta: {
          text: "Aanmelden",
          href: "/aanmelden",
          external: false,
        },
      },
      {
        id: "contributie",
        title: "Contributie",
        body: ["Bij US hanteren we de volgende lidmaatschapsbijdragen:"],
        list: [
          "Wedstrijdspeler 2x per week trainen: €320,-",
          "Competitiespeler 1,5x per week trainen: €290,-",
          "Wedstrijdspeler 1x per week trainen: €260,-",
          "Recreatief: €165,-",
        ],
        note: "Studenten krijgen €30,- korting op de contributie.",
      },
      {
        id: "tenue",
        title: "Tenue & merchandise",
        body: [
          "Op zoek naar een nieuw outfit of wil je wat van die geweldige US-merchandise? Bekijk dan onze clubshop:",
        ],
        cta: {
          text: "bbtshop.nl/clubshop/us-amsterdam",
          href: "https://www.bbtshop.nl/clubshop/us-amsterdam.html",
          external: true,
        },
      },
      {
        id: "uitschrijven",
        title: "Uitschrijven",
        body: [
          "Wil je US verlaten? Stuur een e-mail naar secretaris@usbasketball.nl met je opzegging. Dit is de enige manier om officieel op te zeggen! Als je je niet uitschrijft, blijf je contributie betalen — ook als je je coach en team hebt ingelicht.",
          "Opzegging voor het nieuwe seizoen moet vóór 1 mei plaatsvinden. Bij voortijdige opzegging na het begin van het seizoen (1 september) vindt geen restitutie van de contributie plaats.",
        ],
        list: [
          "Opzegging voor het volgende seizoen (gratis) vóór 1 mei",
          "Opzegging tussen 1 mei en 31 augustus: kosten €50,-",
          "Opzegging tussen 1 september en 31 mei: volledige seizoenscontributie",
          "Inschrijving tussen 1 augustus en 31 december: volledige seizoensbijdrage",
          "Inschrijving tussen 1 januari en 31 maart: verlaagd tarief",
        ],
        disclaimer:
          "Bij uitschrijving vervallen alle rechten om in een team te spelen. Het bestuur gaat ervan uit dat er ruimte vrijkomt en zal nieuwe aanmeldingen doorsturen naar dit team. Bij een nieuwe inschrijving heb je geen voorrang op nieuwe leden.",
      },
    ],
  },
  en: {
    sections: [
      {
        id: "teams",
        title: "Teams",
        body: [
          "US Basketball has been one of Amsterdam's basketball clubs since 1951. Our motto: \"If you can't beat US, join US\". Be warned: US will feel like an extra family!",
          "All US league teams have a 75-minute training session on Wednesday evening. Some teams also train on Friday evenings.",
          "We play home games on Sundays in the Amstelcampushal.",
          "Want to play basketball but skip the competition? That's also possible at US! We have an enthusiastic recreational team that trains in the Apollo hall on Tuesday and Thursday evenings.",
          "After training sessions and games, many members gather in the canteen for fun and socializing — or in the stands to cheer on other teams. A wonderful mix of competition and camaraderie where everyone feels at home.",
        ],
        cta: {
          text: "Check standings and competitions at basketball.nl",
          href: "https://www.basketball.nl",
          external: true,
        },
      },
      {
        id: "join",
        title: "Join US",
        body: [
          "Do you like basketball and socializing? Then you're in the right place at US Basketball! At US you can train twice free of charge to find which team suits you best. If you like it, fill in the registration form. We'll quickly invite you for a trial session with one of our teams or the recreational group. Once a suitable team is found, you'll receive a registration form and we'll complete your sign-up.",
          "Have you played for another club in the past 5 years? Make sure you are deregistered there. The debt release is declared online via Sportlink.",
        ],
        cta: {
          text: "Sign up",
          href: "/aanmelden",
          external: false,
        },
      },
      {
        id: "fees",
        title: "Membership fees",
        body: ["We use the following membership fees at US:"],
        list: [
          "Match player training 2x a week: €320,-",
          "Competition player training 1.5x a week: €290,-",
          "Match player training 1x a week: €260,-",
          "Recreational: €165,-",
        ],
        note: "Students receive a €30,- discount on their membership fee.",
      },
      {
        id: "uniforms",
        title: "Uniforms & merchandise",
        body: [
          "Looking for a new outfit or want some awesome US merchandise? Check out our club shop:",
        ],
        cta: {
          text: "bbtshop.nl/clubshop/us-amsterdam",
          href: "https://www.bbtshop.nl/clubshop/us-amsterdam.html",
          external: true,
        },
      },
      {
        id: "leave",
        title: "Leaving US",
        body: [
          "If you want to leave US, send an email to secretaris@usbasketball.nl with your cancellation. This is the only official way to cancel! If you do not unsubscribe, you will continue to pay dues — even if you have told your coach and team.",
          "Cancellation for the new season must be done before May 1. No refund of membership fee in case of early cancellation after the start of the season (September 1).",
        ],
        list: [
          "Cancellation for the following season (free) before May 1",
          "Cancellation between May 1 and August 31: €50,-",
          "Cancellation between September 1 and May 31: full season contribution",
          "Registration between August 1 and December 31: full season fee",
          "Registration between January 1 and March 31: reduced season rate",
        ],
        disclaimer:
          "When you unsubscribe, you give up all rights to play in a team. The board will forward new registrations to fill that spot. You will not have priority over new members when you register again.",
      },
    ],
  },
} as const;

export default async function Informatie({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!isValidLocale(locale)) notFound();
  const t = getDictionary(locale).informatie;
  const sections: InformatieSection[] =
    (await getInformatieSections(locale)) ??
    (fallbackContent[locale].sections as unknown as InformatieSection[]);

  return (
    <>
      <PageHeader title={t.title} subtitle={t.subtitle} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-14">
        {sections.map((section) => (
          <section key={section.id}>
            <h2 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-4">
              {section.title}
            </h2>
            <div className="space-y-3 text-gray-600 leading-relaxed">
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {"list" in section && section.list && (
              <ul className="mt-4 space-y-1.5 text-gray-600">
                {section.list.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-gray-400 select-none">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {"note" in section && section.note && (
              <p className="mt-3 text-sm text-gray-500 italic">
                {section.note}
              </p>
            )}

            {"disclaimer" in section && section.disclaimer && (
              <p className="mt-4 text-sm text-gray-500 border-l-2 border-gray-200 pl-3">
                {section.disclaimer}
              </p>
            )}

            {"cta" in section && section.cta && (
              <div className="mt-5">
                {section.cta.external ? (
                  <a
                    href={section.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors"
                  >
                    {section.cta.text}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                ) : (
                  <Button href={`/${locale}${section.cta.href}`} size="sm">
                    {section.cta.text}
                  </Button>
                )}
              </div>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
