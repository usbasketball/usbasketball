import { describe, expect, it } from "vitest";
import { contentfulRichTextToLexical } from "./contentful-to-lexical";

const text = (value: string, marks: { type: string }[] = []) => ({
  nodeType: "text",
  value,
  marks,
});
const paragraph = (...content: unknown[]) => ({ nodeType: "paragraph", content });

describe("contentfulRichTextToLexical", () => {
  it("maps paragraphs and text marks", () => {
    const result = contentfulRichTextToLexical({
      nodeType: "document",
      content: [paragraph(text("Hi "), text("there", [{ type: "bold" }, { type: "italic" }]))],
    });
    const [p] = result.root.children as unknown as { children: { text: string; format: number }[] }[];
    expect(p.children.map((c) => [c.text, c.format])).toEqual([
      ["Hi ", 0],
      ["there", 3],
    ]);
  });

  it("maps tables, with header cells as headerState 1", () => {
    const result = contentfulRichTextToLexical({
      nodeType: "document",
      content: [
        {
          nodeType: "table",
          content: [
            {
              nodeType: "table-row",
              content: [{ nodeType: "table-header-cell", content: [paragraph(text("Time"))] }],
            },
            {
              nodeType: "table-row",
              content: [{ nodeType: "table-cell", content: [paragraph(text("20:00"))] }],
            },
          ],
        },
      ],
    });
    const table = result.root.children[0] as unknown as {
      type: string;
      children: { children: { headerState: number; colSpan: number }[] }[];
    };
    expect(table.type).toBe("table");
    expect(table.children).toHaveLength(2);
    expect(table.children[0].children[0]).toMatchObject({ headerState: 1, colSpan: 1 });
    expect(table.children[1].children[0].headerState).toBe(0);
  });

  it("maps hyperlinks and lists", () => {
    const result = contentfulRichTextToLexical({
      nodeType: "document",
      content: [
        paragraph({ nodeType: "hyperlink", data: { uri: "https://x.test" }, content: [text("link")] }),
        {
          nodeType: "unordered-list",
          content: [{ nodeType: "list-item", content: [paragraph(text("one"))] }],
        },
      ],
    });
    const [p, list] = result.root.children as unknown as { type: string; children: Record<string, unknown>[]; listType?: string }[];
    expect(p.children[0]).toMatchObject({ type: "link", fields: { url: "https://x.test" } });
    expect(list).toMatchObject({ type: "list", listType: "bullet" });
    expect(list.children[0]).toMatchObject({ type: "listitem", value: 1 });
  });

  it("always returns a valid root, even for empty or missing input", () => {
    for (const input of [null, undefined, { nodeType: "document", content: [] }]) {
      const { root } = contentfulRichTextToLexical(input);
      expect(root.type).toBe("root");
      expect(root.children).toHaveLength(1);
    }
  });
});
