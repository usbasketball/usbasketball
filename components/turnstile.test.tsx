import { afterEach, describe, expect, it, vi } from "vitest";
import { render, cleanup, act } from "@testing-library/react";
import { createRef } from "react";
import { TurnstileWidget, type TurnstileHandle } from "@/components/turnstile";

let turnstileOptions: Record<string, unknown> = {};
const mockRender = vi.fn();
const mockRemove = vi.fn();
const mockReset = vi.fn();

function setupTurnstile() {
  turnstileOptions = {};
  mockRender.mockImplementation((_container: HTMLElement, options: Record<string, unknown>) => {
    turnstileOptions = options;
    return "widget-1";
  });
  mockRemove.mockReset();
  mockReset.mockReset();

  Object.defineProperty(window, "turnstile", {
    value: { render: mockRender, remove: mockRemove, reset: mockReset },
    writable: true,
    configurable: true,
  });
}

afterEach(() => {
  cleanup();
  delete (window as unknown as Record<string, unknown>).turnstile;
  document.getElementById("cf-turnstile-script")?.remove();
});

describe("TurnstileWidget", () => {
  it("renders a container div", () => {
    setupTurnstile();
    const { container } = render(
      <TurnstileWidget siteKey="test-key" onToken={vi.fn()} onExpire={vi.fn()} />
    );
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("calls window.turnstile.render with correct options", () => {
    setupTurnstile();
    render(
      <TurnstileWidget siteKey="my-site-key" onToken={vi.fn()} onExpire={vi.fn()} />
    );

    expect(mockRender).toHaveBeenCalled();
    expect(turnstileOptions.sitekey).toBe("my-site-key");
    expect(turnstileOptions.theme).toBe("light");
    expect(turnstileOptions.action).toBe("interest_form");
    expect(turnstileOptions.appearance).toBe("interaction-only");
    expect(turnstileOptions["refresh-expired"]).toBe("auto");
  });

  it("fires onToken when Turnstile callback fires", () => {
    setupTurnstile();
    const onToken = vi.fn();
    render(
      <TurnstileWidget siteKey="test-key" onToken={onToken} onExpire={vi.fn()} />
    );

    act(() => {
      (turnstileOptions.callback as (token: string) => void)("real-token-abc");
    });

    expect(onToken).toHaveBeenCalledWith("real-token-abc");
  });

  it("fires onExpire when Turnstile expired-callback fires", () => {
    setupTurnstile();
    const onExpire = vi.fn();
    render(
      <TurnstileWidget siteKey="test-key" onToken={vi.fn()} onExpire={onExpire} />
    );

    act(() => {
      (turnstileOptions["expired-callback"] as () => void)();
    });

    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it("fires onError when Turnstile error-callback fires", () => {
    setupTurnstile();
    const onError = vi.fn();
    render(
      <TurnstileWidget
        siteKey="test-key"
        onToken={vi.fn()}
        onExpire={vi.fn()}
        onError={onError}
      />
    );

    act(() => {
      (turnstileOptions["error-callback"] as () => void)();
    });

    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("calls window.turnstile.remove on unmount", () => {
    setupTurnstile();
    const { unmount } = render(
      <TurnstileWidget siteKey="test-key" onToken={vi.fn()} onExpire={vi.fn()} />
    );

    unmount();

    expect(mockRemove).toHaveBeenCalledWith("widget-1");
  });

  it("exposes reset() via ref", () => {
    setupTurnstile();
    const ref = createRef<TurnstileHandle>();
    render(
      <TurnstileWidget
        ref={ref}
        siteKey="test-key"
        onToken={vi.fn()}
        onExpire={vi.fn()}
      />
    );

    act(() => {
      ref.current?.reset();
    });

    expect(mockReset).toHaveBeenCalledWith("widget-1");
  });

  it("injects script element when window.turnstile is not available", () => {
    delete (window as unknown as Record<string, unknown>).turnstile;

    const { container } = render(
      <TurnstileWidget siteKey="test-key" onToken={vi.fn()} onExpire={vi.fn()} />
    );

    expect(container.querySelector("div")).toBeInTheDocument();
    const script = document.getElementById("cf-turnstile-script") as HTMLScriptElement;
    expect(script).toBeTruthy();
    expect(script.src).toContain("challenges.cloudflare.com/turnstile/v0/api.js");
  });

  it("does not render widget when siteKey is empty", () => {
    setupTurnstile();
    mockRender.mockClear();
    render(
      <TurnstileWidget siteKey="" onToken={vi.fn()} onExpire={vi.fn()} />
    );

    expect(mockRender).not.toHaveBeenCalled();
  });

  it("fires onError when script fails to load", () => {
    delete (window as unknown as Record<string, unknown>).turnstile;

    const onError = vi.fn();
    render(
      <TurnstileWidget siteKey="test-key" onToken={vi.fn()} onExpire={vi.fn()} onError={onError} />
    );

    const script = document.getElementById("cf-turnstile-script") as HTMLScriptElement;
    expect(script).toBeTruthy();

    act(() => {
      script.dispatchEvent(new Event("error"));
    });

    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("calls renderWidget via load event handler", () => {
    delete (window as unknown as Record<string, unknown>).turnstile;

    render(
      <TurnstileWidget siteKey="test-key" onToken={vi.fn()} onExpire={vi.fn()} />
    );

    const script = document.getElementById("cf-turnstile-script") as HTMLScriptElement;
    expect(script).toBeTruthy();
    expect(script.dataset.loaded).not.toBe("true");

    setupTurnstile();
    mockRender.mockClear();

    const loadEvent = new Event("load");
    script.dispatchEvent(loadEvent);

    expect(mockRender).toHaveBeenCalledTimes(1);
    expect(script.dataset.loaded).toBe("true");
  });
});
