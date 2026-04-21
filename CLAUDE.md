# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with Turbopack
npm run build      # Production build with Turbopack
npm run lint       # ESLint + Prettier check
npm run lint:fix   # ESLint + Prettier auto-fix
npm run format     # Prettier write (format only, no lint)
npm run test:e2e          # Playwright E2E tests (headless, all devices)
npm run test:e2e:ui       # Playwright interactive UI mode
npm run test:e2e:headed   # Playwright headed mode (for debugging)
```

### Testing

Playwright E2E tests live in `tests/e2e/`. Three test files:

- `public-pages.spec.ts` — all 5 public pages × 2 locales render without error
- `auth-pages.spec.ts` — 4 auth-gated pages redirect to login when unauthenticated
- `navigation.spec.ts` — mobile hamburger open/close, desktop nav visibility

Tests run against 3 device projects: `desktop` (1280px), `tablet` (768px), `mobile` (375px).

Locally, `npm run test:e2e` starts `next dev` automatically via the `webServer` config. In CI, the workflow builds and starts `next start` separately before running tests.

CI runs on every push/PR to `main` via `.github/workflows/e2e.yml`. Requires three GitHub Actions secrets: `CI_AUTH0_SECRET`, `CI_AUTH0_CLIENT_SECRET`, `CI_GOOGLE_PRIVATE_KEY` (any placeholder values — no real auth is tested).

## Architecture

**U.S. Basketball Amsterdam** — club website built with Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS v4. Deployed on Vercel.

### Routing

All pages live under `src/app/[locale]/` with two locales: `nl` (default) and `en`. Middleware at `src/middleware.ts` handles locale detection/redirect via `Accept-Language` and delegates `/auth/*` routes to Auth0. Every page/layout exports `generateStaticParams()` for SSG across both locales.

### i18n

Lightweight, no third-party library. `src/lib/i18n/dictionaries.ts` holds static NL/EN strings used as fallbacks. Locale is passed as a prop from layouts down to server components. The `useLocale()` hook is available for client components.

### Content (Contentful)

Editable page content is fetched from Contentful at build time via `src/lib/contentful.ts`. All fetchers return `null` if `CONTENTFUL_SPACE_ID` / `CONTENTFUL_ACCESS_TOKEN` are missing, and pages fall back to the hardcoded data in the page file.

**To re-run the migration** (e.g. after a space reset): `npm run migrate:contentful`. Requires `CONTENTFUL_MANAGEMENT_TOKEN` in `.env.local` (management PAT from the space-owner account — not the delivery token).

### Authentication (Auth0)

`src/lib/auth0.ts` instantiates `Auth0Client` with a `beforeSessionSaved` hook that manually extracts a custom roles claim (`https://usbasketball.nl/roles`) from the raw ID token — the SDK strips non-standard claims by default. This claim is set by an Auth0 Post-Login Action.

Role helpers: `getUserRoles(session)` and `hasRole(session, role)`.

Login: `/auth/login?returnTo=/{locale}` | Logout: `/auth/logout`

The locale layout wraps children in `<Auth0Provider user={session?.user}>` so client components can call `useUser()`.

### Nav visibility system

Nav items are defined in `src/lib/constants.ts` with a `visibility` field: `"public"`, `"guest"`, `"authenticated"`, or `"role:<RoleName>"`. `isNavItemVisible()` gates rendering against the Auth0 session/roles.

### Data layer

No database or ORM. Registration form submissions go to a Google Sheet (`src/lib/google-sheets.ts`) via a GCP service account. The API route is `src/app/api/register/route.ts`.

### Email

`src/lib/resend.ts` sends two emails on registration: a board notification and a registrant auto-reply. From-address is always `noreply@usbasketball.nl`.

### Styling

Tailwind CSS v4 using the PostCSS plugin (`@tailwindcss/postcss`) — no `tailwind.config.js`. CSS is in `src/app/globals.css`.

## Required Environment Variables

```
AUTH0_SECRET
AUTH0_BASE_URL
AUTH0_ISSUER_BASE_URL
AUTH0_CLIENT_ID
AUTH0_CLIENT_SECRET
GOOGLE_SHEET_ID
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY                  # escape \n in the key
RESEND_API_KEY
NEXT_PUBLIC_RECAPTCHA_SITE_KEY
RECAPTCHA_SECRET_KEY
CONTENTFUL_SPACE_ID
CONTENTFUL_DELIVERY_ACCESS_TOKEN    # used for one-time migration only
SENTRY_DSN
NEXT_PUBLIC_SENTRY_DSN              # same value as SENTRY_DSN, exposed to client bundle
SENTRY_AUTH_TOKEN                   # for source map upload during build; needs project:releases + org:read scopes
```
