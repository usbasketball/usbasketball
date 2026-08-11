<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project: US Basketball NL

Next.js 16 (App Router) + TypeScript + Tailwind v4, next-intl (EN/NL), Auth.js v5, Prisma 7 + PostgreSQL, Contentful (CMS).

## Verification

After any change, run both:

```bash
npm run lint
npm run typecheck
```

## Conventions

- Use the `@/` alias (maps to repo root, e.g. `@/lib/prisma`).
- **i18n:** All pages live under `app/[locale]/` (`(public)/` and `(private)/` route groups). Strings go in `messages/{en,nl}.json`; read them with `getTranslations`/`getFormatter` from `next-intl/server`. Locale-aware navigation (links, redirects) must go through `@/i18n/navigation` (`Link`, `redirect`), never `next/navigation`.
- **Auth:** Auth.js v5 in `auth.ts` / `auth.config.ts`. `Session` is augmented in `types/next-auth.d.ts` with a required `user.id`. Get the session via `@/auth`'s `auth()`.
- **Redirects & type narrowing:** Always use `return redirect({ href: "...", locale })` (not a bare `redirect(...)` call) — bare calls do not narrow types in this project's build.
- **Prisma:** The client is generated into `lib/generated/prisma` (not `node_modules`). After editing `prisma/schema.prisma` run `npm run db:generate`. Use the singleton in `@/lib/prisma` (PrismaPg adapter); never instantiate your own client.
- **Server actions** live in `lib/actions/` and return `{ error?: string } | { success: true }` state for use with `useActionState`.
- **Contentful:** The training schedule (`/schedule`) is fetched in `lib/schedule.ts` via the guarded client in `lib/contentful.ts`, wrapped in `unstable_cache` tagged `training-schedule`. The webhook route `app/api/revalidate/route.ts` revalidates it on publish. Contentful keys must stay unset-safe so builds never crash without them.
- The app is deployed to Vercel (native Git integration); no Docker artifacts are kept in the repo.
