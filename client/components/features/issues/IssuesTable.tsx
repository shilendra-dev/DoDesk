'use client'

import React, { useState } from 'react'
import { Issue } from '@/types/issue'
import { Checkbox } from '@/components/ui/atoms/checkbox'
import { IssueRow } from './IssueRow'
import { useIssueStore } from '@/stores/issueStore'

interface IssueTableProps {
  issues: Issue[]
}

const IssueTableComponent = ({ issues }: IssueTableProps) => {
  const { setSelectedIssue } = useIssueStore()
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set())

  // Sort issues by createdAt descending (latest first)
  const sortedIssues = [...issues].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const handleIssueSelect = (issue: Issue) => {
    setSelectedIssue(issue.id)
  }

  const handleIssueCheck = (issueId: string, checked: boolean) => {
    setSelectedIssues(prev => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(issueId)
      } else {
        newSet.delete(issueId)
      }
      return newSet
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIssues(new Set(sortedIssues.map(issue => issue.id)))
    } else {
      setSelectedIssues(new Set())
    }
  }

  return (
    <div className="w-full">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="p-3 text-left">
              <Checkbox
                checked={selectedIssues.size === sortedIssues.length && sortedIssues.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Title</th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">State</th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Priority</th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Due Date</th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Assignee</th>
            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Created</th>
            <th className="p-3 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {sortedIssues.map((issue) => (
            <IssueRow
              key={issue.id}
              issue={issue}
              isSelected={selectedIssues.has(issue.id)}
              onIssueSelect={handleIssueSelect}
              onIssueCheck={handleIssueCheck}
            />
          ))}
        </tbody>
      </table>
      
      {sortedIssues.length === 0 && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <div className="text-center">
            <p className="text-lg font-medium">No issues found</p>
            <p className="text-sm">Create your first issue to get started</p>
          </div>
        </div>
      )}
    </div>
  )
}

export const IssueTable = React.memo(IssueTableComponent)
IssueTable.displayName = 'IssueTable'