import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : "standalone",
  async redirects() {
    return [
      {
        source: "/informatie",
        destination: "/membership",
        permanent: true,
      },
      {
        source: "/aanmeldformulier",
        destination: "/signup",
        permanent: true,
      },
      { 
        source: "/takenschema",
        destination: "/tasks",
        permanent: true 
      },
      {
        source: "/:locale(en|nl)/informatie",
        destination: "/:locale/membership",
        permanent: true,
      },
      {
        source: "/:locale(en|nl)/aanmeldformulier",
        destination: "/:locale/signup",
        permanent: true,
      },
      {
        source: "/:locale(en|nl)/takenschema",
        destination: "/:locale/tasks",
        permanent: true,
      },
      {
        source: "/vertrouwenspersoon",
        destination: "/confidential-counsellor",
        permanent: true,
      },
      {
        source: "/:locale(en|nl)/vertrouwenspersoon",
        destination: "/:locale/confidential-counsellor",
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withSentryConfig(withNextIntl(nextConfig), {
  org: "usbasketball",
  project: "usbasketballnl",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  tunnelRoute: "/sentry-tunnel",
  silent: !process.env.CI,
});
