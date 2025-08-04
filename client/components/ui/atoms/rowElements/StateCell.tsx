"use client"

import { StateMenu } from "@/components/ui/molecules/menus/StateMenu"

interface StateCellProps {
  issueId: string
  state: string
}

export function StateCell({ issueId, state }: StateCellProps) {
  return (
    <StateMenu 
      issueId={issueId}
      state={state}
    />
  )
}