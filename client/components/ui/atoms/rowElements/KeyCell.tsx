"use client"

import { Issue } from "@/types/issue"

interface KeyCellProps {
  issue: Issue
}

export function KeyCell({ issue }: KeyCellProps) {
  const issueKey = issue.issueKey;
  return (
    <span className="text-[13px] font-mono text-muted-foreground">
      {issueKey}
    </span>
  )
}