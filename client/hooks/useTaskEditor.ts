'use client'

import { useState, useEffect, useRef } from 'react'
import { Task } from '@/types/task'
import { useTaskStore } from '@/stores/taskStore'
import { taskService } from '@/services/taskService'

export function useTaskEditor(initialTask: Task) {
  const { updateTask, updateNotes } = useTaskStore()
  
  // Task state
  const [editedTask, setEditedTask] = useState<Task>(initialTask)
  const [notes, setNotes] = useState(initialTask?.notes || '')
  
  // Badge dropdown state
  const [dropdownType, setDropdownType] = useState<'status' | 'priority' | null>(null)
  const statusDropdownRef = useRef<HTMLDivElement>(null)
  const priorityDropdownRef = useRef<HTMLDivElement>(null)
  
  // Assignee management state
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false)
  const [dropdownMembers, setDropdownMembers] = useState<Array<{ id: string; name: string }>>([])
  const [newlyAddedAssigneeIds, setNewlyAddedAssigneeIds] = useState<string[]>([])

  // Auto-close badge dropdown on outside click
  useEffect(() => {
    if (!dropdownType) return
    
    const handleClick = (e: MouseEvent) => {
      const currentRef = dropdownType === 'status' ? statusDropdownRef : priorityDropdownRef
      if (currentRef.current && !currentRef.current.contains(e.target as Node)) {
        setDropdownType(null)
      }
    }
    
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dropdownType])

  // Reset state when task changes
    const initialTaskRef = useRef(initialTask)
    initialTaskRef.current = initialTask // Always has latest task
    
    useEffect(() => {
        setEditedTask(initialTaskRef.current) // Uses current task
        setNotes(initialTaskRef.current?.notes || '')
        setNewlyAddedAssigneeIds([])
    }, [initialTask.id]) 

  // Auto-save field changes
  const handleAutoSaveChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const updated = { ...editedTask, [name]: value }
    setEditedTask(updated)
    await updateTask(editedTask.id, { [name]: value })
  }

  // Handle badge dropdown selections (status/priority)
  const handleBadgeSelect = async (type: 'status' | 'priority', value: string) => {
    const updated = { ...editedTask, [type]: value }
    setEditedTask(updated)
    setDropdownType(null)
    await updateTask(editedTask.id, { [type]: value })
  }

  // Handle notes updates
  const handleNotesUpdate = async (newNotes: string) => {
    setNotes(newNotes)
    await updateNotes(initialTask.id, newNotes)
  }

  // Handle task assignment
  const handleAssign = async (taskId: string, assigneeIds: string[]) => {
    // The 'assignees' property is not valid for UpdateTaskData, so we should use 'assignee_ids' instead.
    try {
      await updateTask(taskId, { assignee_ids: assigneeIds })
      setNewlyAddedAssigneeIds(assigneeIds)
      setShowAssigneeDropdown(false)
    } catch (error) {
      console.error('Error assigning task:', error)
    }
  }

  // Handle assignee removal
  const handleRemoveAssignee = async (userId: string) => {
    try {
      const updatedAssignees = editedTask.assignees.filter(a => a.id !== userId)
      const updated = { ...editedTask, assignees: updatedAssignees }
      setEditedTask(updated)
      await updateTask(editedTask.id, { assignees: updatedAssignees })
    } catch (error) {
      console.error('Error removing assignee:', error)
    }
  }

  // Toggle assignee dropdown and fetch available members
  const handleAssigneeDropdownToggle = async () => {
    try {
      const availableMembers = await taskService.getAvailableMembers(
        initialTask.workspace_id,
        editedTask.assignees
      )
      setDropdownMembers(availableMembers)
      setShowAssigneeDropdown(prev => !prev)
    } catch (error) {
      console.error('Error fetching members:', error)
    }
  }

  return {
    // State
    editedTask,
    notes,
    dropdownType,
    showAssigneeDropdown,
    dropdownMembers,
    newlyAddedAssigneeIds,
    
    // Refs
    statusDropdownRef,
    priorityDropdownRef,
    
    // Handlers
    handleAutoSaveChange,
    handleBadgeSelect,
    handleNotesUpdate,
    handleAssign,
    handleRemoveAssignee,
    handleAssigneeDropdownToggle,
    
    // State setters
    setDropdownType,
    setShowAssigneeDropdown,
  }
}