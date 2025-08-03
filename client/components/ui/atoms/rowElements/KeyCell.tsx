"use client"

import { Issue } from "@/types/issue"

interface KeyCellProps {
  issue: Issue
}

export function KeyCell({ issue }: KeyCellProps) {
  const key = issue.key || `ISS-${issue.id.slice(-2)}`
  
  return (
    <span className="text-[13px] font-mono text-muted-foreground">
      {key}
    </span>
  )
}