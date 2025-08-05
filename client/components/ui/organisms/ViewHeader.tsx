'use client'

import React from 'react'
import { ViewToggle } from '@/components/features/issues/ViewToggle'
import { CreateIssueButton } from '@/components/features/issues/CreateIssueButton'
import { cn } from '@/lib/utils'

interface ViewHeaderProps {
  title: string
  icon?: React.ReactNode
  color?: string
  showViewToggle?: boolean
  view?: 'list' | 'board'
  setView?: (view: 'list' | 'board') => void
  showCreateIssue?: boolean
  setShowCreateIssue?: (show: boolean) => void
  workspaceId?: string
  actions?: React.ReactNode
  className?: string
}

export function ViewHeader({
  title,
  icon,
  color,
  showViewToggle = false,
  view,
  setView,
  showCreateIssue = false,
  setShowCreateIssue,
  workspaceId,
  actions,
  className
}: ViewHeaderProps) {
  return (
    <div className={cn(
      "flex items-center justify-between pl-4 pr-4 pt-2 pb-2 border-b border-border",
      className
    )}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex items-center justify-center">
            {icon}
          </div>
        )}
        {color && (
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: color }}
          />
        )}
        <h1 className="text-lg font-bold text-foreground">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        {actions}
        {showViewToggle && view && setView && (
          <ViewToggle view={view} setView={setView} />
        )}
        {showCreateIssue && setShowCreateIssue && workspaceId && (
          <CreateIssueButton 
            workspaceId={workspaceId}
            showCreateIssue={showCreateIssue}
            setShowCreateIssue={setShowCreateIssue}
            size="xs"
          />
        )}
      </div>
    </div>
  )
}