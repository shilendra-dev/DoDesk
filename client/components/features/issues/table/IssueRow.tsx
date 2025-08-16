"use client"

import { TableCell, TableRow } from "@/components/ui/molecules/table"
import { flexRender, Row } from "@tanstack/react-table"
import { SyntheticEvent } from "react"

interface IssueRowProps<TData> {
  row: Row<TData>
  onRowClick?: (row: TData) => void
}

export function IssueRow<TData>({ row, onRowClick }: IssueRowProps<TData>) {
  const cells = row.getVisibleCells()
  
  const handleRowClick = (e: SyntheticEvent) => {
    // Check if the event target is within any dropdown menu
    const target = e.target as Element
    
    if (target.closest('[data-radix-dropdown-menu-trigger]')) {
      return
    }
    
    if (target.closest('[data-radix-dropdown-menu-content]')) {
      return
    }
    
    if (target.closest('[role="menuitem"]')) {
      return
    }
    
    onRowClick?.(row.original)
  }
  
  return (
    <TableRow 
      className="hover:bg-muted/50 hover:scale-101 transition-all duration-300 border-0 cursor-pointer flex items-center"
      onClick={handleRowClick}
    >
      {/* Priority */}
      <TableCell className="px-4 py-2 w-12 hover:scale-101 transition-all duration-300 flex-shrink-0">
        {flexRender(cells[0].column.columnDef.cell, cells[0].getContext())}
      </TableCell>
      
      {/* Key */}
      <TableCell className="px-2 py-2 w-12 flex-shrink-0">
        {flexRender(cells[1].column.columnDef.cell, cells[1].getContext())}
      </TableCell>
      
      {/* Title - takes remaining space */}
      <TableCell className="px-6 py-3 flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            {flexRender(cells[2].column.columnDef.cell, cells[2].getContext())}
          </div>
          <div className="flex-shrink-0">
            {flexRender(cells[6].column.columnDef.cell, cells[6].getContext())}
          </div>
        </div>  
        
      </TableCell>
      
      {/* Labels */}
        
      
      {/* Assignee */}
      <TableCell className=" py-2 transition-all duration-300 flex-shrink-0">
        {flexRender(cells[5].column.columnDef.cell, cells[5].getContext())}
      </TableCell>
      
      {/* Created Date */}
      <TableCell className="px-2 py-2 w-20 flex-shrink-0">
        {flexRender(cells[7].column.columnDef.cell, cells[7].getContext())}
      </TableCell>
    </TableRow>
  )
}