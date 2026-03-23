import { Paragraph, PageBreak } from "docx";

export function convertPageBreak(): Paragraph {
  return new Paragraph({
    children: [new PageBreak()],
  });
}
