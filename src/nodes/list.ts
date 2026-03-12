import { Paragraph, ParagraphChild } from "docx";
import type { SerializedListNode, SerializedListItemNode } from "@lexical/list";
import type { SerializedLinkNode } from "@lexical/link";
import type { SerializedTextNode } from "lexical";
import { convertText } from "./text";
import { convertLink } from "./link";

export function convertList(node: SerializedListNode): Paragraph[] {
  return node.children
    .filter(
      (child): child is SerializedListItemNode => child.type === "listitem",
    )
    .map((item) => {
      const runs = item.children.flatMap((child): ParagraphChild[] => {
        if (child.type === "text")
          return [convertText(child as SerializedTextNode)];
        if (child.type === "link")
          return [convertLink(child as SerializedLinkNode)];
        return [];
      });

      return new Paragraph({
        bullet: node.listType === "bullet" ? { level: item.indent } : undefined,
        numbering:
          node.listType === "number"
            ? { reference: "default-numbering", level: item.indent }
            : undefined,
        children: runs,
      });
    });
}
