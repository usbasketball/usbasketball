"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  consentCookieString,
  createConsent,
  type Consent,
  type ConsentCategory,
} from "@/lib/consent";

type ConsentContextValue = {
  /** `null` until the visitor has made a choice. */
  consent: Consent | null;
  /** True only after an explicit opt-in for the category. */
  has: (category: ConsentCategory) => boolean;
  save: (choices: Record<ConsentCategory, boolean>) => void;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

// Optional, e.g. ".usbasketball.nl" to share consent across subdomains.
const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined;

export function ConsentProvider({
  initialConsent,
  children,
}: {
  /** Read from the request cookie on the server, so SSR and hydration agree. */
  initialConsent: Consent | null;
  children: ReactNode;
}) {
  const [consent, setConsent] = useState(initialConsent);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const save = useCallback(
    (choices: Record<ConsentCategory, boolean>) => {
      const next = createConsent(choices);
      document.cookie = consentCookieString(next, {
        secure: window.location.protocol === "https:",
        domain: COOKIE_DOMAIN,
      });

      const withdrew = Object.entries(choices).some(
        ([category, granted]) =>
          !granted && consent?.[category as ConsentCategory] === true,
      );

      setConsent(next);
      setSettingsOpen(false);

      // A third-party script that is already running cannot be unloaded, so
      // withdrawing consent reloads the page without it.
      if (withdrew) window.location.reload();
    },
    [consent],
  );

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      has: (category) => consent?.[category] === true,
      save,
      settingsOpen,
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => setSettingsOpen(false),
    }),
    [consent, save, settingsOpen],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used inside <ConsentProvider>");
  }
  return context;
}
