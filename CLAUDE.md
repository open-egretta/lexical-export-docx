# CLAUDE.md — @open-egretta/lexical-export-docx

## Project Overview

Open-source npm package that exports Lexical editor content to `.docx` format.
Focused on Lexical only. Other editor adapters (TipTap, Slate) are future work.

**Package name:** `@open-egretta/lexical-export-docx`
**Import:** `import { exportDocx } from '@open-egretta/lexical-export-docx'`

---

## Architecture

### Data Flow

```
LexicalEditor / SerializedEditorState
  ↓  serializer.ts  — traverse root.children, dispatch by node.type
  ↓  nodes/*.ts     — each node returns docx element(s)
  ↓  builder.ts     — assemble Document → Packer.toBlob()
  ↓
Blob
```

### Directory Structure

```
src/
├── index.ts               ← public API: exportDocx(), exportDocxFromJSON()
├── serializer.ts          ← traverses SerializedEditorState, dispatches nodes
├── nodes/
│   ├── paragraph.ts       ← SerializedParagraphNode → docx Paragraph
│   ├── heading.ts         ← SerializedHeadingNode → docx Paragraph (HeadingLevel)
│   ├── text.ts            ← SerializedTextNode → docx TextRun (format bitmask)
│   ├── list.ts            ← SerializedListNode/ListItemNode → docx Paragraph[]
│   └── table.ts           ← SerializedTableNode → docx Table
└── core/
    └── builder.ts         ← new Document({ sections }) → Packer.toBlob()
```

---

## Public API

```ts
// Primary — pass editor instance (use inside React component)
export async function exportDocx(editor: LexicalEditor): Promise<Blob>;

// Core — pass JSON directly (SSR, testing, Node.js friendly)
export async function exportDocxFromJSON(
  json: SerializedEditorState,
): Promise<Blob>;
```

`exportDocx` is a thin wrapper around `exportDocxFromJSON`:

```ts
export function exportDocx(editor: LexicalEditor) {
  const json = editor.getEditorState().toJSON();
  return exportDocxFromJSON(json);
}
```

---

## Node Conversion Rules

### Text formatting (`nodes/text.ts`)

Lexical stores text format as a **bitmask** on `SerializedTextNode.format`:

| Bit | Format        |
| --- | ------------- |
| 1   | Bold          |
| 2   | Italic        |
| 4   | Strikethrough |
| 8   | Underline     |
| 32  | Subscript     |
| 64  | Superscript   |
| 128 | Highlight     |

```ts
const isBold = (format & 1) !== 0;
const isItalic = (format & 2) !== 0;
const isStrike = (format & 4) !== 0;
const isUnderline = (format & 8) !== 0;
const isSubscript = (format & 32) !== 0;
const isSuperscript = (format & 64) !== 0;
const isHighlight = (format & 128) !== 0;
```

### Heading levels (`nodes/heading.ts`)

Map `SerializedHeadingNode.tag` → `docx.HeadingLevel`:

```ts
const HEADING_MAP = {
  h1: HeadingLevel.HEADING_1,
  h2: HeadingLevel.HEADING_2,
  h3: HeadingLevel.HEADING_3,
  h4: HeadingLevel.HEADING_4,
  h5: HeadingLevel.HEADING_5,
  h6: HeadingLevel.HEADING_6,
};
```

### Lists (`nodes/list.ts`)

- `listType: 'bullet'` → unordered (docx `bullet` numbering)
- `listType: 'number'` → ordered (docx `decimal` numbering)
- Handle nested lists via `indent` level on `SerializedListItemNode`

---

## Design Principles

- **`nodes/` converters only convert, never assemble** — return docx elements, let `builder.ts` compose
- **`serializer.ts` is the only place that knows node types** — all dispatch lives here
- **Adding a new node type = add one file in `nodes/` + one line in `serializer.ts`** — core never changes
- **`exportDocxFromJSON` has zero dependency on Lexical runtime** — pure JSON in, Blob out

---

## Dependencies

```json
{
  "dependencies": {
    "docx": "^9.6.1"
  },
  "peerDependencies": {
    "lexical": ">=0.41.0"
  },
  "devDependencies": {
    "@lexical/list": "^0.41.0",
    "@lexical/rich-text": "^0.41.0",
    "@lexical/table": "^0.41.0",
    "lexical": "^0.41.0",
    "tsup": "^8.5.1",
    "tsx": "^4.21.0",
    "typescript": "^5.9.3",
    "vitest": "^4.0.18"
  }
}
```

---

## package.json — exports

```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  }
}
```

---

## Build

```bash
npm run build       # tsup src/index.ts --format esm,cjs --dts
npm run dev         # tsup --watch
npm test            # vitest
npm run test:output # tsx scripts/test-output.ts
```

---

## Testing Strategy

- Unit test each `nodes/*.ts` converter independently with fixture JSON
- Integration test `exportDocxFromJSON` with full `SerializedEditorState` snapshots
- No need to spin up a real Lexical editor in tests — pure JSON input

```ts
// Example unit test
it("converts bold text", () => {
  const node: SerializedTextNode = {
    type: "text",
    text: "Hello",
    format: 1, // bold
    detail: 0,
    mode: "normal",
    style: "",
    version: 1,
  };
  const run = convertText(node);
  expect(run.options.bold).toBe(true);
});
```

---

## Scope Boundaries (v1)

### In scope

- `paragraph`, `heading` (h1–h6)
- `text` with bold / italic / underline / strikethrough / subscript / superscript / highlight
- `list` (bullet + numbered, nested)
- `table` (rows, cells, header rows, col/row span)
- Output: `Blob` only

### Out of scope (future)

- Image, Code Block
- Buffer / Base64 output
- Other editor adapters (TipTap, Slate)
- Import docx → Lexical
