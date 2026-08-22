import { Resend } from "resend";

import { siteConfig } from "@/lib/site";

const fromAddress =
  process.env.EMAIL_FROM ?? "US Basketball <onboarding@resend.dev>";

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }
  return new Resend(apiKey);
}

export type InterestSubmissionData = {
  name: string;
  email: string;
  birthDate: Date;
  position: string;
  interest: string;
  gender: string;
  lastLevel: string | null;
  lastSeason: string | null;
  background: string | null;
  locale: string;
};

type Locale = "nl" | "en";

const labels: Record<Locale, Record<string, string>> = {
  nl: {
    name: "Naam",
    lastLevel: "Laatst gespeelde niveau",
    position: "Positie",
    birthDate: "Geboortedatum",
    lastSeason: "Laatst gespeelde seizoen",
    interest: "Interesse in",
    email: "E-mailadres",
    gender: "Ik identificeer me als",
    background: "Meer informatie over je achtergrond/niveau",
  },
  en: {
    name: "Name",
    lastLevel: "Last played level",
    position: "Position",
    birthDate: "Birth date",
    lastSeason: "Last played season",
    interest: "Interest in",
    email: "Email address",
    gender: "I identify as",
    background: "More info about your background/level",
  },
};

const positionLabels: Record<Locale, Record<string, string>> = {
  nl: {
    guard: "Guard",
    forward: "Forward",
    center: "Center",
    not_applicable: "N.V.T.",
    other: "Anders",
  },
  en: {
    guard: "Guard",
    forward: "Forward",
    center: "Center",
    not_applicable: "N/A",
    other: "Other",
  },
};

const interestLabels: Record<Locale, Record<string, string>> = {
  nl: {
    compete: "Trainen en wedstrijden spelen",
    training_only: "Alleen trainen",
    undecided: "Weet ik nog niet zeker",
  },
  en: {
    compete: "Training and playing matches",
    training_only: "Training only",
    undecided: "Not sure yet",
  },
};

const genderLabels: Record<Locale, Record<string, string>> = {
  nl: { man: "Man", vrouw: "Vrouw" },
  en: { man: "Man", woman: "Woman" },
};

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c] ?? c
  );
}

function toLocale(data: InterestSubmissionData): Locale {
  return data.locale === "en" ? "en" : "nl";
}

function summaryHtml(data: InterestSubmissionData): string {
  const locale = toLocale(data);
  const L = labels[locale];
  const birthDate = new Intl.DateTimeFormat(
    locale === "nl" ? "nl-NL" : "en-GB",
    { dateStyle: "long" }
  ).format(data.birthDate);

  const rows: Array<[string, string]> = [
    [L.name, escapeHtml(data.name)],
    [L.lastLevel, escapeHtml(data.lastLevel ?? "—")],
    [L.position, positionLabels[locale][data.position] ?? escapeHtml(data.position)],
    [L.birthDate, birthDate],
    [L.lastSeason, escapeHtml(data.lastSeason ?? "—")],
    [L.interest, interestLabels[locale][data.interest] ?? escapeHtml(data.interest)],
    [L.email, escapeHtml(data.email)],
    [L.gender, genderLabels[locale][data.gender] ?? escapeHtml(data.gender)],
    [L.background, escapeHtml(data.background ?? "—")],
  ];

  return rows
    .map(
      ([label, value]) =>
        `<p style="margin:0 0 8px"><strong>${label}:</strong> ${value}</p>`
    )
    .join("");
}

function wrapper(inner: string): string {
  return `
    <div style="font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#414141;">
      ${inner}
      <hr style="border:none;border-top:1px solid #d9d7d4;margin:24px 0" />
      <p style="margin:0;font-size:12px;color:#6f6f6f;">
        U.S. Basketbal Amsterdam · ${siteConfig.address}
      </p>
    </div>
  `;
}

export async function sendInterestConfirmation(
  data: InterestSubmissionData
): Promise<void> {
  if (process.env.PLAYWRIGHT_TEST === "1" || process.env.NODE_ENV === "test") {
    return;
  }

  const locale = toLocale(data);
  const isNl = locale === "nl";

  const intro = isNl
    ? `<p>Hoi ${escapeHtml(data.name)},</p>
       <p>Bedankt voor je interesse in U.S. Basketbal! We hebben je aanmelding ontvangen.</p>
       <p>Wij hopen je binnen twee weken te kunnen laten weten of er plekken beschikbaar zijn in een team dat aansluit bij jouw wensen en ervaring. Houd er rekening mee dat dit soms wat langer kan duren, omdat ons werk volledig door vrijwilligers wordt gedaan.</p>`
    : `<p>Hi ${escapeHtml(data.name)},</p>
       <p>Thanks for your interest in US Basketball! We have received your submission.</p>
       <p>We hope to let you know within two weeks whether there are spots available in a team that matches your wishes and experience. Please note that this can sometimes take longer, since we are run entirely by volunteers.</p>`;

  const outro = isNl
    ? `<p>De informatie die je hebt ingevuld kan worden ingezien door het bestuur en de technische commissie van U.S. Basketball en wordt alleen gebruikt om een geschikt team voor je te zoeken.</p>`
    : `<p>The information you provided can be viewed by the board and technical committee of US Basketball and will only be used to find a suitable team for you.</p>`;

  const { error } = await getResend().emails.send({
    from: fromAddress,
    to: [data.email],
    replyTo: data.email,
    subject: isNl
      ? "Interesseformulier ontvangen — U.S. Basketbal"
      : "We received your interest form — US Basketball",
    html: wrapper(`${intro}${outro}<p><strong>${isNl ? "Jouw aanmelding" : "Your submission"}</strong></p>${summaryHtml(data)}`),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function sendInterestNotification(
  data: InterestSubmissionData
): Promise<void> {
  if (process.env.PLAYWRIGHT_TEST === "1" || process.env.NODE_ENV === "test") {
    return;
  }

  const locale = toLocale(data);
  const isNl = locale === "nl";

  const intro = isNl
    ? `<p>Er is een nieuw interesseformulier binnengekomen via de website.</p>`
    : `<p>A new interest form has been submitted via the website.</p>`;

  const { error } = await getResend().emails.send({
    from: fromAddress,
    to: [siteConfig.technicalCommitteeEmail],
    cc: [siteConfig.secretariatEmail],
    replyTo: data.email,
    subject: isNl
      ? `Nieuw interesseformulier — ${data.name}`
      : `New interest form — ${data.name}`,
    html: wrapper(
      `${intro}${summaryHtml(data)}
       <p style="margin-top:16px;font-size:12px;color:#6f6f6f;">
         ${isNl ? "Reageren kan direct via 'Antwoorden' (adres van de aanmelder is ingesteld)." : "You can reply directly (the applicant's address is set as reply-to)."}
       </p>`
    ),
  });

  if (error) {
    throw new Error(error.message);
  }
}
