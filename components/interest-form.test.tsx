import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  act,
  fireEvent,
  cleanup,
} from "@testing-library/react";

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "test-site-key";
});

vi.mock("next-intl", () => ({
  useTranslations: vi.fn(),
  useLocale: vi.fn(),
}));

vi.mock("@/lib/actions/interest", () => ({
  submitInterest: vi.fn(),
}));

vi.mock("@/lib/field-styles", () => ({
  buttonClass: "btn",
  errorTextClass: "err",
  inputClass: "inp",
  labelClass: "lbl",
}));

import { useTranslations, useLocale } from "next-intl";
import { submitInterest, type ActionState } from "@/lib/actions/interest";
import { InterestForm } from "@/components/interest-form";

const mockT = Object.assign(vi.fn((key: string) => key), {
  rich: vi.fn(),
  markup: vi.fn(),
  raw: vi.fn(),
  has: vi.fn(),
});
const mockSubmitInterest = vi.mocked(submitInterest);

let turnstileOptions: Record<string, unknown> = {};
const mockRender = vi.fn();
const mockRemove = vi.fn();
const mockReset = vi.fn();

function setupTurnstile() {
  turnstileOptions = {};
  mockRender.mockImplementation(
    (_el: HTMLElement, opts: Record<string, unknown>) => {
      turnstileOptions = opts;
      return "widget-1";
    },
  );
  mockRemove.mockReset();
  mockReset.mockReset();

  Object.defineProperty(window, "turnstile", {
    value: { render: mockRender, remove: mockRemove, reset: mockReset },
    writable: true,
    configurable: true,
  });
}

function fillValidForm() {
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/birthDate/i), {
    target: { value: "1990-06-15" },
  });
  fireEvent.change(screen.getByLabelText(/lastLevel/i), {
    target: { value: "beginner" },
  });
  fireEvent.click(screen.getByLabelText(/positionGuard/i));
  fireEvent.click(screen.getByLabelText(/interestCompete/i));
  fireEvent.click(screen.getByLabelText(/genderMan/i));
}

beforeEach(() => {
  vi.mocked(useTranslations).mockReturnValue(
    mockT as unknown as ReturnType<typeof useTranslations>,
  );
  vi.mocked(useLocale).mockReturnValue("en");
  mockSubmitInterest.mockResolvedValue({ success: true });
  setupTurnstile();
});

afterEach(() => {
  cleanup();
  delete (window as unknown as Record<string, unknown>).turnstile;
  document.getElementById("cf-turnstile-script")?.remove();
});

