import { Paragraph, TextRun, HeadingLevel } from "docx";
import type { SerializedTextNode } from "lexical";
import type { SerializedHeadingNode } from "@lexical/rich-text";
import { convertText } from "./text";

const HEADING_MAP = {
  h1: HeadingLevel.HEADING_1,
  h2: HeadingLevel.HEADING_2,
  h3: HeadingLevel.HEADING_3,
  h4: HeadingLevel.HEADING_4,
  h5: HeadingLevel.HEADING_5,
  h6: HeadingLevel.HEADING_6,
};

export function convertHeading(node: SerializedHeadingNode): Paragraph {
  const runs = node.children
    .filter((child): child is SerializedTextNode => child.type === "text")
    .map((child) => convertText(child));

  return new Paragraph({
    heading: HEADING_MAP[node.tag],
    children: runs,
  });
}
