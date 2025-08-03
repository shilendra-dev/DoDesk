"use client"

import { Clock, Check, Archive, X, List } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/atoms/dropdown-menu"

interface StateCellProps {
  state: string
  onStateChange: (state: string) => void
}

const getStateIcon = (state: string) => {
  switch (state) {
    case 'todo': return <List className="h-3 w-3 text-blue-500" />
    case 'in_progress': return <Clock className="h-3 w-3 text-yellow-500" />
    case 'done': return <Check className="h-3 w-3 text-green-500" />
    case 'backlog': return <Archive className="h-3 w-3 text-gray-500" />
    case 'canceled': return <X className="h-3 w-3 text-red-500" />
    default: return <List className="h-3 w-3 text-blue-500" />
  }
}

export function StateCell({ state, onStateChange }: StateCellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer hover:opacity-80 transition-opacity">
          {getStateIcon(state)}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Change State</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onStateChange('todo')}>
          Todo
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStateChange('in_progress')}>
          In Progress
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStateChange('done')}>
          Done
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStateChange('backlog')}>
          Backlog
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStateChange('canceled')}>
          Canceled
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}