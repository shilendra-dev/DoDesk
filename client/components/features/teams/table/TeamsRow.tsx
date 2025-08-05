"use client";

import { TableCell, TableRow } from "@/components/ui/molecules/table";
import { flexRender, Row } from "@tanstack/react-table";

interface TeamsRowProps<TData> {
  row: Row<TData>;
}

export function TeamsRow<TData>({ row }: TeamsRowProps<TData>) {
  const cells = row.getVisibleCells();

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <div className="flex flex-row items-center gap-2 w-full">
        {/* Team */}
        <TableCell className="flex-1 px-4 py-3">
          {flexRender(cells[0].column.columnDef.cell, cells[0].getContext())}
        </TableCell>

        {/* Key */}
        <TableCell className="flex-1 px-4 py-3">
          {flexRender(cells[1].column.columnDef.cell, cells[1].getContext())}
        </TableCell>
      </div>

      {/* Membership */}
      <TableCell className="px-4 py-3">
        {flexRender(cells[2].column.columnDef.cell, cells[2].getContext())}
      </TableCell>

      {/* Members */}
      <TableCell className="px-4 py-3">
        {flexRender(cells[3].column.columnDef.cell, cells[3].getContext())}
      </TableCell>

      {/* Actions */}
      <TableCell className="px-4 py-3">
        {flexRender(cells[4].column.columnDef.cell, cells[4].getContext())}
      </TableCell>
    </TableRow>
  );
}
