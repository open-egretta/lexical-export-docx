import type { SerializedLexicalNode, SerializedParagraphNode } from "lexical";
import { Paragraph, Table } from "docx";
import { SerializedHeadingNode } from "@lexical/rich-text";
import { SerializedListNode } from "@lexical/list";
import type { SerializedTableNode } from "@lexical/table";
import { convertParagraph } from "./nodes/paragraph";
import { convertHeading } from "./nodes/heading";
import { convertList } from "./nodes/list";
import { convertTable } from "./nodes/table";

export type DocxElement = Paragraph | Table;

export function serialize(children: SerializedLexicalNode[]): DocxElement[] {
  return children.flatMap((node): DocxElement[] => {
    switch (node.type) {
      case "paragraph":
        return [convertParagraph(node as SerializedParagraphNode)];
      case "list":
        return convertList(node as SerializedListNode);
      case "heading":
        return [convertHeading(node as SerializedHeadingNode)];
      case "table":
        return [convertTable(node as SerializedTableNode)];
      default:
        return [];
    }
  });
}
