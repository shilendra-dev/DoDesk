"use client"

import { Avatar, AvatarFallback } from "@/components/ui/atoms/avatar"
import { User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/atoms/dropdown-menu"

interface Assignee {
  id: string
  name?: string
  email: string
}

interface AssigneeMenuProps {
  assignee?: Assignee
  onAssigneeChange: (assigneeId: string | null) => void
  availableAssignees: Assignee[]
}

export function AssigneeMenu({ assignee, onAssigneeChange, availableAssignees }: AssigneeMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer hover:opacity-80 transition-opacity">
          {assignee ? (
            <Avatar className="w-6 h-6 border-2 border-background">
              <AvatarFallback className="text-xs">
                {assignee.name?.charAt(0).toUpperCase() || assignee.email?.charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
              <User className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Assign to</DropdownMenuLabel>
        {availableAssignees.map((user) => (
          <DropdownMenuItem 
            key={user.id} 
            onClick={() => onAssigneeChange(user.id)}
          >
            {user.name || user.email}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAssigneeChange(null)}>
          Unassign
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}