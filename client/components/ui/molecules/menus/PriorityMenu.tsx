"use client"

import { Badge } from "@/components/ui/atoms/badge"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/atoms/dropdown-menu"

interface PriorityMenuProps {
  priority: number
  onPriorityChange: (priority: number) => void
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

export function PriorityMenu({ priority, onPriorityChange }: PriorityMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge 
          className={cn("text-xs cursor-pointer hover:opacity-80 transition-opacity", getPriorityColor(priority))}
        >
          {getPriorityLabel(priority)}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Change Priority</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onPriorityChange(1)}>
          P1 - Urgent
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onPriorityChange(2)}>
          P2 - High
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onPriorityChange(3)}>
          P3 - Medium
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onPriorityChange(4)}>
          P4 - Low
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onPriorityChange(0)}>
          P0 - None
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}