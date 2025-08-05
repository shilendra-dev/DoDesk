"use client"

import { Issue } from "@/types/issue"

interface TitleCellProps {
  issue: Issue
}

export function TitleCell({ issue }: TitleCellProps) {
  return (
    <div className="flex flex-col">
      <span className="text-[13.5px] text-foreground">{issue.title}</span>
    </div>
  )
}