describe("InterestForm – Turnstile behaviour", () => {
  it("renders the TurnstileWidget when site key is set", () => {
    render(<InterestForm />);
    expect(mockRender).toHaveBeenCalled();
  });

  it("shows captcha error when submitting without a token", () => {
    const { container } = render(<InterestForm />);
    fillValidForm();

    act(() => {
      fireEvent.submit(container.querySelector("form")!);
    });

    expect(screen.getByText("errors.captcha_failed")).toBeInTheDocument();
  });

  it("does not show captcha error when tokenExpired is true", () => {
    const { container } = render(<InterestForm />);

    act(() => {
      (turnstileOptions["expired-callback"] as () => void)();
    });
    expect(screen.getByText("errors.captcha_expired")).toBeInTheDocument();

    fillValidForm();
    act(() => {
      fireEvent.submit(container.querySelector("form")!);
    });

    expect(screen.queryByText("errors.captcha_failed")).not.toBeInTheDocument();
    expect(screen.getByText("errors.captcha_expired")).toBeInTheDocument();
  });

  it("does not show captcha error when scriptError is true", () => {
    const { container } = render(<InterestForm />);

    act(() => {
      (turnstileOptions["error-callback"] as () => void)();
    });
    expect(
      screen.getByText("errors.captcha_load_failed"),
    ).toBeInTheDocument();

    fillValidForm();
    act(() => {
      fireEvent.submit(container.querySelector("form")!);
    });

    expect(screen.queryByText("errors.captcha_failed")).not.toBeInTheDocument();
    expect(
      screen.getByText("errors.captcha_load_failed"),
    ).toBeInTheDocument();
  });

  it("shows expired message when token expires", () => {
    render(<InterestForm />);

    act(() => {
      (turnstileOptions["expired-callback"] as () => void)();
    });

    expect(screen.getByText("errors.captcha_expired")).toBeInTheDocument();
  });

  it("shows load-failed message on script error", () => {
    render(<InterestForm />);

    act(() => {
      (turnstileOptions["error-callback"] as () => void)();
    });

    expect(
      screen.getByText("errors.captcha_load_failed"),
    ).toBeInTheDocument();
  });

  it("clears scriptError when a token arrives", () => {
    render(<InterestForm />);

    act(() => {
      (turnstileOptions["error-callback"] as () => void)();
    });
    expect(
      screen.getByText("errors.captcha_load_failed"),
    ).toBeInTheDocument();

    act(() => {
      (turnstileOptions.callback as (t: string) => void)("tok");
    });
    expect(
      screen.queryByText("errors.captcha_load_failed"),
    ).not.toBeInTheDocument();
  });

  it("clears tokenExpired when a token arrives", () => {
    render(<InterestForm />);

    act(() => {
      (turnstileOptions["expired-callback"] as () => void)();
    });
    expect(screen.getByText("errors.captcha_expired")).toBeInTheDocument();

    act(() => {
      (turnstileOptions.callback as (t: string) => void)("tok");
    });
    expect(
      screen.queryByText("errors.captcha_expired"),
    ).not.toBeInTheDocument();
  });

  it("clears captchaError when a token arrives", () => {
    const { container } = render(<InterestForm />);
    fillValidForm();

    act(() => {
      fireEvent.submit(container.querySelector("form")!);
    });
    expect(screen.getByText("errors.captcha_failed")).toBeInTheDocument();

    act(() => {
      (turnstileOptions.callback as (t: string) => void)("tok");
    });
    expect(
      screen.queryByText("errors.captcha_failed"),
    ).not.toBeInTheDocument();
  });

  it("shows success message after successful submission", async () => {
    mockSubmitInterest.mockResolvedValue({ success: true });

    const { container } = render(<InterestForm />);
    fillValidForm();

    act(() => {
      (turnstileOptions.callback as (t: string) => void)("valid-token");
    });

    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });

    expect(screen.getByText("success.title")).toBeInTheDocument();
    expect(screen.getByText("success.text")).toBeInTheDocument();
  });

  it("calls turnstile.reset and shows error on server error", async () => {
    mockSubmitInterest.mockResolvedValue({ error: "generic" });

    const { container } = render(<InterestForm />);
    fillValidForm();

    act(() => {
      (turnstileOptions.callback as (t: string) => void)("valid-token");
    });

    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });

    expect(mockReset).toHaveBeenCalled();
    expect(screen.getByText("errors.generic")).toBeInTheDocument();
  });

  it("does not show captcha error when both tokenExpired and scriptError are true", () => {
    const { container } = render(<InterestForm />);

    act(() => {
      (turnstileOptions["expired-callback"] as () => void)();
    });
    act(() => {
      (turnstileOptions["error-callback"] as () => void)();
    });

    fillValidForm();
    act(() => {
      fireEvent.submit(container.querySelector("form")!);
    });

    expect(screen.queryByText("errors.captcha_failed")).not.toBeInTheDocument();
  });

  it("shows inline error for invalid email on change", () => {
    render(<InterestForm />);

    act(() => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "not-an-email" },
      });
    });

    expect(screen.getByText("errors.invalid_email")).toBeInTheDocument();
  });

  it("shows inline error for underage birth date on change", () => {
    render(<InterestForm />);

    act(() => {
      fireEvent.change(screen.getByLabelText(/birthDate/i), {
        target: { value: "2015-01-01" },
      });
    });

    expect(screen.getByText("errors.underage")).toBeInTheDocument();
  });

  it("clears inline errors when values are fixed", () => {
    render(<InterestForm />);

    act(() => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "not-an-email" },
      });
    });
    expect(screen.getByText("errors.invalid_email")).toBeInTheDocument();

    act(() => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "valid@example.com" },
      });
    });
    expect(screen.queryByText("errors.invalid_email")).not.toBeInTheDocument();
  });

  it("disables submit button while action is pending", async () => {
    let resolveAction!: (value: ActionState) => void;
    mockSubmitInterest.mockReturnValue(
      new Promise((resolve) => { resolveAction = resolve; }),
    );

    const { container } = render(<InterestForm />);
    fillValidForm();

    act(() => {
      (turnstileOptions.callback as (t: string) => void)("valid-token");
    });

    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });

    const button = screen.getByRole("button", { name: /\.\.\./ });
    expect(button).toBeDisabled();

    await act(async () => {
      resolveAction({ success: true });
    });

    expect(screen.getByText("success.title")).toBeInTheDocument();
  });

  it("submits without token when site key is not configured", async () => {
    const original = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    const { container } = render(<InterestForm />);
    fillValidForm();

    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });

    expect(mockSubmitInterest).toHaveBeenCalled();

    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = original;
  });
});
