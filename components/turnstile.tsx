"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type TurnstileHandle = {
  reset: () => void;
};

type TurnstileProps = {
  siteKey: string;
  onToken: (token: string) => void;
  onExpire: () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: Record<string, unknown>
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const SCRIPT_ID = "cf-turnstile-script";

export const TurnstileWidget = forwardRef<TurnstileHandle, TurnstileProps>(
  function TurnstileWidget({ siteKey, onToken, onExpire }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const onTokenRef = useRef(onToken);
    const onExpireRef = useRef(onExpire);
    onTokenRef.current = onToken;
    onExpireRef.current = onExpire;

    useEffect(() => {
      if (!siteKey) return;
      const container = containerRef.current;
      if (!container) return;

      let disposed = false;

      const renderWidget = () => {
        if (disposed || !window.turnstile || !containerRef.current) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: "light",
          action: "interest_form",
          callback: (token: string) => onTokenRef.current(token),
          "expired-callback": () => onExpireRef.current(),
          "error-callback": () => onExpireRef.current(),
        });
      };

      if (window.turnstile) {
        renderWidget();
      } else {
        let script = document.getElementById(
          SCRIPT_ID
        ) as HTMLScriptElement | null;
        if (!script) {
          script = document.createElement("script");
          script.id = SCRIPT_ID;
          script.src =
            "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
        }
        if (script.dataset.loaded === "true") {
          renderWidget();
        } else {
          script.addEventListener(
            "load",
            () => {
              script.dataset.loaded = "true";
              renderWidget();
            },
            { once: true }
          );
        }
      }

      return () => {
        disposed = true;
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
    }, [siteKey]);

    useImperativeHandle(ref, () => ({
      reset() {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      },
    }));

    return <div ref={containerRef} />;
  }
);
