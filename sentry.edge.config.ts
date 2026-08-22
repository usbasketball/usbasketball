import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://d70dc81b3ef1c677c8a3016cea7f80fe@o4511898827161600.ingest.de.sentry.io/4511909338349648",

  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  enableLogs: true,
  integrations: [
    Sentry.consoleLoggingIntegration({
      levels: ["log", "warn", "error"],
    }),
  ],
});
