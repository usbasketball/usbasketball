"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const FOYS_BASE = "https://registration-form.foys.tech";

const VENDORS_SCRIPT_ID = "foys-chunk-vendors";
const APP_SCRIPT_ID = "foys-app";

function loadScript(id: string, src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.src = src;
      script.async = true;
      document.head.appendChild(script);
    }
    if (script.dataset.loaded === "true") {
      resolve();
      return;
    }
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true }
    );
    script.addEventListener(
      "error",
      () => reject(new Error(`Failed to load ${src}`)),
      { once: true }
    );
  });
}

export function FoysRegistrationForm({ configuration }: { configuration: string }) {
  const t = useTranslations("Register");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;

    // app.js depends on chunk-vendors.js, so load them sequentially.
    loadScript(VENDORS_SCRIPT_ID, `${FOYS_BASE}/chunk-vendors.js`)
      .then(() => loadScript(APP_SCRIPT_ID, `${FOYS_BASE}/app.js`))
      .catch(() => {
        if (!disposed) setFailed(true);
      });

    return () => {
      disposed = true;
    };
  }, []);

  return (
    <>
      <link rel="stylesheet" href={`${FOYS_BASE}/chuck-vendors.css`} />
      <link rel="stylesheet" href={`${FOYS_BASE}/app.css`} />

      {failed ? (
        <p className="text-sm leading-relaxed text-ink-muted">{t("formError")}</p>
      ) : (
        <registration-form-entry configuration={configuration} />
      )}
    </>
  );
}
