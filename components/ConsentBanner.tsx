"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  readAnalyticsConsentCookie,
  setAnalyticsConsentCookie,
  type AnalyticsConsent,
} from "@/components/analytics-consent";

export function ConsentBanner() {
  const t = useTranslations("Consent");
  const [decision, setDecision] = useState<AnalyticsConsent | null>(() => readAnalyticsConsentCookie());

  useEffect(() => {
    const handleConsentChange = () => {
      setDecision(readAnalyticsConsentCookie());
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

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 border border-slate-200 bg-white p-4 shadow-lg md:left-auto md:right-4 md:max-w-md">
      <p className="mb-3 text-sm text-slate-700">{t("message")}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => saveConsent("yes")}
          className="bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          {t("accept")}
        </button>
        <button
          type="button"
          onClick={() => saveConsent("no")}
          className="border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          {t("decline")}
        </button>
      </div>
    </div>
  );
}
