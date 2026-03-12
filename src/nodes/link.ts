import { ExternalHyperlink, TextRun } from "docx";
import type { SerializedLinkNode } from "@lexical/link";
import { convertText } from "./text";

export function convertLink(node: SerializedLinkNode): ExternalHyperlink {
  const runs = node.children
    .filter((c): c is Parameters<typeof convertText>[0] => c.type === "text")
    .map((c) => convertText(c, "Hyperlink"));

  return new ExternalHyperlink({
    link: node.url,
    children: runs,
  });
}
