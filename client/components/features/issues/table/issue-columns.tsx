"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Issue } from "@/types/issue"
import {
  PriorityCell,
  KeyCell,
  TitleCell,
  AssigneeCell,
  StateCell
} from "@/components/ui/atoms/rowElements"
import { Calendar, Bug, Star, Wrench, ArrowUp } from "lucide-react"

// Label helpers
const getLabelIcon = (labelType: string) => {
  switch (labelType) {
    case 'bug': return <Bug className="h-3 w-3" />
    case 'feature': return <Star className="h-3 w-3" />
    case 'fix': return <Wrench className="h-3 w-3" />
    case 'enhancement': return <ArrowUp className="h-3 w-3" />
    case 'due_date': return <Calendar className="h-3 w-3" />
    default: return <Calendar className="h-3 w-3" />
  }
}

// Date formatter for "12 July" format
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleDateString('en-US', { month: 'long' })
  return `${day} ${month}`
}

export const issueColumns: ColumnDef<Issue>[] = [
  {
    accessorKey: "priority",
    header: "Priority",
    enableSorting: true,
    cell: ({ row }) => {
      const priority = row.getValue("priority") as number
      const handlePriorityChange = (newPriority: number) => {
        console.log('Priority changed to:', newPriority)
      }
      
      return (
        <PriorityCell 
          priority={priority} 
          onPriorityChange={handlePriorityChange}
        />
      )
    },
  },
  {
    accessorKey: "key",
    header: "Key",
    enableSorting: true,
    cell: ({ row }) => {
      const issue = row.original
      return <KeyCell issue={issue} />
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    enableSorting: true,
    cell: ({ row }) => {
      const issue = row.original
      return <TitleCell issue={issue} />
    },
  },
  {
    id: "labels",
    header: "Labels",
    enableSorting: false,
    cell: ({ row }) => {
      const issue = row.original
      const labels = issue.labels || []
      
      return (
        <div className="flex items-center gap-1">
          {labels.length > 0 ? (
            labels.slice(0, 2).map((label, index) => (
              <div key={index} className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                {getLabelIcon(label)}
              </div>
            ))
          ) : (
            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
              <Calendar className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
        </div>
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
        <span className="text-sm text-muted-foreground">
          {formatDate(dueDate)}
        </span>
      )
    },
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    enableSorting: true,
    cell: ({ row }) => {
      const assignee = row.original.assignee
      const handleAssigneeChange = (assigneeId: string | null) => {
        console.log('Assignee changed to:', assigneeId)
      }
      
      const availableAssignees = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      ]
      
      return (
        <AssigneeCell 
          assignee={assignee ? {
            id: assignee.id,
            name: assignee.name || '',
            email: assignee.email || assignee.name || ''
          } : undefined}
          onAssigneeChange={handleAssigneeChange}
          availableAssignees={availableAssignees}
        />
      )
    },
  },
  {
    accessorKey: "state",
    header: "State",
    enableSorting: true,
    cell: ({ row }) => {
      const state = row.getValue("state") as string
      const handleStateChange = (newState: string) => {
        console.log('State changed to:', newState)
      }
      
      return (
        <StateCell 
          state={state} 
          onStateChange={handleStateChange}
        />
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    enableSorting: true,
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string
      return (
        <span className="text-sm text-muted-foreground">
          {formatDate(createdAt)}
        </span>
      )
    },
  },
]