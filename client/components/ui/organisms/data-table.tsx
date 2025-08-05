"use client"

import * as React from "react"
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  getPaginationRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/molecules/table"
import { Button } from "@/components/ui/atoms/button"
import { Input } from "@/components/ui/atoms/input"
import { cn } from "@/lib/utils"
import { IssueRow } from "@/components/features/issues/table/IssueRow"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  showSearch?: boolean
  showPagination?: boolean
  className?: string
  emptyMessage?: string
  showRowSelection?: boolean
  groupBy?: string
}

// State order for grouping
const stateOrder = ['todo', 'in_progress', 'backlog', 'done', 'canceled']
const stateLabels = {
  todo: 'To Do',
  in_progress: 'In Progress', 
  backlog: 'Backlog',
  done: 'Done',
  canceled: 'Canceled'
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  showSearch = true,
  showPagination = true,
  className,
  emptyMessage = "No data found",
  groupBy = "state"
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  // Group data by state
  const groupedData = React.useMemo(() => {
    const groups: Record<string, TData[]> = {}
    
    table.getFilteredRowModel().rows.forEach((row) => {
      const state = (row.original as Record<string, unknown>)[groupBy] as string || 'unknown'
      if (!groups[state]) {
        groups[state] = []
      }
      groups[state].push(row.original)
    })
    
    return groups
  }, [table.getFilteredRowModel().rows, groupBy])

  return (
    <div className={cn("space-y-4", className)}>
      {showSearch && searchKey && (
        <div className="flex items-center py-4">
          <Input
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      )}
      
      {/* Table */}
      <div className="rounded-md">
        <Table>
          <TableBody className="[&_tr]:border-0">
            {Object.keys(groupedData).length > 0 ? (
              stateOrder.map((state) => {
                const groupIssues = groupedData[state]
                if (!groupIssues || groupIssues.length === 0) return null
                
                return (
                  <React.Fragment key={state}>
                    {/* Group Header */}
                    <TableRow className="border-0 bg-muted/40 dark:bg-muted/20">
                      <TableCell colSpan={8} className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {stateLabels[state as keyof typeof stateLabels]}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {groupIssues.length} issue{groupIssues.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* Group Issues */}
                    {groupIssues.map((issue) => {
                      const row = table.getRowModel().rows.find(r => r.original === issue)
                      if (!row) return null
                      
                      return (
                        <IssueRow<TData> key={row.id} row={row} />
                      )
                    })}
                  </React.Fragment>
                )
              })
            ) : (
              <TableRow className="border-0">
                <TableCell colSpan={8} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} row(s) total.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}