import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {isValidLocale} from "@/lib/i18n";
import type {Locale} from "@/lib/i18n";
import {getAlternates} from "@/lib/seo";
import {getPrivacyPolicy} from "@/lib/contentful";
import RichText from "@/components/ui/RichText";
import {CONTACT_EMAIL} from "@/lib/constants";

export async function generateStaticParams() {
  return [{locale: "nl"}, {locale: "en"}];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const isNl = locale === "nl";
  return {
    title: isNl ? "Privacyverklaring" : "Privacy Policy",
    description: isNl
      ? "Privacyverklaring van U.S. Basketball Amsterdam — hoe wij omgaan met uw persoonsgegevens."
      : "Privacy policy of U.S. Basketball Amsterdam — how we handle your personal data.",
    alternates: getAlternates(locale, "/privacy"),
  };
}

export default async function Privacy({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!isValidLocale(locale)) notFound();
  const isNl = locale === "nl";

  const policy = await getPrivacyPolicy(locale);

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-3xl sm:text-4xl font-black uppercase text-gray-900 tracking-tight mb-8">
        {isNl ? "Privacyverklaring" : "Privacy Policy"}
      </h1>

      {policy ? (
        <RichText document={policy} />
      ) : (
        <div className="flex flex-col gap-8 text-gray-600 text-sm leading-relaxed">
          {isNl ? (
            <>
              <p>
                U.S. Basketball, gevestigd aan Tweede Boerhaavestraat 10, 1091AN
                Amsterdam, is verantwoordelijk voor de verwerking van
                persoonsgegevens zoals weergegeven in deze privacyverklaring.
              </p>

              <div>
                <h2 className="text-gray-900 font-bold uppercase tracking-wide text-xs mb-2">
                  Contactgegevens
                </h2>
                <p>
                  <a
                    href="https://www.usbasketball.nl"
                    className="text-gray-900 font-medium hover:underline"
                  >
                    https://www.usbasketball.nl
                  </a>
                  <br />
                  Tweede Boerhaavestraat 10, 1091AN Amsterdam
                </p>
              </div>

              <div>
                <h2 className="text-gray-900 font-bold uppercase tracking-wide text-xs mb-2">
                  Persoonsgegevens die wij verwerken
                </h2>
                <p className="mb-3">
                  U.S. Basketball verwerkt uw persoonsgegevens doordat u gebruik
                  maakt van onze diensten en/of omdat u deze zelf aan ons
                  verstrekt. Hieronder vindt u een overzicht van de
                  persoonsgegevens die wij verwerken:
                </p>
                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Voor- en achternaam</li>
                  <li>Geslacht</li>
                  <li>Geboortedatum</li>
                  <li>Adresgegevens</li>
                  <li>Telefoonnummer</li>
                  <li>E-mailadres</li>
                  <li>
                    Overige persoonsgegevens die u actief verstrekt bijvoorbeeld
                    door een profiel op deze website aan te maken, in
                    correspondentie en telefonisch
                  </li>
                  <li>Bankrekeningnummer</li>
                </ul>
              </div>

              <div>
                <h2 className="text-gray-900 font-bold uppercase tracking-wide text-xs mb-2">
                  Bijzondere en/of gevoelige persoonsgegevens die wij verwerken
                </h2>
                <p>
                  Onze website en/of dienst heeft niet de intentie gegevens te
                  verzamelen over websitebezoekers die jonger zijn dan 16 jaar.
                  Tenzij ze toestemming hebben van ouders of voogd. We kunnen
                  echter niet controleren of een bezoeker ouder dan 16 is. Wij
                  raden ouders dan ook aan betrokken te zijn bij de online
                  activiteiten van hun kinderen, om zo te voorkomen dat er
                  gegevens over kinderen verzameld worden zonder ouderlijke
                  toestemming. Als u er van overtuigd bent dat wij zonder die
                  toestemming persoonlijke gegevens hebben verzameld over een
                  minderjarige, neem dan contact met ons op via{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-gray-900 font-medium hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  , dan verwijderen wij deze informatie.
                </p>
              </div>

              <div>
                <h2 className="text-gray-900 font-bold uppercase tracking-wide text-xs mb-2">
                  Met welk doel en op basis van welke grondslag wij
                  persoonsgegevens verwerken
                </h2>
                <p className="mb-3">
                  U.S. Basketball verwerkt uw persoonsgegevens voor de volgende
                  doelen:
                </p>
                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Het afhandelen van uw betaling</li>
                  <li>Verzenden van onze nieuwsbrief en/of reclamefolder</li>
                  <li>
                    U te kunnen bellen of e-mailen indien dit nodig is om onze
                    dienstverlening uit te kunnen voeren
                  </li>
                  <li>
                    U te informeren over wijzigingen van onze diensten en
                    producten
                  </li>
                  <li>U de mogelijkheid te bieden een account aan te maken</li>
                </ul>
              </div>

              <div>
                <h2 className="text-gray-900 font-bold uppercase tracking-wide text-xs mb-2">
                  Hoe lang we persoonsgegevens bewaren
                </h2>
                <p>
                  U.S. Basketball bewaart uw persoonsgegevens niet langer dan
                  strikt nodig is om de doelen te realiseren waarvoor uw
                  gegevens worden verzameld. Wij hanteren een bewaartermijn van
                  7 jaar voor persoonsgegevens.
                </p>
              </div>

              <div>
                <h2 className="text-gray-900 font-bold uppercase tracking-wide text-xs mb-2">
                  Delen van persoonsgegevens met derden
                </h2>
                <p>
                  U.S. Basketball verstrekt uitsluitend aan derden en alleen als
                  dit nodig is voor de uitvoering van onze overeenkomst met u of
                  om te voldoen aan een wettelijke verplichting.
                </p>
              </div>

              <div>
                <h2 className="text-gray-900 font-bold uppercase tracking-wide text-xs mb-2">
                  Cookies, of vergelijkbare technieken, die wij gebruiken
                </h2>
                <p>
                  U.S. Basketball gebruikt alleen technische en functionele
                  cookies. En analytische cookies die geen inbreuk maken op uw
                  privacy. Een cookie is een klein tekstbestand dat bij het
                  eerste bezoek aan deze website wordt opgeslagen op uw
                  computer, tablet of smartphone. De cookies die wij gebruiken
                  zijn noodzakelijk voor de technische werking van de website en
                  uw gebruiksgemak. Ze zorgen ervoor dat de website naar behoren
                  werkt en onthouden bijvoorbeeld uw voorkeursinstellingen. Ook
                  kunnen wij hiermee onze website optimaliseren. U kunt zich
                  afmelden voor cookies door uw internetbrowser zo in te stellen
                  dat deze geen cookies meer opslaat. Daarnaast kunt u ook alle
                  informatie die eerder is opgeslagen via de instellingen van uw
                  browser verwijderen.
                </p>
              </div>

              <div>
                <h2 className="text-gray-900 font-bold uppercase tracking-wide text-xs mb-2">
                  Gegevens inzien, aanpassen of verwijderen
                </h2>
                <p className="mb-3">
                  U heeft het recht om uw persoonsgegevens in te zien, te
                  corrigeren of te verwijderen. Daarnaast heeft u het recht om
                  uw eventuele toestemming voor de gegevensverwerking in te
                  trekken of bezwaar te maken tegen de verwerking van uw
                  persoonsgegevens door U.S. Basketball en heeft u het recht op
                  gegevensoverdraagbaarheid. Dat betekent dat u bij ons een
                  verzoek kunt indienen om de persoonsgegevens die wij van u
                  beschikken in een computerbestand naar u of een ander, door u
                  genoemde organisatie, te sturen.
                </p>
                <p className="mb-3">
                  U kunt een verzoek tot inzage, correctie, verwijdering,
                  gegevensoverdraging van uw persoonsgegevens of verzoek tot
                  intrekking van uw toestemming of bezwaar op de verwerking van
                  uw persoonsgegevens sturen naar{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-gray-900 font-medium hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
                <p className="mb-3">
                  Om er zeker van te zijn dat het verzoek tot inzage door u is
                  gedaan, vragen wij u een kopie van uw identiteitsbewijs met
                  het verzoek mee te sturen. Maak in deze kopie uw pasfoto, MRZ
                  (machine readable zone, de strook met nummers onderaan het
                  paspoort), paspoortnummer en Burgerservicenummer (BSN) zwart.
                  Dit ter bescherming van uw privacy. We reageren zo snel
                  mogelijk, maar binnen vier weken, op uw verzoek.
                </p>
                <p>
                  U.S. Basketball wil u er tevens op wijzen dat u de
                  mogelijkheid heeft om een klacht in te dienen bij de nationale
                  toezichthouder, de Autoriteit Persoonsgegevens. Dat kan via de
                  volgende link:{" "}
                  <a
                    href="https://autoriteitpersoonsgegevens.nl/nl/contact-met-de-autoriteit-persoonsgegevens/tip-ons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 font-medium hover:underline"
                  >
                    autoriteitpersoonsgegevens.nl
                  </a>
                  .
                </p>
              </div>

              <div>
                <h2 className="text-gray-900 font-bold uppercase tracking-wide text-xs mb-2">
                  Hoe wij persoonsgegevens beveiligen
                </h2>
                <p>
                  U.S. Basketball neemt de bescherming van uw gegevens serieus
                  en neemt passende maatregelen om misbruik, verlies, onbevoegde
                  toegang, ongewenste openbaarmaking en ongeoorloofde wijziging
                  tegen te gaan. Als u de indruk heeft dat uw gegevens niet goed
                  beveiligd zijn of er aanwijzingen zijn van misbruik, neem dan
                  contact op via{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-gray-900 font-medium hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </div>
            </>
          ) : (
            <>
              <p>
                U.S. Basketball, established at Tweede Boerhaavestraat 10,
                1091AN Amsterdam, is responsible for the processing of personal
                data as described in this privacy policy.
              </p>

              <div>
                <h2 className="text-gray-900 font-bold uppercase tracking-wide text-xs mb-2">
                  Contact details
                </h2>
                <p>
                  <a
                    href="https://www.usbasketball.nl"
                    className="text-gray-900 font-medium hover:underline"
                  >
                    https://www.usbasketball.nl
                  </a>
                  <br />
                  Tweede Boerhaavestraat 10, 1091AN Amsterdam
                </p>
              </div>

              <div>
                <h2 className="text-gray-900 font-bold uppercase tracking-wide text-xs mb-2">
                  Personal data we process
                </h2>
                <p className="mb-3">
                  U.S. Basketball processes your personal data because you use
                  our services and/or because you have provided it to us
                  yourself. Below is an overview of the personal data we
                  process:
                </p>
                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>First and last name</li>
                  <li>Gender</li>
                  <li>Date of birth</li>
                  <li>Address details</li>
                  <li>Phone number</li>
                  <li>Email address</li>
                  <li>
                    Other personal data you actively provide, for example by
                    creating a profile on this website, in correspondence or by
                    phone
                  </li>
                  <li>Bank account number</li>
                </ul>
              </div>

              <div>
                <h2 className="text-gray-900 font-bold uppercase tracking-wide text-xs mb-2">
                  Special and/or sensitive personal data we process
                </h2>
                <p>
                  Our website and/or service does not intend to collect data
                  about website visitors under the age of 16, unless they have
                  permission from parents or guardians. However, we cannot
                  verify whether a visitor is older than 16. We therefore
                  encourage parents to be involved in their children&apos;s
                  online activities to prevent data about children being
                  collected without parental consent. If you believe we have
                  collected personal data about a minor without such consent,
                  please contact us at{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-gray-900 font-medium hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>{" "}
                  and we will delete this information.
                </p>
              </div>

              <div>
                <h2 className="text-gray-900 font-bold uppercase tracking-wide text-xs mb-2">
                  Purpose and legal basis for processing personal data
                </h2>
                <p className="mb-3">
                  U.S. Basketball processes your personal data for the following
                  purposes:
                </p>
                <ul className="list-disc list-inside flex flex-col gap-1">
                  <li>Processing your payment</li>
                  <li>Sending our newsletter and/or promotional materials</li>
                  <li>
                    Calling or emailing you when necessary to perform our
                    services
                  </li>
                  <li>
                    Informing you about changes to our services and products
                  </li>
                  <li>Giving you the option to create an account</li>
                </ul>
              </div>

              <div>
                <h2 className="text-gray-900 font-bold uppercase tracking-wide text-xs mb-2">
                  How long we retain personal data
                </h2>
                <p>
                  U.S. Basketball does not retain your personal data longer than
                  strictly necessary to achieve the purposes for which your data
                  is collected. We apply a retention period of 7 years for
                  personal data.
                </p>
              </div>

              <div>
                <h2 className="text-gray-900 font-bold uppercase tracking-wide text-xs mb-2">
                  Sharing personal data with third parties
                </h2>
                <p>
                  U.S. Basketball only shares data with third parties when
                  necessary for the execution of our agreement with you or to
                  comply with a legal obligation.
                </p>
              </div>

              <div>
                <h2 className="text-gray-900 font-bold uppercase tracking-wide text-xs mb-2">
                  Cookies and similar technologies
                </h2>
                <p>
                  U.S. Basketball only uses technical and functional cookies,
                  and analytical cookies that do not infringe on your privacy. A
                  cookie is a small text file stored on your computer, tablet,
                  or smartphone during your first visit to this website. The
                  cookies we use are necessary for the technical functioning of
                  the website and your ease of use. They ensure the website
                  works properly and remember your preferences. We also use them
                  to optimise our website. You can opt out of cookies by
                  configuring your browser to no longer store cookies. You can
                  also delete previously stored information through your browser
                  settings.
                </p>
              </div>

              <div>
                <h2 className="text-gray-900 font-bold uppercase tracking-wide text-xs mb-2">
                  Accessing, modifying, or deleting your data
                </h2>
                <p className="mb-3">
                  You have the right to access, correct, or delete your personal
                  data. You also have the right to withdraw consent for data
                  processing, to object to the processing of your personal data
                  by U.S. Basketball, and the right to data portability —
                  meaning you can request that we send the personal data we hold
                  about you to you or another organisation you specify, in a
                  computer-readable format.
                </p>
                <p className="mb-3">
                  To submit a request for access, correction, deletion, data
                  transfer, withdrawal of consent, or objection to processing,
                  please email{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-gray-900 font-medium hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
                <p className="mb-3">
                  To verify that the request is made by you, we ask that you
                  include a copy of your ID. Please black out your passport
                  photo, MRZ (the strip with numbers at the bottom of the
                  passport), passport number, and citizen service number (BSN)
                  to protect your privacy. We will respond as soon as possible,
                  and within four weeks.
                </p>
                <p>
                  U.S. Basketball also wishes to inform you that you have the
                  right to file a complaint with the national supervisory
                  authority, the Autoriteit Persoonsgegevens:{" "}
                  <a
                    href="https://autoriteitpersoonsgegevens.nl/nl/contact-met-de-autoriteit-persoonsgegevens/tip-ons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 font-medium hover:underline"
                  >
                    autoriteitpersoonsgegevens.nl
                  </a>
                  .
                </p>
              </div>

              <div>
                <h2 className="text-gray-900 font-bold uppercase tracking-wide text-xs mb-2">
                  How we secure personal data
                </h2>
                <p>
                  U.S. Basketball takes the protection of your data seriously
                  and implements appropriate measures to prevent misuse, loss,
                  unauthorised access, unwanted disclosure, and unauthorised
                  modification. If you believe your data is not properly secured
                  or there are indications of misuse, please contact us at{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-gray-900 font-medium hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
