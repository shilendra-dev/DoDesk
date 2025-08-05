"use client"

import { ClientDate } from "@/components/ui/atoms/client-date"

interface CreatedAtCellProps {
  createdAt: string
}

export function CreatedAtCell({ createdAt }: CreatedAtCellProps) {
  return <ClientDate dateString={createdAt} />
}