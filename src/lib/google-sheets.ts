import {google} from "googleapis";
import type {RegistrationData} from "./resend";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Aanmeldingen";

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function appendRegistration(data: RegistrationData): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({version: "v4", auth});

  const timestamp = new Date().toISOString();
  const row = [
    timestamp,
    data.name,
    data.birthDate,
    data.email,
    data.gender,
    data.lastLevel,
    data.lastSeason,
    data.position,
    data.interest,
    data.remarks,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A:J`,
    valueInputOption: "RAW",
    requestBody: {values: [row]},
  });
}
