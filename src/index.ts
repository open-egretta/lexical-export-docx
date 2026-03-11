import type { LexicalEditor, SerializedEditorState } from "lexical";
import { buildDocx } from "./core/builder";
import { Paragraph, TextRun } from "docx";
import { serialize } from "./serializer";

export async function exportDocx(editor: LexicalEditor): Promise<Blob> {
  const json = editor.getEditorState().toJSON();
  return exportDocxFromJSON(json);
}

export async function exportDocxFromJSON(
  json: SerializedEditorState,
): Promise<Blob> {
  const elements = serialize(json.root.children);
  return buildDocx(elements);
}
