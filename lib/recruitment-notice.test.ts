import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/payload", () => ({ cmsRead: () => async () => null }));

import { normalizeContent, pickNotice } from "./recruitment-notice";

const content = { title: "T", intro: "I", spots: [{ label: "Men", text: "H1" }], outro: ["O"] };

describe("normalizeContent", () => {
  it("returns null without a title or intro", () => {
    expect(normalizeContent({ title: "T" })).toBeNull();
    expect(normalizeContent(null)).toBeNull();
  });

  it("trims, drops empty spots and splits outro paragraphs", () => {
    expect(
      normalizeContent({
        title: " T ",
        intro: "I",
        spots: [{ label: "Men", text: "H1" }, { label: "", text: "x" }],
        outro: "a\n\nb",
      })
    ).toEqual({ title: "T", intro: "I", spots: [{ label: "Men", text: "H1" }], outro: ["a", "b"] });
  });
});

describe("pickNotice", () => {
  it("returns null without CMS content", () => {
    expect(pickNotice(null, "en")).toBeNull();
    expect(pickNotice({ enabled: true, en: content, nl: null }, "nl")).toBeNull();
  });

  it("hides (null) when disabled", () => {
    expect(pickNotice({ enabled: false, en: content, nl: content }, "en")).toBeNull();
  });

  it("picks the locale", () => {
    expect(pickNotice({ enabled: true, en: content, nl: null }, "en")).toBe(content);
  });
});
