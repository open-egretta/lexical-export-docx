import type {
  SerializedTableNode,
  SerializedTableRowNode,
  SerializedTableCellNode,
} from "@lexical/table";
import { Table, TableRow, TableCell } from "docx";
import { serialize } from "../serializer";

function convertTableCell(node: SerializedTableCellNode): TableCell {
  const children = serialize(node.children);

  return new TableCell({
    children,
    columnSpan: (node.colSpan ?? 1) > 1 ? node.colSpan : undefined,
    rowSpan: (node.rowSpan ?? 1) > 1 ? node.rowSpan : undefined,
  });
}

function convertTableRow(node: SerializedTableRowNode): TableRow {
  const cells = (node.children as SerializedTableCellNode[]).map((cell) =>
    convertTableCell(cell),
  );
  const isHeaderRow = (node.children as SerializedTableCellNode[]).every(
    (cell) => (cell.headerState & 1) !== 0,
  );

  return new TableRow({
    children: cells,
    tableHeader: isHeaderRow || undefined,
  });
}

export function convertTable(node: SerializedTableNode): Table {
  const rows = (node.children as SerializedTableRowNode[]).map((row) =>
    convertTableRow(row),
  );

  return new Table({ rows });
}
