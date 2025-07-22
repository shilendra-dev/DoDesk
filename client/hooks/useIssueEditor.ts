'use client'

import { useState, useEffect, useRef } from 'react'
import { Issue } from '@/types/issue'
import { useIssueStore } from '@/stores/issueStore'

export function useIssueEditor(initialIssue: Issue) {
  const { updateIssue, updateNotes } = useIssueStore()
  
  // Issue state
  const [editedIssue, setEditedIssue] = useState<Issue>(initialIssue)
  const [notes, setNotes] = useState(initialIssue?.notes || '')
  
  // Badge dropdown state
  const [dropdownType, setDropdownType] = useState<'state' | 'priority' | null>(null)
  const stateDropdownRef = useRef<HTMLDivElement>(null)
  const priorityDropdownRef = useRef<HTMLDivElement>(null)
  
  // Assignee management state
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false)
  const [dropdownMembers, setDropdownMembers] = useState<Array<{ id: string; name: string }>>([])
  const [newlyAddedAssigneeId, setNewlyAddedAssigneeId] = useState<string | null>(null)

  // Auto-close badge dropdown on outside click
  useEffect(() => {
    if (!dropdownType) return
    
    const handleClick = (e: MouseEvent) => {
      const currentRef = dropdownType === 'state' ? stateDropdownRef : priorityDropdownRef
      if (currentRef.current && !currentRef.current.contains(e.target as Node)) {
        setDropdownType(null)
      }
    }
    
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dropdownType])

  // Reset state when issue changes
  const initialIssueRef = useRef(initialIssue)
  initialIssueRef.current = initialIssue // Always has latest issue
  
  useEffect(() => {
    setEditedIssue(initialIssueRef.current)
    setNotes(initialIssueRef.current?.notes || '')
    setNewlyAddedAssigneeId(null)
  }, [initialIssue.id])

  return {
    editedIssue,
    setEditedIssue,
    notes,
    setNotes,
    dropdownType,
    setDropdownType,
    stateDropdownRef,
    priorityDropdownRef,
    showAssigneeDropdown,
    setShowAssigneeDropdown,
    dropdownMembers,
    setDropdownMembers,
    newlyAddedAssigneeId,
    setNewlyAddedAssigneeId,
    updateIssue,
    updateNotes,
  }
}