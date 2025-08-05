'use client'

import React from 'react'
import { Issue } from '@/types/issue'
import { IssueTable } from '@/components/features/issues/IssuesTable'
import { IssuesTableSkeleton } from '@/components/features/issues/IssuesTableSkeleton'

interface IssueListViewProps {
  issues: Issue[]
  isLoading?: boolean
}

export function IssueListView({ issues, isLoading = false }: IssueListViewProps) {

  return (
    <div className="flex flex-col h-full">

      {/* Issue Table */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <IssuesTableSkeleton />
        ) : (
          <IssueTable issues={issues} />
        )}
      </div>
    
    </div>
  )
}