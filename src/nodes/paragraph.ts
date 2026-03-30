import { Paragraph, ParagraphChild } from "docx";
import type { SerializedParagraphNode, SerializedTextNode } from "lexical";
import type { SerializedLinkNode } from "@lexical/link";
import { convertText } from "./text";
import { convertLink } from "./link";
import { getBlockStyle } from "./block-style";

export function convertParagraph(node: SerializedParagraphNode): Paragraph {
  const runs = node.children.flatMap((child): ParagraphChild[] => {
    if (child.type === "text")
      return [convertText(child as SerializedTextNode)];
    if (child.type === "link")
      return [convertLink(child as SerializedLinkNode)];
    return [];
  });

  return new Paragraph({ children: runs, ...getBlockStyle(node) });
}
