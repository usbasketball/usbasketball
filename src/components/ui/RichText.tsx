import {documentToReactComponents} from "@contentful/rich-text-react-renderer";
import {BLOCKS, INLINES} from "@contentful/rich-text-types";
import type {Document, Block, Inline} from "@contentful/rich-text-types";
import type {Options} from "@contentful/rich-text-react-renderer";

const options: Options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node, children) => (
      <p className="text-gray-600 text-sm leading-relaxed">{children}</p>
    ),
    [BLOCKS.HEADING_2]: (_node, children) => (
      <h2 className="text-xl font-black uppercase tracking-tight text-gray-900 mt-8 mb-3 first:mt-0">
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (_node, children) => (
      <h3 className="text-base font-bold uppercase tracking-tight text-gray-800 mt-6 mb-2">
        {children}
      </h3>
    ),
    [BLOCKS.UL_LIST]: (_node, children) => (
      <ul className="space-y-1.5 text-gray-600 text-sm">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node, children) => (
      <ol className="space-y-1.5 text-gray-600 text-sm list-decimal list-inside">
        {children}
      </ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node, children) => (
      <li className="flex gap-2">
        <span className="text-gray-400 select-none shrink-0">—</span>
        <span>{children}</span>
      </li>
    ),
    [BLOCKS.HR]: () => <hr className="border-gray-200 my-6" />,
    [INLINES.HYPERLINK]: (node: Block | Inline, children) => (
      <a
        href={(node.data as {uri: string}).uri}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors"
      >
        {children}
      </a>
    ),
  },
};

export default function RichText({document}: {document: Document}) {
  return (
    <div className="space-y-3">
      {documentToReactComponents(document, options)}
    </div>
  );
}
