# Basketball Club Website — Build Plan

## 1. Goals & Scope

**Public (no login):**
- Home — club intro, latest news highlights, signup CTA
- About / History — club history + intro to teams
- Membership — fees, registration & deregistration terms/rules
- Privacy — privacy policy (text-heavy page)
- Signup form — register as member
- Login page

**Private (behind login):** `/me` account page — shows the member's first & last name, email, and lets them change their password.

**i18n:** EN + NL with hreflang, language toggle, localized URLs (`/en/...`, `/nl/...`).

## 2. Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| i18n | next-intl (locale routing + translations) |
| Auth | Auth0 (`@auth0/nextjs-auth0`) — Universal Login |
| DB | PostgreSQL on Neon (free tier) + Prisma ORM |
| Email | Resend (optional: welcome/notification emails) |
| Analytics | GA4 (via `@next/third-parties`) + `@vercel/analytics` (Core Web Vitals) |
| Consent | Lightweight GDPR cookie banner before GA4 loads |
| Deploy | Vercel (native Git integration) |

**Why Postgres/Prisma over SQLite:** signups become member accounts you'll grow over time; Postgres scales, and Prisma keeps the option of a self-managed DB later easy.

## 3. Content Architecture

```
/                    → home
/about               → history, club facts
/schedule            → training schedule (Contentful: Wednesday + Friday tables)
/teams               → team introductions
/membership          → fees + registration/deregistration rules
/privacy             → privacy policy (text-heavy)
/signup              → registration form
/login               → sign in
/me                  → private account page (sign in required): profile from the Auth0 session
```

## 4. Data Model (Prisma)

- **InterestSubmission** — interest-form submissions (`id, name, email, birthDate, position, interest, gender, lastLevel?, lastSeason?, background?, locale, createdAt`).
- **Auth:** member identities live in Auth0; the app keeps no user table. The former `User` model (email + bcrypt password) was removed when auth moved to Auth0 Universal Login. `/me` shows profile data from the Auth0 session (name, email).

## 5. SEO & GEO Strategy

**Technical SEO**
- Meta/OG tags, canonical URLs, `sitemap.ts` + `robots.ts`, hreflang for EN/NL
- Fast Core Web Vitals: SSR, `next/image`, font optimization
- Google Search Console + Bing Webmaster verification, sitemap submission

**Structured data (JSON-LD)** — the core of GEO:
- `SportsOrganization` / `SportsClub` + `SportsTeam` entities with founding date, city, location
- `WebSite`, `FAQPage` (membership rules as FAQ), `Event` if you add events
- Consistent club name/address across pages + external listings

**Generative Engine Optimization (GEO)** — getting the site cited by AI search (ChatGPT Search, Perplexity, AI Overviews):
- `llms.txt` file describing the club so AI engines can reference it accurately
- Authoritative, factual content (founded year, fees, location, contact)
- FAQ schema answers phrased so AI assistants can quote them

**GEO tracking** — critical since AI engines don't look like normal traffic:
- GA4 custom channel/segments for referrals from `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `claude.ai`, `copilot.microsoft.com`, plus AI Overviews clicks
- Report on which AI sources send members (a "GEO sources" dashboard)

## 6. Tracking Plan (GA4)

- Pageviews, signup funnel (`signup_started` → `signup_completed`), successful logins, logout
- Core Web Vitals via Vercel Analytics
- GDPR cookie consent gate before GA4 loads (Dutch/EU requirement)

## 7. Project Structure

```
app/
  [locale]/
    (public)/ home, about, teams, membership, privacy, signup, login
    (private)/me/
  sitemap.ts, robots.ts, llms.txt
components/  lib/  prisma/  i18n/  public/
next.config.ts
```

## 8. Milestones

1. **Setup** — Next.js + TS + Tailwind + i18n scaffold, Prisma + Neon wired up
2. **Public pages** — content + design, SEO basics, structured data, llms.txt
3. **Signup + Auth** — form → DB, Auth0 login/logout (Universal Login), `/me` account page
4. **Tracking** — GA4, Vercel Analytics, consent banner, GEO referral monitoring
5. **Launch** — deploy to Vercel, connect Search Console, verify GEO signals
