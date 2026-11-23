"use client";

import Script from "next/script";
import { useConsent } from "@/components/consent-provider";

const UMAMI_SCRIPT_URL =
  process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? "https://cloud.umami.is/script.js";

/**
 * Renders the Umami script only after an explicit analytics opt-in. Consent
 * comes from the server-seeded provider, so returning visitors get the script
 * in the first HTML and everyone else gets nothing.
 */
export function AnalyticsGate() {
  const { has } = useConsent();
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  if (process.env.NODE_ENV !== "production" || !websiteId || !has("analytics")) {
    return null;
  }

  return (
    <Script
      async
      defer
      strategy="afterInteractive"
      src={UMAMI_SCRIPT_URL}
      data-website-id={websiteId}
      data-do-not-track="true"
    />
  );
}
