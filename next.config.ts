import type { NextConfig } from "next";
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
        source: "/:locale(en|nl)/informatie",
        destination: "/:locale/membership",
        permanent: true,
      },
      {
        source: "/:locale(en|nl)/aanmeldformulier",
        destination: "/:locale/signup",
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
