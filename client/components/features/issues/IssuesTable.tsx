'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Issue } from '@/types/issue'
import { DataTable } from '@/components/ui/organisms/data-table'
import { issueColumns } from './table/issue-columns'
import { useIssueStore } from '@/stores/issueStore'

interface IssueTableProps {
  issues: Issue[]
  workspaceSlug: string  // Add this prop
}

const IssueTableComponent = ({ issues, workspaceSlug }: IssueTableProps) => {
  const { setSelectedIssue } = useIssueStore()
  const router = useRouter()
  
  const handleRowClick = (issue: Issue) => {
    setSelectedIssue(issue.id)  // Keep your store logic
    router.push(`/${workspaceSlug}/issue/${issue.issueKey}`)  // Add navigation
  }

  return (
    <DataTable
      columns={issueColumns}
      data={issues}
      showSearch={true}
      showPagination={false}
      emptyMessage="No issues found. Create a new issue."
      className="w-full"
      onRowClick={handleRowClick}
    />  
  )
}

export const IssueTable = React.memo(IssueTableComponent)
IssueTable.displayName = 'IssueTable'