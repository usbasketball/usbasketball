import type {Locale} from "./types";

const dictionaries = {
  nl: {
    nav: {
      home: "Home",
      informatie: "Informatie",
      nieuws: "Nieuws",
      trainingschema: "Trainingschema",
      takenschema: "Takenschema",
      helpUs: "Help US",
      contact: "Contact",
      aanmelden: "Aanmelden",
    },
    common: {
      menu: "Menu",
      locatie: "Locatie",
      email: "Email",
      social: "Social",
      links: "Links",
      contact: "Contact",
    },
    home: {
      heroSubtitle: "Amsterdam \u2022 Amstelcampushal",
      registerBtn: "Doe mee!",
      aboutBtn: "Wie zijn wij?",
      welcome: "Welkom bij de familie",
      welcomeTitle: "Basketbal, bier & ballen",
      welcomeText:
        "De Amstelcampushal is ons tweede thuis \u2014 en eerlijk gezegd voelt het soms meer als ons eerste. Hier schieten we hoopjes op \u00e9n naast het veld. Met zes dames- en zes herenteams vind je altijd je mensen (18+, maar jong van geest).",
      teams: "Teams",
      womensTeams: "Dames teams",
      mensTeams: "Heren teams",
      season: "Seizoen",
      news: "Nieuws",
      usNews: "US Nieuws",
      allNews: "Meer nieuws \u2192",
      photo: "Foto",
      newSeason: "Het seizoen is open!",
      newSeasonText:
        "Nieuw seizoen, nieuwe kansen, zelfde gezelligheid. Schrijf je in voor 2024\u20132025!",
      registerNow: "Join US!",
    },
    informatie: {
      title: "Informatie",
      subtitle:
        "Alles wat je wil weten over US \u2014 en een paar dingen die je niet wist dat je wou weten.",
      placeholder:
        "Van clubgeschiedenis tot teamindelingen, van het bestuur tot de kantine \u2014 alles over US komt hier.",
    },
    trainingschema: {
      title: "Trainingschema",
      subtitle: "Wanneer en waar we zweten. Geen excuses meer!",
      placeholder:
        "De trainingstijden per team voor seizoen 2024\u20132025 verschijnen hier binnenkort. Rek je alvast uit.",
    },
    takenschema: {
      title: "Takenschema",
      subtitle: "Een club draait op vrijwilligers \u2014 en op jou!",
      placeholder:
        "Hier zie je straks wie wanneer welke taak heeft bij thuiswedstrijden. Samen maken we er iets moois van.",
    },
    helpUs: {
      title: "Help US",
      subtitle:
        "Houd van het spel? Houd van US! Steun ons als sponsor of vrijwilliger.",
      placeholder:
        "Hier vind je binnenkort alle manieren om US te steunen \u2014 van sponsorpakketten tot shoppen via onze partnerwinkels. Elke euro telt!",
    },
    vertrouwenspersoon: {
      title: "Vertrouwenspersoon",
      subtitle:
        "Soms moet je gewoon even met iemand praten. Dat kan altijd bij US.",
      text1:
        "Heb je iets meegemaakt binnen de club dat niet ok\u00e9 voelde? Of wil je ergens over praten in vertrouwen? Onze vertrouwenspersoon is er voor alle leden \u2014 zonder oordeel, zonder drempel.",
      text2: "Neem contact op via:",
      moreInfo: "Meer informatie volgt binnenkort op deze pagina.",
    },
    aanmelden: {
      title: "Aanmelden",
      subtitle:
        "Je eerste stap naar het beste team van Amsterdam. Welkom thuis!",
      intro:
        "Klaar om deel uit te maken van de US-familie? Vul het formulier in en we nemen zo snel mogelijk contact met je op. Spoiler: je gaat er geen spijt van krijgen.",
      firstName: "Voornaam",
      lastName: "Achternaam",
      emailField: "E-mailadres",
      phone: "Telefoonnummer",
      birthDate: "Geboortedatum",
      teamPreference: "Team voorkeur",
      formComingSoon: "Aanmeldformulier komt er snel aan \u2014 check back!",
    },
    placeholder: {
      underConstruction: "Komt eraan! \u{1F3C0}",
    },
    footer: {
      vertrouwenspersoon: "Vertrouwenspersoon",
      privacy: "Privacyverklaring",
    },
  },
  en: {
    nav: {
      home: "Home",
      informatie: "About",
      nieuws: "News",
      trainingschema: "Training Schedule",
      takenschema: "Task Schedule",
      helpUs: "Help US",
      contact: "Contact",
      aanmelden: "Register",
    },
    common: {
      menu: "Menu",
      locatie: "Location",
      email: "Email",
      social: "Social",
      links: "Links",
      contact: "Contact",
    },
    home: {
      heroSubtitle: "Amsterdam \u2022 Amstelcampushal",
      registerBtn: "Join US!",
      aboutBtn: "Who are we?",
      welcome: "Welcome to the family",
      welcomeTitle: "Basketball, beer & good vibes",
      welcomeText:
        "The Amstelcampushal is our second home \u2014 honestly, it might be our first. We shoot hoops on the court and in the canteen. With six women\u2019s and six men\u2019s teams, you\u2019ll always find your people here (18+, young at heart).",
      teams: "Teams",
      womensTeams: "Women\u2019s teams",
      mensTeams: "Men\u2019s teams",
      season: "Season",
      news: "News",
      usNews: "US News",
      allNews: "More news \u2192",
      photo: "Photo",
      newSeason: "The season is open!",
      newSeasonText:
        "New season, new chances, same great crew. Sign up for 2024\u20132025!",
      registerNow: "Join US!",
    },
    informatie: {
      title: "About",
      subtitle:
        "Everything you want to know about US \u2014 and a few things you didn\u2019t know you needed.",
      placeholder:
        "From club history to team divisions, from the board to the canteen \u2014 everything about US comes here.",
    },
    trainingschema: {
      title: "Training Schedule",
      subtitle: "When and where we sweat. No excuses!",
      placeholder:
        "Training times per team for the 2024\u20132025 season will appear here soon. Start stretching.",
    },
    takenschema: {
      title: "Task Schedule",
      subtitle: "A club runs on volunteers \u2014 and that means you!",
      placeholder:
        "Here you\u2019ll soon see who does what at home games. Together we make it happen.",
    },
    helpUs: {
      title: "Help US",
      subtitle: "Love the game? Love US! Support us as a sponsor or volunteer.",
      placeholder:
        "All the ways to support US are coming here soon \u2014 from sponsorship packages to shopping through our partner stores. Every bit counts!",
    },
    vertrouwenspersoon: {
      title: "Confidential Counselor",
      subtitle:
        "Sometimes you just need to talk to someone. At US, you always can.",
      text1:
        "Has something happened within the club that didn\u2019t feel right? Or do you want to talk about something in confidence? Our confidential counselor is here for all members \u2014 no judgment, no barriers.",
      text2: "Get in touch via:",
      moreInfo: "More information will follow shortly on this page.",
    },
    aanmelden: {
      title: "Register",
      subtitle:
        "Your first step toward the best team in Amsterdam. Welcome home!",
      intro:
        "Ready to become part of the US family? Fill in the form and we\u2019ll be in touch as soon as possible. Spoiler: you won\u2019t regret it.",
      firstName: "First name",
      lastName: "Last name",
      emailField: "Email address",
      phone: "Phone number",
      birthDate: "Date of birth",
      teamPreference: "Team preference",
      formComingSoon: "Registration form coming soon \u2014 check back!",
    },
    placeholder: {
      underConstruction: "Coming soon! \u{1F3C0}",
    },
    footer: {
      vertrouwenspersoon: "Confidential Counselor",
      privacy: "Privacy Policy",
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
