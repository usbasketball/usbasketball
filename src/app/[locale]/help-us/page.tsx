import type {Metadata} from "next";
import {notFound} from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import {isValidLocale, getDictionary} from "@/lib/i18n";
import type {Locale} from "@/lib/i18n";
import {getAlternates} from "@/lib/seo";
import {getHelpUsContent} from "@/lib/contentful";

export async function generateStaticParams() {
  return [{locale: "nl"}, {locale: "en"}];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = getDictionary(locale).helpUs;
  return {
    title: t.title,
    description: t.subtitle,
    alternates: getAlternates(locale, "/help-us"),
    openGraph: {
      title: t.title,
      description: t.subtitle,
    },
  };
}

const fallbackContent = {
  nl: {
    intro:
      "US Basketball draait op vrijwilligers. Of je nu wil meehelpen achter de schermen, op de vloer, of in een commissie — er is altijd een plek voor jou. Hieronder vind je alle functies en commissies waar je je voor kunt opgeven.",
    cta: "Stuur een e-mail naar bestuur@usbasketball.nl om je aan te melden voor een functie of commissie.",
    committees: [
      {
        name: "Bestuur",
        description:
          "Leidt de vereniging: regelt de dagelijkse gang van zaken, beleid en communicatie.",
      },
      {
        name: "Coaches & Trainers",
        description:
          "Leidt teams op het veld. Zowel spelcoaches als conditietrainers zijn welkom.",
      },
      {
        name: "OMNI",
        description:
          "Vertegenwoordigt US Basketball bij OMNI, de overkoepelende sportvereniging in Amsterdam.",
      },
      {
        name: "Borrelcommissie",
        description:
          "Organiseert de sociale activiteiten en borrels rondom trainingen en wedstrijden.",
      },
      {
        name: "Vertrouwenspersoon",
        description:
          "Eerste aanspreekpunt voor leden bij problemen of ongewenst gedrag binnen de club.",
      },
      {
        name: "Technische Commissie (TC)",
        description:
          "Begeleidt nieuwe en aankomende talenten en zorgt voor de juiste teamindeling.",
      },
      {
        name: "Sponsorcommissie",
        description:
          "Werft en onderhoudt sponsorrelaties om de club financieel te ondersteunen.",
      },
      {
        name: "Socials",
        description:
          "Beheert de sociale media van US Basketball en zorgt voor online zichtbaarheid.",
      },
      {
        name: "Scheidsrechterscursus",
        description:
          "Coördineert de opleiding van leden tot gecertificeerde scheidsrechters.",
      },
      {
        name: "KasCo",
        description:
          "Controleert de financiële gezondheid van de vereniging als onafhankelijke kascommissie.",
      },
      {
        name: "OMNI 5-kamp",
        description:
          "Organiseert de jaarlijkse OMNI 5-kamp. Doe mee om erachter te komen wat het inhoudt!",
      },
      {
        name: "Zaaldienst",
        description:
          "Zorgt voor de opbouw, afbouw en orde tijdens thuiswedstrijden in de Amstelcampushal.",
      },
      {
        name: "ITUS Commissie",
        description:
          "Organiseert het jaarlijkse interne toernooi voor US-leden.",
      },
    ],
  },
  en: {
    intro:
      "US Basketball runs on volunteers. Whether you want to help behind the scenes, on the court, or in a committee — there's always a place for you. Below you'll find all the functions and committees you can sign up for.",
    cta: "Send an email to bestuur@usbasketball.nl to sign up for a function or committee.",
    committees: [
      {
        name: "Board",
        description:
          "Leads the club: handles day-to-day operations, policy, and communication.",
      },
      {
        name: "Coaches & Trainers",
        description:
          "Coaches teams on the court. Both game coaches and fitness trainers are welcome.",
      },
      {
        name: "OMNI",
        description:
          "Represents US Basketball at OMNI, the umbrella sports association in Amsterdam.",
      },
      {
        name: "Borrel Committee",
        description:
          "Organises social activities and drinks around training sessions and games.",
      },
      {
        name: "Trust Person",
        description:
          "First point of contact for members dealing with issues or unacceptable behaviour within the club.",
      },
      {
        name: "Technical Committee (TC)",
        description:
          "Guides new and incoming talents and ensures proper team placement.",
      },
      {
        name: "Sponsor Committee",
        description:
          "Recruits and maintains sponsor relationships to support the club financially.",
      },
      {
        name: "Socials",
        description:
          "Manages US Basketball's social media channels and online presence.",
      },
      {
        name: "Referee Course",
        description:
          "Coordinates the training of members to become certified referees.",
      },
      {
        name: "KasCo",
        description:
          "Independently audits the financial health of the club as the financial review committee.",
      },
      {
        name: "OMNI 5-kamp",
        description:
          "Organises the annual OMNI 5-kamp. Join to find out what it's all about!",
      },
      {
        name: "Zaaldienst",
        description:
          "Handles setup, breakdown, and order during home games at the Amstelcampushal.",
      },
      {
        name: "ITUS Committee",
        description: "Organises the annual internal tournament for US members.",
      },
    ],
  },
} as const;

export default async function HelpUs({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!isValidLocale(locale)) notFound();
  const t = getDictionary(locale).helpUs;
  const {intro, cta, committees} =
    (await getHelpUsContent(locale)) ?? fallbackContent[locale];

  return (
    <>
      <PageHeader title={t.title} subtitle={t.subtitle} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-gray-600 leading-relaxed mb-10">{intro}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {committees.map((c) => (
            <div
              key={c.name}
              className="border border-gray-100 bg-gray-50 px-5 py-4"
            >
              <h3 className="font-black uppercase text-sm tracking-wide text-gray-900 mb-1">
                {c.name}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {c.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 border-l-2 border-gray-200 pl-4">
          <p className="text-gray-600 text-sm">{cta}</p>
          <Button
            href="mailto:bestuur@usbasketball.nl"
            size="sm"
            className="mt-4"
          >
            bestuur@usbasketball.nl
          </Button>
        </div>
      </div>
    </>
  );
}
