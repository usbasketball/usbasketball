import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    locale,
    children,
    ...props
  }: {
    href: string;
    locale: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={`/${locale}${href === "/" ? "" : href}`} {...props}>
      {children}
    </a>
  ),
}));

import { NotFoundContent } from "@/components/not-found-content";

describe("NotFoundContent", () => {
  it("renders the 404 copy and a locale-prefixed home link", () => {
    const html = renderToStaticMarkup(
      <NotFoundContent
        locale="en"
        title="Nothing but air!"
        description="The page dribbled out of bounds."
        home="Back to the homepage"
      />,
    );

    expect(html).toContain("Nothing but air!");
    expect(html).toContain("The page dribbled out of bounds.");
    expect(html).toContain("Back to the homepage");
    expect(html).toContain('href="/en"');
  });
});
