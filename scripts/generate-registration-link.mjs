#!/usr/bin/env node

// Generates signed, expiring access links for the private registration page
// (/register). The token is a hex HMAC-SHA256 signature of the expiration
// timestamp, verified by proxy.ts against REGISTRATION_SECRET.
//
// Usage:
//   npm run generate:registration-link [hours]
//   REGISTRATION_SECRET=... node scripts/generate-registration-link.mjs 72

import { createHmac } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(rootDir, ".env.local") });
dotenv.config({ path: path.join(rootDir, ".env") });

const secret = process.env.REGISTRATION_SECRET;
if (!secret) {
  console.error("Error: REGISTRATION_SECRET is not set.");
  console.error(
    "Add it to .env.local or pass it inline:\n" +
      '  REGISTRATION_SECRET="<your-secret>" node scripts/generate-registration-link.mjs [hours]'
  );
  process.exit(1);
}

const hoursInput = Number.parseFloat(process.argv[2]);
const hoursValid = Number.isFinite(hoursInput) && hoursInput > 0 ? hoursInput : 48;

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.usbasketball.nl"
).replace(/\/+$/, "");

const expires = Math.floor(Date.now() / 1000) + Math.round(hoursValid * 3600);
const token = createHmac("sha256", secret).update(String(expires)).digest("hex");

console.log("\n=======================================================");
console.log(" US Basketball - Private Registration Link");
console.log("=======================================================");
console.log(`Valid duration : ${hoursValid} hours`);
console.log(`Expires at     : ${new Date(expires * 1000).toString()}`);
console.log("-------------------------------------------------------");
console.log("Generated link:\n");
console.log(`${siteUrl}/register?expires=${expires}&token=${token}`);
console.log("\n=======================================================\n");
