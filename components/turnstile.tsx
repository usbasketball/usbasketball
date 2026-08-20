"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type TurnstileHandle = {
  reset: () => void;
};

type TurnstileProps = {
  siteKey: string;
  onToken: (token: string) => void;
  onExpire: () => void;
  onError?: () => void;
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
  function TurnstileWidget({ siteKey, onToken, onExpire, onError }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const onTokenRef = useRef(onToken);
    const onExpireRef = useRef(onExpire);
    const onErrorRef = useRef(onError);
    onTokenRef.current = onToken;
    onExpireRef.current = onExpire;
    onErrorRef.current = onError;

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
          appearance: "interaction-only",
          "refresh-expired": "auto",
          callback: (token: string) => onTokenRef.current(token),
          "expired-callback": () => onExpireRef.current(),
          "error-callback": () => onErrorRef.current?.(),
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
          const handleScriptError = () => {
            if (!disposed) onErrorRef.current?.();
          };
          script.addEventListener("error", handleScriptError, { once: true });
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
