<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project: US Basketball Amsterdam

Next.js 16 (App Router) + TypeScript + Tailwind v4, next-intl (EN/NL), Auth0 (`@auth0/nextjs-auth0`), Prisma 8 (contracts) + PostgreSQL (`@prisma/orm-postgres`), Contentful (CMS).

## Verification

After any change, run both:

```bash
npm run lint
npm run typecheck
```

When you touch code that has tests (`*.test.ts(x)` next to the source, Playwright specs in `e2e/`), also run `npm run test`. CI runs typecheck, unit tests and Playwright, but not lint.

`ARCHITECTURE.md` describes how the app is structured.

## Conventions

- Use the `@/` alias (maps to repo root, e.g. `@/lib/prisma`).
- **i18n:** All pages live under `app/[locale]/` (`(public)/` and `(private)/` route groups). Strings go in `messages/{en,nl}.json`; read them with `getTranslations`/`getFormatter` from `next-intl/server`. Locale-aware navigation (links, redirects) must go through `@/i18n/navigation` (`Link`, `redirect`), never `next/navigation`.
- **Auth:** Auth0 via `@auth0/nextjs-auth0` v4, singleton in `lib/auth.ts`. The `/auth/*` routes are intercepted by `auth0.middleware()` in `proxy.ts` — there are no auth route handlers. Read the session server-side with `auth0.getSession()`. Login/logout links must be plain `<a>` tags pointing at `/auth/login` / `/auth/logout`, never next-intl `Link`. `/me`, `/tasks` and `/alv` are the protected pages. Each protected page checks the session itself (`authEnabled() ? await auth0.getSession() : null`) and redirects to `/login`; there is no central guard, so a new private page must repeat the check. Auth must stay unset-safe like Contentful (`authEnabled()` in `lib/auth.ts`).
- **Redirects & type narrowing:** Always use `return redirect({ href: "...", locale })` (not a bare `redirect(...)` call) — bare calls do not narrow types in this project's build.
- **Prisma:** Uses experimental Prisma 8 contracts (`prisma/contract.prisma`). Contract artifacts are emitted into `prisma/contract.json` and `prisma/contract.d.ts`. After editing `prisma/contract.prisma` run `npm run db:generate` (`prisma contract emit`). Use the database singleton exported as `db` in `@/lib/prisma` (configured via `@prisma/orm-postgres`); never instantiate your own client.
- **Server actions** live in `lib/actions/` and return `{ error?: string } | { success: true }` state for use with `useActionState`. Error values are keys under the form's `errors` namespace in `messages/`.
- **Contentful:** All Contentful reads go through the guarded client in `lib/contentful.ts` and are wrapped in `unstable_cache` with a tag and no expiry: the training schedule (`/schedule`, `lib/schedule.ts`, tag `training-schedule`), the upcoming ALV documents (`/alv`, content type `alvDocumenten`, `lib/alv-documents.ts`, tag `alv-documents`), the ALV notes (`/alv`, content type `meetingNote`, `lib/alv-notes.ts`, tag `alv-notes`) and the task roster PDF (`/tasks`, content type `takenschemaPdf`, `lib/tasks-pdf.ts`, tag `tasks-pdf`). The webhook route `app/api/revalidate/route.ts` revalidates all four on publish; a new fetcher must export its tag and be added there. Contentful keys must stay unset-safe so builds never crash without them.
- **Payload CMS (setup, not yet read by the site):** Payload is embedded at `/admin` (config in `payload.config.ts`, collections/globals in `payload/`, routes in `app/(payload)/`). Editors sign in with Auth0; only emails in `PAYLOAD_ADMIN_EMAILS` get in, and an email must be verified (`payload/auth0-strategy.ts`); the admin logout button goes to `/auth/logout`. Payload keeps its tables in the `payload` Postgres schema (Prisma owns `public`); give any collection that could collide with a Prisma table a `dbName` (as `users` → `cms_users`). Migrations live in `payload/migrations/` and are applied automatically on first init in production (`prodMigrations`; `push` is dev-only). **Generate migrations with `BLOB_READ_WRITE_TOKEN` set** (any `vercel_blob_rw_<store>_<secret>`-shaped value): the Blob plugin only adds its `_objectKey` column to `media` when enabled, so a migration generated without the token breaks every media query in production. The `payload` CLI crashes under `tsx` (undici) here, so generate types, the import map and migrations programmatically from a throwaway route handler rather than `npm run payload:*`. `POST /api/import-contentful` is a temporary, editor-only import (dry run by default) to remove after cutover. Cache tags for CMS reads are in `lib/cms-tags.ts`; the `afterChange` hooks revalidate them.
- The app is deployed to Vercel (native Git integration); no Docker artifacts are kept in the repo.
