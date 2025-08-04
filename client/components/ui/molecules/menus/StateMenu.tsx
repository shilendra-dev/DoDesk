"use client"

import { Clock, Check, Archive, X, List } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/atoms/dropdown-menu"
import { useIssueStore } from "@/stores/issueStore"

interface StateMenuProps {
  issueId: string
  state: string
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

const stateOptions = [
  { value: 'todo', label: 'Todo', icon: <List className="h-4 w-4 text-blue-500" /> },
  { value: 'in_progress', label: 'In Progress', icon: <Clock className="h-4 w-4 text-yellow-500" /> },
  { value: 'done', label: 'Done', icon: <Check className="h-4 w-4 text-green-500" /> },
  { value: 'backlog', label: 'Backlog', icon: <Archive className="h-4 w-4 text-gray-500" /> },
  { value: 'canceled', label: 'Canceled', icon: <X className="h-4 w-4 text-red-500" /> },
]

export function StateMenu({ issueId, state }: StateMenuProps) {
  const { updateIssue, getIssueById } = useIssueStore()

  // Get the current issue to access state
  const currentIssue = getIssueById(issueId)
  const currentState = currentIssue?.state ?? state

  const onStateChange = async (newState: string) => {
    try {
      await updateIssue(issueId, { state: newState })
    } catch (error) {
      console.error('Failed to change state:', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer transition-all duration-200 hover:scale-110">
          {getStateIcon(currentState)}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 bg-card" align="end">
        <DropdownMenuGroup>
          {stateOptions.map((option) => (
            <DropdownMenuItem 
              key={option.value}
              onClick={() => onStateChange(option.value)}
              className="flex items-center gap-2 cursor-pointer"
            >
              {option.icon}
              <span>{option.label}</span>
              {currentState === option.value && (
                <Check className="h-4 w-4 text-primary ml-auto" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}