"use client"

import { Badge } from "@/components/ui/atoms/badge"
import { Circle, Loader2, Check, Archive, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/atoms/dropdown-menu"

interface StateMenuProps {
  state: string
  onStateChange: (state: string) => void
}

const getStateIcon = (state: string) => {
  switch (state) {
    case 'todo': return <Circle className="h-3 w-3" />
    case 'in_progress': return <Loader2 className="h-3 w-3 animate-spin" />
    case 'done': return <Check className="h-3 w-3" />
    case 'backlog': return <Archive className="h-3 w-3" />
    case 'canceled': return <X className="h-3 w-3" />
    default: return <Circle className="h-3 w-3" />
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

export function StateMenu({ state, onStateChange }: StateMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge 
          className={cn("text-xs cursor-pointer hover:opacity-80 transition-opacity", getStateColor(state))}
        >
          {getStateIcon(state)}
        </Badge>
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