import { AlignmentType, Document, NumberFormat, Packer, Paragraph, Table } from "docx";

export async function buildDocx(elements: (Paragraph | Table)[]): Promise<Blob> {
  const doc = new Document({
    //
    numbering: {
      config: [
        {
          reference: "default-numbering",
          levels: [
            {
              level: 0,
              format: NumberFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 480, hanging: 480 },
                },
              },
            },
          ],
        },
      ],
    },
    //
    sections: [
      {
        children: elements,
      },
    ],
  });
  return Packer.toBlob(doc);
}
