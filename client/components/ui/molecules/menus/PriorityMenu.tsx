"use client"

import { Badge } from "@/components/ui/atoms/badge"
import { Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/atoms/dropdown-menu"
import { useIssueStore } from "@/stores/issueStore"
import { cn } from "@/lib/utils"

interface PriorityMenuProps {
  issueId: string
  priority: number
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

const priorityOptions = [
  { value: 1, label: 'Urgent', color: 'bg-destructive/10 text-destructive border-destructive/20' },
  { value: 2, label: 'High', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' },
  { value: 3, label: 'Medium', color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' },
  { value: 4, label: 'Low', color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
  { value: 0, label: 'None', color: 'bg-muted text-muted-foreground border-border' },
]

export function PriorityMenu({ issueId, priority }: PriorityMenuProps) {
  const { updateIssue, getIssueById } = useIssueStore()

  // Get the current issue to access priority
  const currentIssue = getIssueById(issueId)
  const currentPriority = currentIssue?.priority ?? priority

  const onPriorityChange = async (newPriority: number) => {
    try {
      await updateIssue(issueId, { priority: newPriority })
    } catch (error) {
      console.error('Failed to change priority:', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge 
          className={cn(
            "text-xs cursor-pointer transition-all duration-200 hover:scale-105", 
            getPriorityColor(currentPriority)
          )}
        >
          {getPriorityLabel(currentPriority)}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-35 bg-card" align="start">
        <DropdownMenuGroup>
          {priorityOptions.map((option) => (
            <DropdownMenuItem 
              key={option.value}
              onClick={() => onPriorityChange(option.value)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Badge className={cn("text-xs", option.color)}>
                {getPriorityLabel(option.value)}
              </Badge>
              <span>{option.label}</span>
              {currentPriority === option.value && (
                <Check className="h-4 w-4 text-primary ml-auto" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}