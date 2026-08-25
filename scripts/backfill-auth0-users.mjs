#!/usr/bin/env node

// Backfill Auth0 users from Foys member data.
//
// Fetches active members from the Foys API, saves them to members.json,
// then creates or updates each user in Auth0 (matching by email).
//
// Auth0 users are created with:
//   - name:          member.fullName
//   - email:         member.email
//   - app_metadata:  { nbb_number: member.federationMembershipIdentifier }
//
// Usage:
//   npm run backfill:auth0-users               # dry run (default)
//   npm run backfill:auth0-users -- --live     # actually create/update users
//
// Required env vars (in .env.local):
//   AUTH0_DOMAIN              e.g. usbasketball.eu.auth0.com
//   AUTH0_M2M_CLIENT_ID       M2M app client ID (needs Management API access)
//   AUTH0_M2M_CLIENT_SECRET   M2M app client secret
//   FOYS_API_KEY              Foys bearer token

import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const dryRun = !process.argv.includes("--live");

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(rootDir, ".env.local") });
dotenv.config({ path: path.join(rootDir, ".env") });

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_M2M_CLIENT_ID = process.env.AUTH0_M2M_CLIENT_ID;
const AUTH0_M2M_CLIENT_SECRET = process.env.AUTH0_M2M_CLIENT_SECRET;
const FOYS_API_KEY = process.env.FOYS_API_KEY;

if (!AUTH0_DOMAIN || !AUTH0_M2M_CLIENT_ID || !AUTH0_M2M_CLIENT_SECRET) {
  console.error("Missing AUTH0_DOMAIN, AUTH0_M2M_CLIENT_ID, or AUTH0_M2M_CLIENT_SECRET env vars.");
  process.exit(1);
}

if (!FOYS_API_KEY) {
  console.error("Missing FOYS_API_KEY env var.");
  process.exit(1);
}

const FOYS_API = "https://api.foys.io/foys/api/v1/management/people";
const PAGE_SIZE = 100;

async function fetchAllFoysMembers() {
  const allMembers = [];
  let skip = 0;
  let totalCount = Infinity;

  while (skip < totalCount) {
    const url = new URL(FOYS_API);
    url.searchParams.set("sorting", "lastName asc");
    url.searchParams.set("hasActiveMembership", "true");
    url.searchParams.set("skipActiveMembershipCheck", "false");
    url.searchParams.set("isUpForReview", "false");
    url.searchParams.set("skipCount", "0");
    url.searchParams.set("maxResultCount", String(PAGE_SIZE));
    url.searchParams.set("quickSearch.isWhere", "true");
    url.searchParams.set("skip", String(skip));

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${FOYS_API_KEY}`,
        "X-Cluster": "cluster-default",
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Foys API ${res.status}: ${body}`);
    }

    const data = await res.json();
    totalCount = data.totalCount;
    allMembers.push(...data.items);
    skip += PAGE_SIZE;
    console.log(`  Fetched ${allMembers.length}/${totalCount} members...`);
  }

  return { totalCount, items: allMembers };
}

const AUTH0_API = `https://${AUTH0_DOMAIN}/api/v2`;

let accessToken;

async function getToken() {
  const res = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: AUTH0_M2M_CLIENT_ID,
      client_secret: AUTH0_M2M_CLIENT_SECRET,
      audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      grant_type: "client_credentials",
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Auth0 token request failed (${res.status}): ${body}`);
  }
  const data = await res.json();
  return data.access_token;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mgmtFetch(path, options = {}, retries = 3) {
  if (!accessToken) accessToken = await getToken();

  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(`${AUTH0_API}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (res.status === 429) {
      const retryAfter = Number(res.headers.get("retry-after") || "2");
      console.log(`  Rate limited, waiting ${retryAfter}s...`);
      await sleep(retryAfter * 1000);
      continue;
    }

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`${res.status} ${path}: ${body}`);
    }
    if (res.status === 204) return null;
    return res.json();
  }
  throw new Error(`Too many retries for ${path}`);
}

async function main() {
  if (dryRun) {
    console.log("=== DRY RUN (no Auth0 changes) ===\n");
  }

  console.log("Fetching members from Foys API...");
  const { totalCount, items } = await fetchAllFoysMembers();
  console.log(`Fetched ${items.length} members from Foys.\n`);

  const outPath = path.join(rootDir, "members.json");
  writeFileSync(outPath, JSON.stringify({ totalCount, items }, null, 2));
  console.log(`Saved to ${outPath}\n`);

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const member of items) {
    const email = member.email;
    if (!email) {
      console.warn(`Skipping member without email: ${member.fullName}`);
      skipped++;
      continue;
    }

    const nbbNumber = member.federationMembershipIdentifier;

    // Small delay to stay under Auth0 rate limits
    await sleep(100);

    const payload = {
      name: member.fullName,
      email,
      app_metadata: {
        nbb_number: nbbNumber,
      },
    };

    try {
      const existingUsers = await mgmtFetch(
        `/users?q=email:${encodeURIComponent(`"${email}"`)}&search_engine=v3`
      );

      if (existingUsers.length > 0) {
        if (dryRun) {
          console.log(`Would update: ${member.fullName} (${email}) — nbb_number: ${nbbNumber}`);
          continue;
        }

        await mgmtFetch(`/users/${existingUsers[0].user_id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        console.log(`Updated: ${member.fullName} (${email})`);
        updated++;
      } else {
        if (dryRun) {
          console.log(`Would create: ${member.fullName} (${email}) — nbb_number: ${nbbNumber}`);
          continue;
        }

        await mgmtFetch("/users", {
          method: "POST",
          body: JSON.stringify({
            ...payload,
            connection: "Username-Password-Authentication",
            password: crypto.randomUUID(),
          }),
        });
        console.log(`Created: ${member.fullName} (${email})`);
        created++;
      }
    } catch (err) {
      console.error(`Error for ${member.fullName} (${email}): ${err.message}`);
      errors++;
    }
  }

  console.log(
    `\nDone. Created: ${created}, Updated: ${updated}, Skipped: ${skipped}, Errors: ${errors}`
  );
}

main();
