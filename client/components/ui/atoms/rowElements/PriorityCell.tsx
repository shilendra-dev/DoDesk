"use client"

import { PriorityMenu } from "@/components/ui/molecules/menus/PriorityMenu"

interface PriorityCellProps {
  issueId: string
  priority: number
}

export function PriorityCell({ issueId, priority }: PriorityCellProps) {
  return (
    <PriorityMenu 
      issueId={issueId}
      priority={priority}
    />
  )
}