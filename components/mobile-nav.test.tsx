import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/locale-switcher", () => ({
  LocaleSwitcher: () => <span data-testid="locale-switcher" />,
}));

vi.mock("@/components/active-link", () => ({
  ActiveLink: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className: string;
    activeClassName?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

import { MobileNavOverlay } from "@/components/mobile-nav";

const defaultItems = [
  { href: "/schedule", label: "Schedule" },
  { href: "/teams", label: "Teams" },
];

function render(open: boolean, isLoggedIn = false) {
  return renderToStaticMarkup(
    <MobileNavOverlay items={defaultItems} open={open} onOpenChange={() => {}} isLoggedIn={isLoggedIn} />,
  );
}

describe("MobileNavOverlay", () => {
  describe("full-viewport overlay", () => {
    it("uses fixed positioning to fill the viewport below the header", () => {
      const html = render(true);
      expect(html).toContain("fixed");
      expect(html).toContain("inset-x-0");
      expect(html).toContain("top-20");
      expect(html).toContain("bottom-0");
    });

    it("uses flex column layout", () => {
      const html = render(true);
      expect(html).toContain("flex-col");
    });

    it("pins the CTA button to the bottom with mt-auto", () => {
      const html = render(true, false);
      const ctaSection = html.split("mt-auto pt-6");
      expect(ctaSection.length).toBe(2);
    });
  });

  describe("open vs closed state", () => {
    it("is visible when open", () => {
      const html = render(true);
      expect(html).toContain("opacity-100");
      expect(html).not.toContain("pointer-events-none");
    });

    it("is hidden when closed", () => {
      const html = render(false);
      expect(html).toContain("pointer-events-none");
      expect(html).toContain("opacity-0");
    });
  });

  describe("content", () => {
    it("renders all nav items", () => {
      const html = render(true);
      expect(html).toContain("Schedule");
      expect(html).toContain("Teams");
    });

    it("renders the signup button when logged out", () => {
      const html = render(true, false);
      expect(html).toContain("signup");
      expect(html).toContain('href="/signup"');
      expect(html).not.toContain("logout");
    });

    it("renders the logout button when logged in", () => {
      const html = render(true, true);
      expect(html).toContain("logout");
      expect(html).toContain('href="/auth/logout"');
      expect(html).not.toContain("signup");
    });
  });
});
