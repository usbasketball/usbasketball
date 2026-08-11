# US Basketball NL

Website for the US Basketball NL basketball club: public pages (home, about, training schedule, membership, privacy), a member signup form, and a private account page with password change. Fully localized in English and Dutch.

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| i18n | next-intl (locale routing, EN + NL) |
| Auth | Auth.js v5 (NextAuth) — email + password |
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

   Then fill in `.env` — at minimum `DATABASE_URL` and `AUTH_SECRET`. Generate a strong auth secret with:

   ```bash
   npx auth secret
   ```

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

## Project Structure

```
app/
  [locale]/
    (public)/          home, about, schedule, membership, privacy, signup, login
    (private)/me/      account page (requires login)
    layout.tsx         locale-aware root layout (Geist font, header, footer, JSON-LD)
    not-found.tsx
  api/auth/[...nextauth]/route.ts
  api/revalidate/route.ts   Contentful webhook → revalidate the schedule
  sitemap.ts, robots.ts, llms.txt
components/            header, footer, locale switcher, forms (signup/login/password), JSON-LD, schedule content
i18n/                  routing + request (locale detection)
lib/                   prisma client, contentful client + schedule fetch, server actions, site config, SEO helpers
messages/              en.json, nl.json
prisma/                schema.prisma
types/                 Auth.js module augmentation (Session type)
auth.ts, auth.config.ts
proxy.ts               next-intl middleware
next.config.ts         next-intl plugin (+ standalone output when not on Vercel)
```

## Deployment

The app is deployed to Vercel with native Git integration. No Docker setup is required.

## Contentful (training schedule)

The `/schedule` page shows the Wednesday and Friday training schedules, sourced from Contentful so the club can update them without code changes. UI labels are translated via `messages/`; Contentful only stores schedule data (single-language).

## Environment Variables

See `.env.example` for the full list: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_CONTACT_EMAIL`, `CONTENTFUL_*`.
