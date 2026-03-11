import { Paragraph } from "docx";
import type { SerializedListNode, SerializedListItemNode } from "@lexical/list";
import type { SerializedTextNode } from "lexical";
import { convertText } from "./text";

export function convertList(node: SerializedListNode): Paragraph[] {
  return node.children
    .filter(
      (child): child is SerializedListItemNode => child.type === "listitem",
    )
    .map((item) => {
      const runs = item.children
        .filter((child): child is SerializedTextNode => child.type === "text")
        .map((child) => convertText(child));

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
