import * as Sentry from "@sentry/nextjs";
import { hasConsentInBrowser } from "@/lib/consent-client";

Sentry.init({
  dsn: "https://d70dc81b3ef1c677c8a3016cea7f80fe@o4511898827161600.ingest.de.sentry.io/4511909338349648",

  // Error reporting stays on. Performance tracing and forwarded console logs
  // are analytics-like, so they are dropped unless the visitor opted in. Both
  // callbacks read the cookie at call time, so a choice made after init applies.
  tracesSampler: () =>
    hasConsentInBrowser("analytics")
      ? process.env.NODE_ENV === "development"
        ? 1.0
        : 0.1
      : 0,

  enableLogs: true,
  beforeSendLog: (log) => (hasConsentInBrowser("analytics") ? log : null),
  integrations: [
    Sentry.consoleLoggingIntegration({
      levels: ["log", "warn", "error"],
    }),
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
