import type { SerializedLexicalNode, SerializedParagraphNode } from "lexical";
import { Paragraph } from "docx";
import { SerializedHeadingNode } from "@lexical/rich-text";
import { SerializedListNode } from "@lexical/list";
import { convertParagraph } from "./nodes/paragraph";
import { convertHeading } from "./nodes/heading";
import { convertList } from "./nodes/list";

export function serialize(children: SerializedLexicalNode[]): Paragraph[] {
  return children.flatMap((node) => {
    switch (node.type) {
      case "paragraph":
        return convertParagraph(node as SerializedParagraphNode);
      case "list":
        return convertList(node as SerializedListNode);
      case "heading":
        return convertHeading(node as SerializedHeadingNode);
      default:
        return [];
    }
  });
}
