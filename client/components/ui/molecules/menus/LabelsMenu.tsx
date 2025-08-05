"use client"

import { Calendar, Bug, Star, Wrench, ArrowUp } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/atoms/dropdown-menu"

interface Label {
  id: string
  type: string
  name: string
}

interface LabelsMenuProps {
  labels: Label[]
  onLabelsChange: (labels: Label[]) => void
}

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

export function LabelsMenu({ labels }: LabelsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
          {labels.length > 0 ? (
            labels.slice(0, 3).map((label, index) => (
              <div key={index} className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                {getLabelIcon(label.type)}
              </div>
            ))
          ) : (
            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
              <Calendar className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Labels</DropdownMenuLabel>
        <DropdownMenuItem>Add Bug Label</DropdownMenuItem>
        <DropdownMenuItem>Add Feature Label</DropdownMenuItem>
        <DropdownMenuItem>Add Fix Label</DropdownMenuItem>
        <DropdownMenuItem>Add Enhancement Label</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Manage Labels</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}