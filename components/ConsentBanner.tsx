"use client";

import { useTranslations } from "next-intl";
import { useConsent } from "@/components/consent-provider";

/**
 * Rendered on the server for visitors without a stored choice, and hidden in
 * the same HTML for everyone else, because the provider is seeded from the
 * request cookie. The footer link reopens it so consent can be changed or
 * withdrawn as easily as it was given.
 */
export function ConsentBanner() {
  const t = useTranslations("Consent");
  const { consent, has, save, settingsOpen, closeSettings } = useConsent();

  if (consent !== null && !settingsOpen) return null;

  const buttonClass =
    "border border-slate-900 px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100";

  return (
    <div
      role="region"
      aria-label={t("title")}
      className="fixed inset-x-4 bottom-4 z-50 border border-slate-200 bg-white p-4 shadow-lg md:left-auto md:right-4 md:max-w-md"
    >
      <p className="mb-3 text-sm text-slate-700">{t("message")}</p>
      {consent !== null && (
        <p className="mb-3 text-sm font-medium text-slate-900">
          {has("analytics") ? t("currentAllowed") : t("currentDeclined")}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => save({ analytics: true })}
          className={buttonClass}
        >
          {t("accept")}
        </button>
        <button
          type="button"
          onClick={() => save({ analytics: false })}
          className={buttonClass}
        >
          {t("decline")}
        </button>
        {consent !== null && (
          <button
            type="button"
            onClick={closeSettings}
            className="px-3 py-2 text-sm text-slate-600 underline"
          >
            {t("close")}
          </button>
        )}
      </div>
    </div>
  );
}
