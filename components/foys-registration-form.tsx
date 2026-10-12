"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const FOYS_BASE = "https://registration-form.foys.tech";

const FOYS_SCRIPTS = [
  "https://code.jquery.com/jquery-3.2.1.slim.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.min.js",
  `${FOYS_BASE}/chunk-vendors.js`,
  `${FOYS_BASE}/app.js`,
];

const FOYS_FORM_STYLES = `
  body {
    margin: 0;
    background: #ffffff;
    color: #414141;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
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
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
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
    font-family: "Bebas Neue", Impact, sans-serif;
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

function escapeHtmlAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function getFoysDocument(configuration: string) {
  const scriptUrls = JSON.stringify(FOYS_SCRIPTS);

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="${FOYS_BASE}/chunk-vendors.css">
    <link rel="stylesheet" href="${FOYS_BASE}/app.css">
    <link rel="stylesheet" href="${FOYS_BASE}/foys-bootstrap.min.css">
    <link rel="stylesheet" href="https://unpkg.com/bootstrap-vue@2.23.1/dist/bootstrap-vue.min.css">
    <style>${FOYS_FORM_STYLES}</style>
  </head>
  <body>
    <div class="foys-form">
      <registration-form-entry configuration="${escapeHtmlAttribute(configuration)}"></registration-form-entry>
    </div>
    <script>
      (() => {
        const notifyParent = (message) => window.parent.postMessage(message, "*");
        const sendHeight = () => notifyParent({
          type: "foys-height",
          height: Math.ceil(document.documentElement.getBoundingClientRect().height)
        });
        new ResizeObserver(sendHeight).observe(document.documentElement);
        window.addEventListener("load", sendHeight);

        (async () => {
          for (const src of ${scriptUrls}) {
            await new Promise((resolve, reject) => {
              const script = document.createElement("script");
              script.src = src;
              script.onload = resolve;
              script.onerror = () => reject(new Error("Failed to load " + src));
              document.head.appendChild(script);
            });
          }
          sendHeight();
        })().catch(() => notifyParent({ type: "foys-error" }));
      })();
    </script>
  </body>
</html>`;
}

export function FoysRegistrationForm({ configuration }: { configuration: string }) {
  const t = useTranslations("Register");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [failed, setFailed] = useState(false);
  const [height, setHeight] = useState(600);
  const srcDoc = useMemo(() => getFoysDocument(configuration), [configuration]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<unknown>) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (typeof event.data !== "object" || event.data === null) return;

      const data = event.data as { type?: unknown; height?: unknown };
      if (data.type === "foys-error") {
        setFailed(true);
      } else if (
        data.type === "foys-height" &&
        typeof data.height === "number" &&
        Number.isFinite(data.height)
      ) {
        setHeight(Math.max(200, Math.min(Math.ceil(data.height), 4000)));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (failed) {
    return <p className="text-sm leading-relaxed text-ink-muted">{t("formError")}</p>;
  }

  return (
    <iframe
      ref={iframeRef}
      title={t("title")}
      srcDoc={srcDoc}
      sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      loading="lazy"
      style={{ display: "block", width: "100%", height, border: 0 }}
    />
  );
}
