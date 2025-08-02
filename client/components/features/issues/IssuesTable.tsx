'use client'

import React from 'react'
import { Issue } from '@/types/issue'
import { DataTable } from '@/components/ui/organisms/data-table'
import { issueColumns } from './table/issue-columns'
// import { useIssueStore } from '@/stores/issueStore'

interface IssueTableProps {
  issues: Issue[]
}

const IssueTableComponent = ({ issues }: IssueTableProps) => {
  // const { setSelectedIssue } = useIssueStore()

  // const handleRowClick = (issue: Issue) => {
  //   setSelectedIssue(issue.id)
  // }

  return (
    <DataTable
      columns={issueColumns}
      data={issues}
      showSearch={true}
      showPagination={true}
      showRowSelection={true}
      emptyMessage="No issues found. Create a new issue."
      className="w-full"
    />
  )
}

export const IssueTable = React.memo(IssueTableComponent)
IssueTable.displayName = 'IssueTable' 