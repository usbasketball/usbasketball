# US Basketball Amsterdam

Website for the US Basketball Amsterdam basketball club ([usbasketball.nl](https://usbasketball.nl/)): public pages (home, about, training schedule, membership, committees, FAQ, learning, confidential counsellor, privacy), an interest form for prospective members, a link-gated registration page, and member-only pages behind login. Fully localized in English and Dutch.

## Documentation

| Document | Contents |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | How the app is structured: layers, request lifecycle, integrations, conventions |
| [docs/CRITICAL_PATHS.md](docs/CRITICAL_PATHS.md) | The code paths that matter most: dependencies, failure modes, known issues, test coverage |
| [docs/FIX_PLAN.md](docs/FIX_PLAN.md) | Planned fixes for the known issues, grouped into pull requests |
| [AGENTS.md](AGENTS.md) | Working conventions for contributors and coding agents |

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| i18n | next-intl (locale routing, EN + NL, default NL) |
| Auth | Auth0 (`@auth0/nextjs-auth0` v4), Universal Login |
| DB | PostgreSQL + Prisma 8 contracts (`@prisma/orm-postgres`) |
| CMS | Contentful (training schedule, ALV documents and notes, task roster PDF) |
| Email | Resend (interest form confirmation and notification) |
| Bot protection | Cloudflare Turnstile (interest form) |
| Monitoring | Sentry (errors, traces, logs; EU region) |
| Analytics | Umami, loaded only after cookie consent |
| Deploy | Vercel (native Git integration) |

## Getting Started

Prerequisites: Node.js 22 (the version CI uses) and, for the interest form, access to a PostgreSQL database (e.g. Neon).

1. Install dependencies. The `postinstall` script runs `prisma contract emit`, which generates `prisma/contract.json` and `prisma/contract.d.ts` (both git-ignored).

   ```bash
   npm install
   ```

2. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

   Every integration is optional locally: without Auth0, Contentful, Turnstile or database settings the app still builds and serves the public pages, and the affected features show an empty or unavailable state. To use login, fill in the `AUTH0_*` variables and generate the session secret with:

   ```bash
   openssl rand -hex 32
   ```

   In your Auth0 dashboard, create a **Regular Web Application** and register `<APP_BASE_URL>/auth/callback` under Allowed Callback URLs, plus `<APP_BASE_URL>` (and the locale variants `/en`, `/nl` used as logout return paths) under Allowed Logout URLs.

3. Start the development server:

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
| `npm run test` | Run unit tests (Vitest, `*.test.ts(x)`) |
| `npm run test:e2e` | Run Playwright end-to-end tests (`e2e/`, starts its own server on port 3100) |
| `npm run db:generate` | Emit the Prisma contract artifacts (`prisma contract emit`) |

CI (`.github/workflows/e2e.yml`) runs typecheck, unit tests and the Playwright suite on every pull request; a second workflow scans for secrets with gitleaks.

## Project Structure

```
app/
  [locale]/
    (public)/          home, about, committees, confidential-counsellor, faq, learning,
                       login, membership, privacy, register, schedule, signup
    (private)/         me, tasks, alv (each page checks the Auth0 session)
    [...rest]/         catch-all that renders the localized 404
    layout.tsx         locale-aware root layout (Inter + Bebas Neue, header, footer,
                       consent banner, JSON-LD, analytics gate)
  api/revalidate/      Contentful webhook: revalidates all Contentful cache tags
  llms.txt/            plain-text club summary for AI crawlers
  sitemap.ts, robots.ts, global-error.tsx
components/            navigation, footer, interest form, Turnstile widget, Foys registration
                       iframe, consent banner + analytics gate, JSON-LD, schedule renderer
i18n/                  routing, request config (locale validation), navigation helpers
lib/
  actions/interest.ts  server action behind the interest form
  auth.ts              Auth0 client singleton + authEnabled()
  prisma.ts            database singleton (`db`)
  contentful.ts        guarded Contentful client
  schedule.ts, alv-documents.ts, alv-notes.ts, tasks-pdf.ts   cached Contentful fetchers
  email.ts             Resend emails for the interest form
  registration-link.ts HMAC verification for /register links
  site.ts, seo.ts      site config, JSON-LD and metadata helpers
messages/              en.json, nl.json
prisma/                contract.prisma (schema)
e2e/                   Playwright specs
proxy.ts               Auth0 middleware (/auth/*) merged with next-intl middleware
next.config.ts         next-intl + Sentry plugins, legacy URL redirects
instrumentation*.ts, sentry.*.config.ts   Sentry setup
```

## Deployment

The app is deployed to Vercel with native Git integration. No Docker setup is required. Set the variables from `.env.example` in the Vercel project; `SENTRY_AUTH_TOKEN` enables source-map upload during the build.

## Authentication (Auth0)

Login is handled by Auth0 Universal Login via `@auth0/nextjs-auth0`. The `/auth/login`, `/auth/logout` and `/auth/callback` routes are intercepted by the Auth0 middleware in `proxy.ts`; there are no auth route handlers. Server code reads the session with `auth0.getSession()` from the singleton in `lib/auth.ts`. Login and logout links must be plain `<a>` tags (not next-intl `Link`) so they navigate as full-page redirects.

The protected pages are `/me` (profile), `/tasks` (task roster PDF) and `/alv` (general meeting documents and notes). Each one checks the session itself and redirects to `/login` when there is none; a new private page must do the same. The login page is a gateway that starts the Auth0 flow with a locale-aware `returnTo`. When the `AUTH0_*` variables are unset, `/auth/*` responds with 503 and the rest of the site keeps working.

## Interest form (/signup)

The form posts to the `submitInterest` server action (`lib/actions/interest.ts`), which validates the input (applicants must be 18+), verifies the Cloudflare Turnstile token, stores the submission in the `interest_submissions` table, and sends a confirmation to the applicant and a notification to the technical committee via Resend. Email failures are reported to Sentry and do not fail the submission.

Turnstile verification is skipped when `TURNSTILE_SECRET` is unset, so make sure it is set in production together with `TURNSTILE_HOSTNAMES`.

## Private registration page (/register)

The `/register` page is gated by expiring signed links. It verifies the `expires`/`token` query parameters with `lib/registration-link.ts`: the token must be a hex HMAC-SHA256 signature of the `expires` timestamp under `REGISTRATION_SECRET`, and the timestamp must not have passed. A valid link renders the Foys registration form (`FOYS_REGISTRATION_FORM_NL_ID` / `FOYS_REGISTRATION_FORM_EN_ID`) inside a sandboxed iframe.

The link generator (an HMAC-SHA256 signing script) lives in the [usbasketball/bestuur](https://github.com/usbasketball/bestuur) repo/service. `REGISTRATION_SECRET` must match on both sides; set it in Vercel env vars for deployed environments. Treat generated links as bearer tokens — anyone who has one can register until it expires.

## Contentful

Contentful holds the content the club updates without code changes:

| Content | Content type | Page |
|---|---|---|
| Wednesday and Friday training schedules | `trainingSchedules` | `/schedule` |
| Documents for the upcoming ALV | `alvDocumenten` | `/alv` |
| ALV notes archive | `meetingNote` | `/alv` |
| Task roster PDF | `takenschemaPdf` | `/tasks` |

UI labels are translated via `messages/`; Contentful content is single-language. Results are cached with no expiry and refreshed only by the webhook: configure a Contentful webhook on publish events that POSTs to `<SITE_URL>/api/revalidate` with `CONTENTFUL_WEBHOOK_SECRET` in the `x-webhook-secret` header.

## Database

The schema is defined in `prisma/contract.prisma` (experimental Prisma 8 contracts). After editing it, run `npm run db:generate`. Application code uses the `db` singleton from `@/lib/prisma`. This app currently only writes `InterestSubmission`.

## Environment Variables

See `.env.example` for the full, commented list. In short:

| Group | Variables |
|---|---|
| Database | `DATABASE_URL` |
| Auth0 | `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_SECRET`, `APP_BASE_URL` |
| Site | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_SECRETARIAT_EMAIL`, `NEXT_PUBLIC_TC_EMAIL` |
| Contentful | `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ENVIRONMENT`, `CONTENTFUL_ACCESS_TOKEN`, `CONTENTFUL_WEBHOOK_SECRET` |
| Email | `RESEND_API_KEY`, `EMAIL_FROM` |
| Turnstile | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET`, `TURNSTILE_HOSTNAMES` |
| Registration | `REGISTRATION_SECRET`, `FOYS_REGISTRATION_FORM_NL_ID`, `FOYS_REGISTRATION_FORM_EN_ID` |
| Analytics and consent | `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_SCRIPT_URL`, `NEXT_PUBLIC_COOKIE_DOMAIN` |
| Sentry | `SENTRY_AUTH_TOKEN` |

`NEXT_PUBLIC_SITE_URL` must be set in production: canonical URLs, the sitemap and structured data fall back to `http://localhost:3000` without it.
