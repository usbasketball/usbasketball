"use client";

import { useEffect, useState } from "react";
import { ConsentBannerContent } from "@/components/ConsentBannerContent";
import {
  readAnalyticsConsentCookie,
  setAnalyticsConsentCookie,
  type AnalyticsConsent,
} from "@/components/analytics-consent";

export function ConsentBanner() {
  const [decision, setDecision] = useState<AnalyticsConsent | null>(null);

  useEffect(() => {
    const syncDecision = () => {
      setDecision(readAnalyticsConsentCookie());
    };

    syncDecision();

    const handleConsentChange = () => {
      syncDecision();
    };

    window.addEventListener("analytics-consent-changed", handleConsentChange);

    return () => {
      window.removeEventListener("analytics-consent-changed", handleConsentChange);
    };
  }, []);

  const saveConsent = (value: AnalyticsConsent) => {
    setAnalyticsConsentCookie(value);
    setDecision(value);
    window.dispatchEvent(new Event("analytics-consent-changed"));
  };

  if (decision === "yes" || decision === "no") {
    return null;
  }

  return <ConsentBannerContent onSave={saveConsent} />;
}
