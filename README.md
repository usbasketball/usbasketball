# US Basketball NL

Website for the US Basketball NL basketball club: public pages (home, about, training schedule, membership, privacy), a member signup form, and a private account page. Fully localized in English and Dutch.

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| i18n | next-intl (locale routing, EN + NL) |
| Auth | Auth0 (`@auth0/nextjs-auth0`) — Universal Login |
| DB | PostgreSQL + Prisma ORM (client generated into `lib/generated`) |
| CMS | Contentful (training schedule content) |
| Deploy | Vercel (native Git integration) |

## Getting Started

Prerequisites: Node.js 20+ and access to a PostgreSQL database (e.g. Neon).

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

   Then fill in `.env` — at minimum `DATABASE_URL` and the `AUTH0_*` variables. Generate the session-encryption secret with:

   ```bash
   openssl rand -hex 32
   ```

   In your Auth0 dashboard, create a **Regular Web Application** and register `<APP_BASE_URL>/auth/callback` under Allowed Callback URLs, plus `<APP_BASE_URL>` (and the locale variants `/en`, `/nl` used as logout return paths) under Allowed Logout URLs.

3. Generate the Prisma client and set up the database:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000). The app is available under both `/en` and `/nl`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check the project (`tsc --noEmit`) |
| `npm run db:generate` | Generate the Prisma client into `lib/generated/prisma` |
| `npm run db:migrate` | Create/apply a development migration |
| `npm run db:deploy` | Apply pending migrations (production) |
| `npm run db:studio` | Open Prisma Studio |
| `npm run generate:registration-link` | Generate a signed, expiring link for the private `/register` page |

## Project Structure

```
app/
  [locale]/
    (public)/          home, about, schedule, membership, privacy, signup, login
    (private)/me/      account page (requires login)
    layout.tsx         locale-aware root layout (Geist font, header, footer, JSON-LD)
    not-found.tsx
  api/revalidate/route.ts   Contentful webhook → revalidate the schedule
  sitemap.ts, robots.ts, llms.txt
components/            header, footer, locale switcher, forms (signup), JSON-LD, schedule content
i18n/                  routing + request (locale detection)
lib/                   auth0 client, prisma client, contentful client + schedule fetch, server actions, site config, SEO helpers
messages/              en.json, nl.json
prisma/                schema.prisma
scripts/               generate-registration-link.mjs (signed /register links)
proxy.ts               Auth0 middleware (/auth/*) + next-intl middleware
next.config.ts         next-intl plugin (+ standalone output when not on Vercel)
```

## Deployment

The app is deployed to Vercel with native Git integration. No Docker setup is required.

## Authentication (Auth0)

Login is handled by Auth0 Universal Login via `@auth0/nextjs-auth0`. The `/auth/login`, `/auth/logout` and `/auth/callback` routes are intercepted by the Auth0 middleware in `proxy.ts`; there are no auth route handlers. Server code reads the session with `auth0.getSession()` from the singleton in `lib/auth.ts`. Login and logout links must be plain `<a>` tags (not next-intl `Link`) so they navigate as full-page redirects.

The only protected page is `/me`, which redirects to `/login` when no session exists. The login page is a gateway that starts the Auth0 flow with a locale-aware `returnTo`.

## Private registration page (/register)

The `/register` page is gated by expiring signed links. `proxy.ts` verifies the `expires`/`token` query parameters with `lib/registration-link.ts`: the token must be a hex HMAC-SHA256 signature of the `expires` timestamp under `REGISTRATION_SECRET`, and the timestamp must not have passed.

Generate a link (defaults to 72 hours when hours is omitted):

```bash
npm run generate:registration-link -- 72
```

To point the link at a Vercel preview deployment instead of production (`NEXT_PUBLIC_SITE_URL`):

```bash
NEXT_PUBLIC_SITE_URL="https://<preview-url>.vercel.app" npm run generate:registration-link -- 72
```

The script reads `REGISTRATION_SECRET` from `.env.local`; set it there and in Vercel env vars for deployed environments. Treat generated links as bearer tokens — anyone who has one can register until it expires.

In opencode, the `register-link` skill (`.agents/skills/register-link/`) walks an agent through resolving the right environment and generating the link; skills are registered via `.opencode/opencode.json`.

## Contentful (training schedule)

The `/schedule` page shows the Wednesday and Friday training schedules, sourced from Contentful so the club can update them without code changes. UI labels are translated via `messages/`; Contentful only stores schedule data (single-language).

## Environment Variables

See `.env.example` for the full list: `DATABASE_URL`, `AUTH0_*`, `APP_BASE_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_CONTACT_EMAIL`, `CONTENTFUL_*`.
