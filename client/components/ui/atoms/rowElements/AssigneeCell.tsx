"use client"

import { AssigneeMenu } from "@/components/ui/molecules/menus/AssigneeMenu"

interface Assignee {
  id: string
  name?: string
  email?: string
}

interface AssigneeCellProps {
  issueId: string
  assignee?: Assignee
}

export function AssigneeCell({ issueId, assignee }: AssigneeCellProps) {
  return (
    <AssigneeMenu 
      issueId={issueId}
      assignee={assignee}
    />
  )
}