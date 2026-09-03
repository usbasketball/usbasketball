"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";
import { hasAnalyticsConsent } from "@/components/analytics-consent";

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

  if (!enabled) {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
