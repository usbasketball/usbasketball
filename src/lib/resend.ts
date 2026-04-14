import {Resend} from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export interface RegistrationData {
  name: string;
  birthDate: string;
  email: string;
  gender: string;
  lastLevel: string;
  lastSeason: string;
  position: string;
  interest: string;
  remarks: string;
  locale: string;
}

// use onboarding@resend.dev as FROM for testing
const FROM = "US Basketball <noreply@usbasketball.nl>";
const SECRETARIS_EMAIL = "secretaris@usbasketball.nl";
const TC_EMAIL = "tc@usbasketball.nl";

function boardNotificationHtml(data: RegistrationData): string {
  return `
    <h2>Nieuwe aanmelding / New registration</h2>
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
      <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Naam / Name</td><td style="padding:6px 12px">${data.name}</td></tr>
      <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Geboortedatum / Date of birth</td><td style="padding:6px 12px">${data.birthDate}</td></tr>
      <tr><td style="padding:6px 12px;font-weight:bold;color:#555">E-mail</td><td style="padding:6px 12px">${data.email}</td></tr>
      <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Geslacht / Gender</td><td style="padding:6px 12px">${data.gender}</td></tr>
      <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Laatste niveau / Last level</td><td style="padding:6px 12px">${data.lastLevel}</td></tr>
      <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Laatste seizoen / Last season</td><td style="padding:6px 12px">${data.lastSeason}</td></tr>
      <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Positie / Position</td><td style="padding:6px 12px">${data.position}</td></tr>
      <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Interesse / Interest</td><td style="padding:6px 12px">${data.interest}</td></tr>
      ${data.remarks ? `<tr><td style="padding:6px 12px;font-weight:bold;color:#555">Opmerkingen / Remarks</td><td style="padding:6px 12px">${data.remarks}</td></tr>` : ""}
    </table>
  `;
}

function autoReplyHtml(data: RegistrationData): string {
  const isNl = data.locale === "nl";
  return isNl
    ? `
    <p>Hoi ${data.name},</p>
    <p>Bedankt voor je aanmelding bij U.S. Basketball Amsterdam! We hebben je gegevens ontvangen en nemen zo snel mogelijk contact met je op om te kijken of er een plek voor je is.</p>
    <p>Tot snel op de baan!</p>
    <p><strong>U.S. Basketball Amsterdam</strong><br/>If you can't beat US, join US!</p>
  `
    : `
    <p>Hi ${data.name},</p>
    <p>Thanks for your interest in U.S. Basketball Amsterdam! We've received your details and will get back to you as soon as possible to see if there's a spot for you.</p>
    <p>See you on the court!</p>
    <p><strong>U.S. Basketball Amsterdam</strong><br/>If you can't beat US, join US!</p>
  `;
}

export async function sendRegistrationEmails(
  data: RegistrationData,
): Promise<void> {
  await Promise.all([
    resend.emails.send({
      from: FROM,
      to: [TC_EMAIL],
      cc: SECRETARIS_EMAIL,
      subject: `Nieuwe aanmelding: ${data.name}`,
      html: boardNotificationHtml(data),
    }),
    resend.emails.send({
      from: FROM,
      to: data.email,
      subject:
        data.locale === "nl"
          ? "Aanmelding ontvangen — U.S. Basketball Amsterdam"
          : "Registration received — U.S. Basketball Amsterdam",
      html: autoReplyHtml(data),
    }),
  ]);
}
