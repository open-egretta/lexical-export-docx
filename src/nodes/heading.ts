import { Paragraph, ParagraphChild, HeadingLevel } from "docx";
import type { SerializedTextNode } from "lexical";
import type { SerializedHeadingNode } from "@lexical/rich-text";
import type { SerializedLinkNode } from "@lexical/link";
import { convertText } from "./text";
import { convertLink } from "./link";
import { getBlockStyle } from "./block-style";

const HEADING_MAP = {
  h1: HeadingLevel.HEADING_1,
  h2: HeadingLevel.HEADING_2,
  h3: HeadingLevel.HEADING_3,
  h4: HeadingLevel.HEADING_4,
  h5: HeadingLevel.HEADING_5,
  h6: HeadingLevel.HEADING_6,
};

export function convertHeading(node: SerializedHeadingNode): Paragraph {
  const runs = node.children.flatMap((child): ParagraphChild[] => {
    if (child.type === "text")
      return [convertText(child as SerializedTextNode)];
    if (child.type === "link")
      return [convertLink(child as SerializedLinkNode)];
    return [];
  });

  return new Paragraph({
    heading: HEADING_MAP[node.tag],
    children: runs,
    ...getBlockStyle(node),
  });
}
