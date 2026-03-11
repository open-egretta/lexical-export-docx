import { TextRun } from "docx";
import type { SerializedTextNode } from "lexical";

export function convertText(node: SerializedTextNode): TextRun {
  return new TextRun({
    text: node.text,
    bold: (node.format & 1) !== 0,
    italics: (node.format & 2) !== 0,
    underline: (node.format & 8) !== 0 ? {} : undefined,
  });
}
