"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Issue } from "@/types/issue"
import { Badge } from "@/components/ui/atoms/badge"
import { Button } from "@/components/ui/atoms/button"
import { Calendar, MoreHorizontal } from "lucide-react"
import { ClientDate } from "@/components/ui/atoms/client-date"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/atoms/dropdown-menu"

const getStateLabel = (state: string) => {
  switch (state) {
    case 'backlog': return 'Backlog'
    case 'todo': return 'To Do'
    case 'in_progress': return 'In Progress'
    case 'done': return 'Done'
    case 'canceled': return 'Canceled'
    default: return state
  }
}

const getStateColor = (state: string) => {
  switch (state) {
    case 'backlog': return 'bg-gray-200 text-gray-700 border-gray-300'
    case 'todo': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'done': return 'bg-green-100 text-green-700 border-green-200'
    case 'canceled': return 'bg-red-100 text-red-700 border-red-200'
    default: return 'bg-muted text-muted-foreground border-border'
  }
}

const getPriorityLabel = (priority: number) => {
  switch (priority) {
    case 1: return 'P1'
    case 2: return 'P2'
    case 3: return 'P3'
    case 4: return 'P4'
    case 0: return 'P0'
    default: return `P${priority}`
  }
}

const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 1: return 'bg-destructive/10 text-destructive border-destructive/20'
    case 2: return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
    case 3: return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
    case 4: return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
    default: return 'bg-muted text-muted-foreground border-border'
  }
}

export const issueColumns: ColumnDef<Issue>[] = [
    {
      accessorKey: "title",
      header: "Title",
      enableSorting: true,
      cell: ({ row }) => {
        const issue = row.original
        return (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{issue.title}</span>
            {issue.description && (
              <span className="text-sm text-muted-foreground truncate max-w-xs">
                {issue.description}
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "state",
      header: "State",
      enableSorting: true,
      cell: ({ row }) => {
        const state = row.getValue("state") as string
        return (
          <Badge className={cn("text-xs", getStateColor(state))}>
            {getStateLabel(state)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      enableSorting: true,
      cell: ({ row }) => {
        const priority = row.getValue("priority") as number
        return (
          <Badge className={cn("text-xs", getPriorityColor(priority))}>
            {getPriorityLabel(priority)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      enableSorting: true,
      cell: ({ row }) => {
        const dueDate = row.getValue("dueDate") as string
        if (!dueDate) return <span className="text-muted-foreground">No due date</span>
        
        return (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar size={14} />
            <ClientDate dateString={dueDate} />
          </div>
        )
      },
    },
    {
      accessorKey: "assignee",
      header: "Assignee",
      enableSorting: true,
      cell: ({ row }) => {
        const assignee = row.original.assignee
        if (!assignee) return <span className="text-muted-foreground">Unassigned</span>
        
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
              {assignee.name?.charAt(0) || assignee.email?.charAt(0)}
            </div>
            <span className="text-sm">{assignee.name || assignee.email}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      enableSorting: true,
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string
        return <ClientDate dateString={createdAt} />
      },
    },
    {
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => {
        const issue = row.original
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(issue.id)}>
                Copy issue ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit issue</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]