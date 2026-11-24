// Converts Contentful rich text JSON into a Lexical editor state for Payload.
// Pure (no Payload/Contentful imports) so it can be unit-tested. Only the node
// types the club's content uses are handled; unknown nodes keep their text.

type CfMark = { type: string };
type CfNode = {
  nodeType: string;
  value?: string;
  marks?: CfMark[];
  data?: { uri?: string; colspan?: number; rowspan?: number };
  content?: CfNode[];
};

export type LexicalNode = { type: string; version: 1; [key: string]: unknown };

const FORMAT_BOLD = 1;
const FORMAT_ITALIC = 2;
const FORMAT_UNDERLINE = 8;
const FORMAT_CODE = 16;

const base = { version: 1 as const, direction: "ltr", format: "", indent: 0 };

function textFormat(marks: CfMark[] = []): number {
  return marks.reduce((format, mark) => {
    if (mark.type === "bold") return format | FORMAT_BOLD;
    if (mark.type === "italic") return format | FORMAT_ITALIC;
    if (mark.type === "underline") return format | FORMAT_UNDERLINE;
    if (mark.type === "code") return format | FORMAT_CODE;
    return format;
  }, 0);
}

function inline(nodes: CfNode[] = []): LexicalNode[] {
  return nodes.flatMap((node): LexicalNode[] => {
    if (node.nodeType === "text") {
      return [
        {
          type: "text",
          version: 1,
          text: node.value ?? "",
          format: textFormat(node.marks),
          detail: 0,
          mode: "normal",
          style: "",
        },
      ];
    }
    if (node.nodeType === "hyperlink") {
      return [
        {
          ...base,
          type: "link",
          fields: { linkType: "custom", url: node.data?.uri ?? "", newTab: false },
          children: inline(node.content),
        },
      ];
    }
    // Anything else (embedded entries, nested blocks): keep the text only.
    return inline(node.content);
  });
}

function paragraph(children: LexicalNode[]): LexicalNode {
  return { ...base, type: "paragraph", children };
}

function listItems(node: CfNode): LexicalNode[] {
  return (node.content ?? []).map((item, index) => ({
    ...base,
    type: "listitem",
    value: index + 1,
    // Contentful wraps item text in paragraphs; Lexical wants it inline.
    children: (item.content ?? []).flatMap((child) =>
      child.nodeType === "paragraph" ? inline(child.content) : inline([child])
    ),
  }));
}

function block(node: CfNode): LexicalNode[] {
  switch (node.nodeType) {
    case "paragraph":
      return [paragraph(inline(node.content))];
    case "heading-1":
    case "heading-2":
    case "heading-3":
    case "heading-4":
    case "heading-5":
    case "heading-6":
      return [
        {
          ...base,
          type: "heading",
          tag: `h${node.nodeType.slice(-1)}`,
          children: inline(node.content),
        },
      ];
    case "unordered-list":
    case "ordered-list": {
      const ordered = node.nodeType === "ordered-list";
      return [
        {
          ...base,
          type: "list",
          listType: ordered ? "number" : "bullet",
          start: 1,
          tag: ordered ? "ol" : "ul",
          children: listItems(node),
        },
      ];
    }
    case "blockquote":
      return [
        { ...base, type: "quote", children: (node.content ?? []).flatMap((c) => inline(c.content)) },
      ];
    case "hr":
      return [{ type: "horizontalrule", version: 1 }];
    case "table":
      return [
        { ...base, type: "table", children: (node.content ?? []).map(tableRow) },
      ];
    default:
      return (node.content ?? []).flatMap(block);
  }
}

function tableRow(row: CfNode): LexicalNode {
  return {
    ...base,
    type: "tablerow",
    children: (row.content ?? []).map((cell) => ({
      ...base,
      type: "tablecell",
      headerState: cell.nodeType === "table-header-cell" ? 1 : 0,
      colSpan: cell.data?.colspan ?? 1,
      rowSpan: cell.data?.rowspan ?? 1,
      children: (cell.content ?? []).flatMap(block),
    })),
  };
}

export function contentfulRichTextToLexical(document: unknown) {
  const doc = document as CfNode | null;
  const children = (doc?.content ?? []).flatMap(block);
  return {
    root: {
      ...base,
      type: "root",
      children: children.length > 0 ? children : [paragraph([])],
    },
  };
}
