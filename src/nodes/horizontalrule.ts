import { BuilderElement, Paragraph } from "docx";

const createVmlRect = () =>
  new BuilderElement({
    name: "w:r",
    children: [
      new BuilderElement({
        name: "w:pict",
        children: [
          new BuilderElement({
            name: "v:rect",
            attributes: {
              style: { key: "style", value: "height:.1pt" },
              "o:hralign": { key: "o:hralign", value: "center" },
              "o:hrstd": { key: "o:hrstd", value: "true" },
              "o:hr": { key: "o:hr", value: "true" },
              fillcolor: { key: "fillcolor", value: "#a0a0a0" },
              stroked: { key: "stroked", value: "f" },
            },
          }),
        ],
      }),
    ],
  });

export function convertHorizontalRule(): Paragraph {
  const paragraph = new Paragraph({});
  paragraph.addChildElement(createVmlRect());
  return paragraph;
}
