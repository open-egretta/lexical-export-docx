# @open-egretta/lexical-export-docx

Export [Lexical](https://lexical.dev/) editor content to `.docx` format.

## Installation

```bash
npm install @open-egretta/lexical-export-docx
```

Requires `lexical >= 0.41.0` as a peer dependency.

## Usage

### Inside a React component

```ts
import { exportDocx } from "@open-egretta/lexical-export-docx";

// editor is a LexicalEditor instance
const blob = await exportDocx(editor);

const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "document.docx";
a.click();
URL.revokeObjectURL(url);
```

### From JSON (SSR / Node.js)

```ts
import { exportDocxFromJSON } from "@open-egretta/lexical-export-docx";
import type { SerializedEditorState } from "lexical";

const json: SerializedEditorState = {
  /* ... */
};
const blob = await exportDocxFromJSON(json);
```

## API

### `exportDocx(editor: LexicalEditor): Promise<Blob>`

Reads the current editor state and returns a `.docx` `Blob`. Use this inside a React component where you have access to the `LexicalEditor` instance.

### `exportDocxFromJSON(json: SerializedEditorState): Promise<Blob>`

Converts a serialized editor state directly to a `.docx` `Blob`. Has zero dependency on the Lexical runtime — suitable for SSR, testing, and Node.js environments.

## Supported nodes

| Node        | Details                     |
| ----------- | --------------------------- |
| `paragraph` | Plain paragraph             |
| `heading`   | h1 – h6                     |
| `text`      | Bold, italic, underline     |
| `list`      | Bullet and numbered, nested |

## License

MIT
