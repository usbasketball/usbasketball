"use client";

import { useTranslations } from "next-intl";
import { useConsent } from "@/components/consent-provider";

export function ConsentSettingsButton({ className }: { className?: string }) {
  const t = useTranslations("Consent");
  const { openSettings } = useConsent();

  return (
    <button type="button" onClick={openSettings} className={className}>
      {t("settings")}
    </button>
  );
}
