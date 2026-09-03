"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { hasAnalyticsConsent } from "@/components/analytics-consent";

const UMAMI_SCRIPT_URL =
  process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? "https://cloud.umami.is/script.js";

export function AnalyticsGate() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const update = () => {
      setEnabled(process.env.NODE_ENV === "production" && hasAnalyticsConsent());
    };

    update();
    window.addEventListener("analytics-consent-changed", update);

    return () => {
      window.removeEventListener("analytics-consent-changed", update);
    };
  }, []);

  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  if (!enabled || !websiteId) {
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
