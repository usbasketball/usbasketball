/**
 * One-time migration: creates content types and populates entries in Contentful.
 * Run with: npx tsx scripts/migrate-to-contentful.ts
 */

import {ContentFields, createClient, KeyValueMap} from "contentful-management";

const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;

if (!MANAGEMENT_TOKEN || !SPACE_ID) {
  console.error(
    "Missing CONTENTFUL_MANAGEMENT_TOKEN or CONTENTFUL_SPACE_ID in environment",
  );
  process.exit(1);
}
const ENV_ID = "master";

const client = createClient({accessToken: MANAGEMENT_TOKEN});

// ─── Source data ──────────────────────────────────────────────────────────────

const informatieSectionsNl = [
  {
    sectionId: "teams",
    order: 1,
    title: "Teams",
    body: [
      'US Basketball is al sinds 1951 een van de basketbalverenigingen in Amsterdam. Ons motto: "If you can\'t beat US, join US". Wees gewaarschuwd: US voelt als een extra familie!',
      "Alle US-competitieteams hebben op woensdagavond een training van 75 minuten. Sommige teams trainen daarnaast ook op vrijdagavond.",
      "Thuiswedstrijden spelen we op zondag in de Amstelcampushal.",
      "Wil je basketballen maar liever geen competitie? Dat kan ook bij US! We hebben een enthousiast recreatieteam dat op dinsdag- en donderdagavond traint in de Apollohal.",
      "Na trainingen en wedstrijden zijn veel leden te vinden in de kantine voor de nodige gezelligheid — of op de tribune om andere teams aan te moedigen. Een heerlijke mix van sport en plezier waar iedereen zich thuis voelt.",
    ],
    ctaText: "Bekijk de standen en competities op basketball.nl",
    ctaHref: "https://www.basketball.nl",
    ctaExternal: true,
  },
  {
    sectionId: "aanmelden",
    order: 2,
    title: "Meedoen",
    body: [
      "Hou je van basketbal én van gezelligheid? Dan zit je goed bij US Basketball! Bij US kun je twee keer gratis meetrainen om te zien welk team het beste bij je past. Ben je enthousiast? Vul dan het aanmeldformulier in. We nodigen je snel uit voor een proeftraining met een van onze teams of de recreatiegroep. Wanneer een geschikt team is gevonden, ontvang je een inschrijfformulier en ronden we je registratie af.",
      "Heb je de afgelopen 5 jaar bij een andere club gespeeld? Zorg dan dat je daar uitgeschreven bent. De schuldbriefkwijting wordt via Sportlink online verklaard.",
    ],
    ctaText: "Aanmelden",
    ctaHref: "/aanmelden",
    ctaExternal: false,
  },
  {
    sectionId: "contributie",
    order: 3,
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
    sectionId: "tenue",
    order: 4,
    title: "Tenue & merchandise",
    body: [
      "Op zoek naar een nieuw outfit of wil je wat van die geweldige US-merchandise? Bekijk dan onze clubshop:",
    ],
    ctaText: "bbtshop.nl/clubshop/us-amsterdam",
    ctaHref: "https://www.bbtshop.nl/clubshop/us-amsterdam.html",
    ctaExternal: true,
  },
  {
    sectionId: "uitschrijven",
    order: 5,
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
];

const informatieSectionsEn = [
  {
    sectionId: "teams",
    title: "Teams",
    body: [
      "US Basketball has been one of Amsterdam's basketball clubs since 1951. Our motto: \"If you can't beat US, join US\". Be warned: US will feel like an extra family!",
      "All US league teams have a 75-minute training session on Wednesday evening. Some teams also train on Friday evenings.",
      "We play home games on Sundays in the Amstelcampushal.",
      "Want to play basketball but skip the competition? That's also possible at US! We have an enthusiastic recreational team that trains in the Apollo hall on Tuesday and Thursday evenings.",
      "After training sessions and games, many members gather in the canteen for fun and socializing — or in the stands to cheer on other teams. A wonderful mix of competition and camaraderie where everyone feels at home.",
    ],
    ctaText: "Check standings and competitions at basketball.nl",
  },
  {
    sectionId: "join",
    title: "Join US",
    body: [
      "Do you like basketball and socializing? Then you're in the right place at US Basketball! At US you can train twice free of charge to find which team suits you best. If you like it, fill in the registration form. We'll quickly invite you for a trial session with one of our teams or the recreational group. Once a suitable team is found, you'll receive a registration form and we'll complete your sign-up.",
      "Have you played for another club in the past 5 years? Make sure you are deregistered there. The debt release is declared online via Sportlink.",
    ],
    ctaText: "Sign up",
  },
  {
    sectionId: "fees",
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
    sectionId: "uniforms",
    title: "Uniforms & merchandise",
    body: [
      "Looking for a new outfit or want some awesome US merchandise? Check out our club shop:",
    ],
    ctaText: "bbtshop.nl/clubshop/us-amsterdam",
  },
  {
    sectionId: "leave",
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
];

const committeesNl = [
  {
    name: "Bestuur",
    description:
      "Leidt de vereniging: regelt de dagelijkse gang van zaken, beleid en communicatie.",
    order: 1,
  },
  {
    name: "Coaches & Trainers",
    description:
      "Leidt teams op het veld. Zowel spelcoaches als conditietrainers zijn welkom.",
    order: 2,
  },
  {
    name: "OMNI",
    description:
      "Vertegenwoordigt US Basketball bij OMNI, de overkoepelende sportvereniging in Amsterdam.",
    order: 3,
  },
  {
    name: "Borrelcommissie",
    description:
      "Organiseert de sociale activiteiten en borrels rondom trainingen en wedstrijden.",
    order: 4,
  },
  {
    name: "Vertrouwenspersoon",
    description:
      "Eerste aanspreekpunt voor leden bij problemen of ongewenst gedrag binnen de club.",
    order: 5,
  },
  {
    name: "Technische Commissie (TC)",
    description:
      "Begeleidt nieuwe en aankomende talenten en zorgt voor de juiste teamindeling.",
    order: 6,
  },
  {
    name: "Sponsorcommissie",
    description:
      "Werft en onderhoudt sponsorrelaties om de club financieel te ondersteunen.",
    order: 7,
  },
  {
    name: "Socials",
    description:
      "Beheert de sociale media van US Basketball en zorgt voor online zichtbaarheid.",
    order: 8,
  },
  {
    name: "Scheidsrechterscursus",
    description:
      "Coördineert de opleiding van leden tot gecertificeerde scheidsrechters.",
    order: 9,
  },
  {
    name: "KasCo",
    description:
      "Controleert de financiële gezondheid van de vereniging als onafhankelijke kascommissie.",
    order: 10,
  },
  {
    name: "OMNI 5-kamp",
    description:
      "Organiseert de jaarlijkse OMNI 5-kamp. Doe mee om erachter te komen wat het inhoudt!",
    order: 11,
  },
  {
    name: "Zaaldienst",
    description:
      "Zorgt voor de opbouw, afbouw en orde tijdens thuiswedstrijden in de Amstelcampushal.",
    order: 12,
  },
  {
    name: "ITUS Commissie",
    description: "Organiseert het jaarlijkse interne toernooi voor US-leden.",
    order: 13,
  },
];

const committeesEn = [
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
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loc<T>(nl: T, en: T, enLocale: string): Record<string, T> {
  return {nl, [enLocale]: en};
}

function locNl<T>(value: T): Record<string, T> {
  return {nl: value};
}

async function deleteAllEntries(contentTypeId: string) {
  const entries = await client.entry.getMany({
    spaceId: SPACE_ID!,
    environmentId: ENV_ID,
    query: {content_type: contentTypeId, limit: 1000},
  });
  for (const entry of entries.items) {
    try {
      await client.entry.unpublish({
        spaceId: SPACE_ID!,
        environmentId: ENV_ID,
        entryId: entry.sys.id,
      });
    } catch {}
    await client.entry.delete({
      spaceId: SPACE_ID!,
      environmentId: ENV_ID,
      entryId: entry.sys.id,
    });
  }
}

async function deleteContentType(id: string) {
  await deleteAllEntries(id);
  try {
    await client.contentType.unpublish({
      spaceId: SPACE_ID!,
      environmentId: ENV_ID,
      contentTypeId: id,
    });
  } catch {}
  try {
    await client.contentType.delete({
      spaceId: SPACE_ID!,
      environmentId: ENV_ID,
      contentTypeId: id,
    });
  } catch {}
}

async function upsertContentType(
  fields: ContentFields<KeyValueMap>[],
  id: string,
  name: string,
  enLocale: string,
) {
  await deleteContentType(id);
  const ct = await client.contentType.createWithId(
    {spaceId: SPACE_ID!, environmentId: ENV_ID, contentTypeId: id},
    {name, fields, displayField: (fields[0] as {id: string}).id},
  );
  await client.contentType.publish(
    {spaceId: SPACE_ID!, environmentId: ENV_ID, contentTypeId: id},
    ct,
  );
  console.log(`  ✓ ${id}`);
  void enLocale;
}

async function createEntry(
  contentTypeId: string,
  fields: Record<string, unknown>,
) {
  const entry = await client.entry.create(
    {spaceId: SPACE_ID, environmentId: ENV_ID, contentTypeId},
    {fields},
  );
  await client.entry.publish(
    {spaceId: SPACE_ID, environmentId: ENV_ID, entryId: entry.sys.id},
    entry,
  );
  return entry;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Detect English locale key (en-US or en)
  const localesRes = await client.locale.getMany({
    spaceId: SPACE_ID,
    environmentId: ENV_ID,
  });
  const localeCodes = localesRes.items.map((l: {code: string}) => l.code);
  console.log("Locales:", localeCodes.join(", "));

  let enLocale = localeCodes.find((c: string) => c.startsWith("en")) ?? "en-US";
  if (!localeCodes.includes(enLocale)) {
    console.log(`Creating ${enLocale} locale...`);
    await client.locale.create(
      {spaceId: SPACE_ID, environmentId: ENV_ID},
      {
        name: "English (United States)",
        code: "en-US",
        fallbackCode: "nl",
        optional: true,
      },
    );
    enLocale = "en-US";
  }
  console.log(`Using English locale: ${enLocale}\n`);

  // ── Content types ──────────────────────────────────────────────────────────

  console.log("── Content types ──");

  const sym = (
    id: string,
    name: string,
    localized: boolean,
    required = false,
  ) => ({id, name, type: "Symbol", localized, required, validations: []});
  const arr = (id: string, name: string, localized: boolean) => ({
    id,
    name,
    type: "Array",
    localized,
    required: false,
    validations: [],
    items: {type: "Text", validations: []},
  });
  const int = (id: string, name: string) => ({
    id,
    name,
    type: "Integer",
    localized: false,
    required: true,
    validations: [],
  });
  const bool = (id: string, name: string) => ({
    id,
    name,
    type: "Boolean",
    localized: false,
    required: false,
    validations: [],
  });
  const text = (
    id: string,
    name: string,
    localized: boolean,
    required = false,
  ) => ({id, name, type: "Text", localized, required, validations: []});

  await upsertContentType(
    [
      sym("sectionId", "Section ID", false, true),
      int("order", "Order"),
      sym("title", "Title", true, true),
      arr("body", "Body", true),
      arr("list", "List", true),
      text("note", "Note", true),
      text("disclaimer", "Disclaimer", true),
      sym("ctaText", "CTA Text", true),
      sym("ctaHref", "CTA Href", false),
      bool("ctaExternal", "CTA External"),
    ],
    "informatieSection",
    "Informatie Section",
    enLocale,
  );

  await upsertContentType(
    [
      sym("name", "Name", true, true),
      sym("description", "Description", true, true),
      int("order", "Order"),
    ],
    "committee",
    "Committee",
    enLocale,
  );

  await upsertContentType(
    [text("intro", "Intro", true, true), sym("cta", "CTA", true, true)],
    "helpUsPage",
    "Help US Page",
    enLocale,
  );

  await upsertContentType(
    [
      sym("postUrl", "Post URL", false, true),
      sym("imageAlt", "Image Alt", true, true),
      sym("caption", "Caption", true, true),
    ],
    "instagramPost",
    "Instagram Post",
    enLocale,
  );

  // ── Entries ────────────────────────────────────────────────────────────────

  console.log("\n── informatieSection entries ──");
  for (let i = 0; i < informatieSectionsNl.length; i++) {
    const nl = informatieSectionsNl[i];
    const en = informatieSectionsEn[i];
    const fields: Record<string, unknown> = {
      sectionId: locNl(nl.sectionId),
      order: locNl(nl.order),
      title: loc(nl.title, en.title, enLocale),
      body: loc(nl.body, en.body, enLocale),
    };
    if (nl.list) fields.list = loc(nl.list, (en as typeof nl).list!, enLocale);
    if (nl.note) fields.note = loc(nl.note, (en as typeof nl).note!, enLocale);
    if ("disclaimer" in nl && nl.disclaimer)
      fields.disclaimer = loc(
        nl.disclaimer,
        (en as typeof nl).disclaimer!,
        enLocale,
      );
    if (nl.ctaText) {
      fields.ctaText = loc(nl.ctaText, en.ctaText!, enLocale);
      fields.ctaHref = locNl(nl.ctaHref);
      fields.ctaExternal = locNl(nl.ctaExternal);
    }
    await createEntry("informatieSection", fields);
    console.log(`  ✓ ${nl.sectionId}`);
  }

  console.log("\n── committee entries ──");
  for (let i = 0; i < committeesNl.length; i++) {
    const nl = committeesNl[i];
    const en = committeesEn[i];
    await createEntry("committee", {
      name: loc(nl.name, en.name, enLocale),
      description: loc(nl.description, en.description, enLocale),
      order: locNl(nl.order),
    });
    console.log(`  ✓ ${nl.name}`);
  }

  console.log("\n── helpUsPage entry ──");
  await createEntry("helpUsPage", {
    intro: loc(
      "US Basketball draait op vrijwilligers. Of je nu wil meehelpen achter de schermen, op de vloer, of in een commissie — er is altijd een plek voor jou. Hieronder vind je alle functies en commissies waar je je voor kunt opgeven.",
      "US Basketball runs on volunteers. Whether you want to help behind the scenes, on the court, or in a committee — there's always a place for you. Below you'll find all the functions and committees you can sign up for.",
      enLocale,
    ),
    cta: loc(
      "Stuur een e-mail naar bestuur@usbasketball.nl om je aan te melden voor een functie of commissie.",
      "Send an email to bestuur@usbasketball.nl to sign up for a function or committee.",
      enLocale,
    ),
  });
  console.log("  ✓ helpUsPage");

  console.log("\n── instagramPost entry ──");
  await createEntry("instagramPost", {
    postUrl: locNl(
      "https://www.instagram.com/p/DIZDlQiok7_/?utm_source=ig_embed&utm_campaign=loading",
    ),
    imageAlt: loc(
      "U.S. Basketball Amsterdam H4 kampioen",
      "U.S. Basketball Amsterdam H4 champions",
      enLocale,
    ),
    caption: loc(
      "Nu officieel kampioenen: H4! 🏆🥇🍾",
      "Now officially champs: H4! 🏆🥇🍾",
      enLocale,
    ),
  });
  console.log("  ✓ instagramPost");

  console.log("\n✅ Migration complete!");
}

main().catch((err) => {
  console.error("Migration failed:", err?.message ?? err);
  if (err?.details) console.error(JSON.stringify(err.details, null, 2));
  process.exit(1);
});
