import { Paragraph, TextRun } from "docx";
import type { SerializedParagraphNode, SerializedTextNode } from "lexical";
import { convertText } from "./text";

export function convertParagraph(node: SerializedParagraphNode): Paragraph {
  const runs = node.children
    .filter((child): child is SerializedTextNode => child.type === "text")
    .map((child) => convertText(child));

  return new Paragraph({ children: runs });
}
