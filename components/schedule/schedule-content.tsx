import {
  RichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import type { ScheduleRichText } from "@/lib/schedule";

type LexicalNode = { type?: string; children?: LexicalNode[]; text?: string };

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  paragraph: ({ node, nodesToJSX }) => (
    <p className="mt-4 leading-relaxed text-ink-muted">
      {nodesToJSX({ nodes: node.children })}
    </p>
  ),
  table: ({ node, nodesToJSX }) => (
    <div className="mt-4 overflow-x-auto border border-line">
      <table className="schedule-table w-full border-collapse text-left text-sm">
        <tbody>{nodesToJSX({ nodes: node.children })}</tbody>
      </table>
    </div>
  ),
  tablerow: ({ node, nodesToJSX }) => (
    <tr className="border-b border-line last:border-0">
      {nodesToJSX({ nodes: node.children })}
    </tr>
  ),
  tablecell: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    const colSpan = node.colSpan > 1 ? node.colSpan : undefined;
    const rowSpan = node.rowSpan > 1 ? node.rowSpan : undefined;
    return node.headerState > 0 ? (
      <th
        colSpan={colSpan}
        rowSpan={rowSpan}
        className="bg-paper px-4 py-3 font-display text-xs uppercase tracking-widest text-ink"
      >
        {children}
      </th>
    ) : (
      <td colSpan={colSpan} rowSpan={rowSpan} className="px-4 py-3 text-ink-muted">
        {children}
      </td>
    );
  },
});

function isEmptyParagraph(node: LexicalNode | undefined): boolean {
  if (!node || node.type !== "paragraph") return false;
  return !(node.children ?? []).some(
    (child) => child.type !== "text" || (child.text ?? "").trim() !== ""
  );
}

// The editor leaves a blank paragraph after the last block; drop it so the
// section doesn't end with extra spacing.
function stripTrailingEmptyParagraphs(data: ScheduleRichText): ScheduleRichText {
  const children = [...(data.root.children as LexicalNode[])];
  while (isEmptyParagraph(children[children.length - 1])) children.pop();
  return {
    ...data,
    root: { ...data.root, children: children as typeof data.root.children },
  };
}

type ScheduleContentProps = {
  document: ScheduleRichText | null;
};

export function ScheduleContent({ document }: ScheduleContentProps) {
  if (!document) return null;
  return (
    <RichText
      data={stripTrailingEmptyParagraphs(document)}
      converters={converters}
      disableContainer
    />
  );
}
