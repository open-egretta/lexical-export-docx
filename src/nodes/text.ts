import { TextRun } from "docx";
import type { SerializedTextNode } from "lexical";

export function convertText(node: SerializedTextNode, style?: string): TextRun {
  return new TextRun({
    text: node.text,
    bold: (node.format & 1) !== 0,
    italics: (node.format & 2) !== 0,
    underline: (node.format & 8) !== 0 ? {} : undefined,
    strike: (node.format & 4) !== 0,
    subScript: (node.format & 32) !== 0,
    superScript: (node.format & 64) !== 0,
    highlight: (node.format & 128) !== 0 ? "yellow" : undefined,
    style,
  });
}
