import {
  documentToReactComponents,
  type NodeRenderer,
} from "@contentful/rich-text-react-renderer";
import { BLOCKS, type Document } from "@contentful/rich-text-types";

const renderNode: Record<string, NodeRenderer> = {
  [BLOCKS.PARAGRAPH]: (_, children) => (
    <p className="mt-4 leading-relaxed text-ink-muted">{children}</p>
  ),
  [BLOCKS.TABLE]: (_, children) => (
    <div className="mt-4 overflow-x-auto border border-line">
      <table className="schedule-table w-full border-collapse text-left text-sm">
        <tbody>{children}</tbody>
      </table>
    </div>
  ),
  [BLOCKS.TABLE_ROW]: (_, children) => (
    <tr className="border-b border-line last:border-0">{children}</tr>
  ),
  [BLOCKS.TABLE_HEADER_CELL]: (_, children) => (
    <th className="bg-paper px-4 py-3 font-display text-xs uppercase tracking-widest text-ink">
      {children}
    </th>
  ),
  [BLOCKS.TABLE_CELL]: (_, children) => (
    <td className="px-4 py-3 text-ink-muted">{children}</td>
  ),
};

type ScheduleContentProps = {
  document: Document | null;
};

export function ScheduleContent({ document }: ScheduleContentProps) {
  if (!document) return null;
  return documentToReactComponents(document, {
    renderNode,
    stripEmptyTrailingParagraph: true,
  });
}
