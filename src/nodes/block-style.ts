import { AlignmentType, IParagraphOptions } from "docx";
import type { ElementFormatType } from "lexical";

const ALIGNMENT_MAP: Record<
  string,
  (typeof AlignmentType)[keyof typeof AlignmentType]
> = {
  left: AlignmentType.LEFT,
  start: AlignmentType.START,
  center: AlignmentType.CENTER,
  right: AlignmentType.RIGHT,
  end: AlignmentType.END,
  justify: AlignmentType.JUSTIFIED,
};

const INDENT_TWIPS_PER_LEVEL = 720;

export function getBlockStyle(node: {
  format: ElementFormatType;
  indent: number;
  direction: "ltr" | "rtl" | null;
}): Pick<IParagraphOptions, "alignment" | "indent" | "bidirectional"> {
  const alignment = ALIGNMENT_MAP[node.format];

  return {
    ...(alignment && { alignment }),
    ...(node.indent > 0 && {
      indent: { left: node.indent * INDENT_TWIPS_PER_LEVEL },
    }),
    ...(node.direction === "rtl" && { bidirectional: true }),
  };
}
