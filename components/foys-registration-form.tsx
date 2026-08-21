"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const FOYS_BASE = "https://registration-form.foys.tech";

// Loaded sequentially: Bootstrap JS needs jQuery + Popper, and the Foys app
// needs its vendor bundle before app.js.
const FOYS_SCRIPTS = [
  { id: "foys-jquery", src: "https://code.jquery.com/jquery-3.2.1.slim.min.js" },
  {
    id: "foys-popper",
    src: "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js",
  },
  {
    id: "foys-bootstrap-js",
    src: "https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.min.js",
  },
  { id: "foys-chunk-vendors", src: `${FOYS_BASE}/chunk-vendors.js` },
  { id: "foys-app", src: `${FOYS_BASE}/app.js` },
] as const;

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
      () => {
        // Drop the dead element so a later mount can retry the load.
        script?.remove();
        reject(new Error(`Failed to load ${src}`));
      },
      { once: true }
    );
  });
}

// The Foys stylesheets include Bootstrap's reboot, which would restyle the
// site chrome (body font/colors, margins on bare p/h/ul elements). This block
// is rendered after the <link> tags, so on equal specificity it wins the
// cascade regardless of load order:
// 1. Guards restoring the Tailwind preflight baseline for the page around the
//    form.
// 2. Theme overrides scoped to .foys-form that map the widget onto the site's
//    design tokens (ink #414141, muted #6f6f6f, line #d9d7d4, accent #000,
//    hover #1a1a1a, sharp corners, Inter/ Bebas Neue).
const FOYS_FORM_STYLES = `
  body {
    background: #ffffff;
    color: #414141;
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4, h5, h6, p, ul, ol, dl, figure, blockquote {
    margin: 0;
  }
  ul, ol {
    padding: 0;
    list-style: none;
  }

  .foys-form {
    color: #414141;
    font-family: var(--font-sans);
    font-size: 0.875rem;
  }
  .foys-form p, .foys-form ul, .foys-form ol {
    margin-bottom: 1rem;
  }
  .foys-form ul {
    padding-left: 2rem;
    list-style: disc;
  }
  .foys-form ol {
    padding-left: 2rem;
    list-style: decimal;
  }
  .foys-form h1, .foys-form h2 {
    font-family: var(--font-display);
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .foys-form label {
    margin-bottom: 0.25rem;
    color: #414141;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .foys-form a {
    color: #000000;
    text-decoration: none;
  }
  .foys-form a:hover {
    color: #1a1a1a;
    text-decoration: underline;
  }

  .foys-form .btn,
  .foys-form .form-control,
  .foys-form .custom-control-label::before,
  .foys-form .alert,
  .foys-form .input-group-text {
    border-radius: 0;
  }

  .foys-form .form-control {
    border-color: #d9d7d4;
    color: #414141;
  }
  .foys-form .form-control::placeholder {
    color: #6f6f6f;
  }
  .foys-form .form-control:focus {
    border-color: #000000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.15);
  }

  .foys-form .btn-primary {
    background-color: #000000;
    border-color: #000000;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .foys-form .btn-primary:hover,
  .foys-form .btn-primary:not(:disabled):not(.disabled):active {
    background-color: #1a1a1a;
    border-color: #1a1a1a;
  }
  .foys-form .btn-primary:focus,
  .foys-form .btn-primary.focus {
    background-color: #1a1a1a;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #000000;
  }
  .foys-form .btn-outline-primary {
    border-color: #000000;
    color: #000000;
  }
  .foys-form .btn-outline-primary:hover {
    background-color: #000000;
    border-color: #000000;
  }

  .foys-form .custom-control-input:checked ~ .custom-control-label::before {
    background-color: #000000;
    border-color: #000000;
  }
  .foys-form .custom-control-input:focus ~ .custom-control-label::before {
    box-shadow: 0 0 0 1px #ffffff, 0 0 0 3px rgba(0, 0, 0, 0.35);
  }

  .foys-form .alert {
    border-width: 1px 0;
  }
`;

export function FoysRegistrationForm({ configuration }: { configuration: string }) {
  const t = useTranslations("Register");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;

    let chain: Promise<void> = Promise.resolve();
    for (const { id, src } of FOYS_SCRIPTS) {
      chain = chain.then(() => loadScript(id, src));
    }
    chain.catch(() => {
      if (!disposed) setFailed(true);
    });

    return () => {
      disposed = true;
    };
  }, []);

  return (
    <>
      <link rel="stylesheet" href={`${FOYS_BASE}/chunk-vendors.css`} />
      <link rel="stylesheet" href={`${FOYS_BASE}/app.css`} />
      <link rel="stylesheet" href={`${FOYS_BASE}/foys-bootstrap.min.css`} />
      <link
        rel="stylesheet"
        href="https://unpkg.com/bootstrap-vue@2.23.1/dist/bootstrap-vue.min.css"
      />

      <style dangerouslySetInnerHTML={{ __html: FOYS_FORM_STYLES }} />

      {failed ? (
        <p className="text-sm leading-relaxed text-ink-muted">{t("formError")}</p>
      ) : (
        <div className="foys-form">
          <registration-form-entry configuration={configuration} />
        </div>
      )}
    </>
  );
}
