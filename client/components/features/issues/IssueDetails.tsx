'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Loader2, Edit3, Clock } from 'lucide-react'
import { Button } from '@/components/ui/atoms/button'
import { Input } from '@/components/ui/atoms/input'
import { useIssueStore } from '@/stores/issueStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { useAuth } from '@/providers/auth-provider'
import { IssueNotes } from '@/components/features/issues/IssueNotes'
import { DueDatePicker } from '@/components/ui/molecules/DueDatePicker'
import { PriorityCell, StateCell, AssigneeCell } from '@/components/ui/atoms/rowElements'
import { CommentsList } from '@/components/features/comments'
import { CommonHeader } from '@/components/layout/CommonHeader'

export function IssueDetails() {
  const router = useRouter()
  const params = useParams()
  const { updateIssue, updateNotes, setSelectedIssue, fetchIssuesByWorkspace, isInitialized } = useIssueStore()
  const { currentWorkspace } = useWorkspaceStore()
  const { user: currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState(false)

  // Get issue key from URL params
  const issueKey = params.issueKey as string

  // Get issue from store by searching through all loaded issues
  const issue = useIssueStore(state => {
    const allIssues = Object.values(state.issues)
    return allIssues.find(issue => issue.issueKey === issueKey) || null
  })

  useEffect(() => {
    const loadIssue = async () => {
      if (!issueKey) {
        setError('No issue key provided')
        setLoading(false)
        return
      }

      // Check if issue is already in store
      if (issue) {
        setSelectedIssue(issue.id)
        setLoading(false)
        return
      }

      // If issue not in store and we have a workspace, try to fetch workspace issues
      if (currentWorkspace && !isInitialized) {
        try {
          await fetchIssuesByWorkspace(currentWorkspace.id)
          // After fetching, check if the issue is now available
          const updatedIssues = useIssueStore.getState().issues
          const foundIssue = Object.values(updatedIssues).find(issue => issue.issueKey === issueKey)
          
          if (foundIssue) {
            setSelectedIssue(foundIssue.id)
            setLoading(false)
            return
          }
        } catch (error) {
          console.error('Failed to fetch workspace issues:', error)
        }
      }

      // If still not found, show error
      setError(`Issue ${issueKey} not found. Please go back to the issues list and try again.`)
      setLoading(false)
    }

    loadIssue()
  }, [issueKey, issue, currentWorkspace, isInitialized, fetchIssuesByWorkspace, setSelectedIssue])

  const handleBack = () => {
    router.back()
  }

  const handleFieldUpdate = async (field: string, value: string | number) => {
    if (issue) {
      try {
        await updateIssue(issue.id, { [field]: value })
        // No need to update local state since we're using store directly
      } catch (error) {
        console.error('Failed to update issue:', error)
      }
    }
  }

  const handleNotesUpdate = async (notes: string) => {
    if (issue) {
      try {
        await updateNotes(issue.id, notes)
        // No need to update local state since we're using store directly
      } catch (error) {
        console.error('Failed to update notes:', error)
      }
    }
  }

  const handleTitleSave = async (newTitle: string) => {
    if (issue && newTitle.trim() !== issue.title) {
      try {
        await updateIssue(issue.id, {title: newTitle.trim()})
        // No need to update local state since we're using store directly
      } catch (error) {
        console.error('Failed to update title:', error)
      }
    }
    setEditingTitle(false)
  }



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-3 text-muted-foreground">Loading issue...</span>
      </div>
    )
  }

  if (error || !issue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <p className="text-destructive">{error || 'Issue not found'}</p>
        <Button onClick={handleBack} variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Floating Header */}
      <CommonHeader
        showBackButton={true}
        onBack={handleBack}
        leftContent={
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-muted/50 rounded-full text-xs font-medium text-muted-foreground">
              {issue.issueKey}
            </span>
            <span className="text-xs text-muted-foreground">
              by {issue.creator?.name || 'Unknown'}
            </span>
          </div>
        }
      />

      {/* Content */}
      <div className="max-w-6xl mx-auto px-10 py-6">
        {/* Priority Bar */}
        <div className="mb-4">
          {editingTitle ? (
            <div className="flex items-center gap-2">
              <Input
                value={issue.title}
                onChange={(e) => handleFieldUpdate('title', e.target.value)}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTitleSave(e.currentTarget.value)
                  } else if (e.key === 'Escape') {
                    setEditingTitle(false)
                  }
                }}
                className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 px-0 py-0 h-auto resize-none bg-transparent leading-tight"
                style={{ fontSize: '1.5rem', lineHeight: '2rem' }}
                autoFocus
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                {issue.title}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingTitle(true)}
                className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted/50 text-sm"
              >
                <Edit3 className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>
          )}
          
          {/* Priority Bar */}
          <div className="flex items-center gap-4 mt-3 mb-3 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Priority</span>
                <PriorityCell issueId={issue.id} priority={issue.priority || 0} />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Status</span>
                <StateCell issueId={issue.id} state={issue.state || ''} />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Assignee</span>
                <AssigneeCell issueId={issue.id} assignee={issue.assignee} />
              </div>
            </div>
            
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <DueDatePicker
                  value={issue.dueDate}
                  onChange={dueDate => handleFieldUpdate('dueDate', dueDate ?? '')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6 lg:pr-6 lg:border-r lg:border-border/50">
            {/* Description & Notes */}
            <div className="space-y-3">
              <IssueNotes
                initialContent={issue.notes || ''}
                onUpdate={handleNotesUpdate}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Labels */}
            <div className="bg-card rounded-lg border border-border/60 p-4">
              <h3 className="font-semibold mb-3 text-sm">Labels</h3>
              <div className="flex flex-wrap gap-1">
                {issue.labels && issue.labels.length > 0 ? (
                  issue.labels.map((label, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-muted/50 rounded-full text-xs font-medium text-muted-foreground"
                    >
                      {label}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No labels</span>
                )}
              </div>
            </div>

            {/* Comments Section - clean design without card background */}
            <div className="space-y-4">
              <CommentsList 
                issueId={issue.id} 
                currentUserId={currentUser?.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}