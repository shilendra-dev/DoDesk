'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/atoms/button'
import { Input } from '@/components/ui/atoms/input'
import { Label } from '@/components/ui/atoms/label'
import { Textarea } from '@/components/ui/atoms/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/atoms/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/organisms/dialog'
import { useIssueStore } from '@/stores/issueStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { CreateIssueData } from '@/types/issue'

interface CreateIssueModalProps {
  workspaceId?: string
  isOpen: boolean
  onClose: () => void
}

export function CreateIssueModal({ workspaceId, isOpen, onClose }: CreateIssueModalProps) {
  const { createIssue } = useIssueStore()
  const { teams } = useWorkspaceStore()
  const [formData, setFormData] = useState<CreateIssueData>({
    title: '',
    description: '',
    state: 'backlog',
    priority: 0,
    workspaceId: workspaceId ?? '',
    teamId: teams[0]?.id ?? ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update teamId default if teams change
  useEffect(() => {
    if (teams.length > 0 && !formData.teamId) {
      setFormData(prev => ({ ...prev, teamId: teams[0].id }))
    }
  }, [teams, formData.teamId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!workspaceId || !formData.title.trim() || !formData.teamId) {
      setError('Title and Team are required.')
      return
    }

    setIsSubmitting(true)
    try {
      await createIssue(formData)
      onClose()
      setFormData({
        title: '',
        description: '',
        state: 'backlog',
        priority: 0,
        workspaceId: workspaceId ?? '',
        teamId: teams[0]?.id ?? ''
      })
    } catch (err) {
      setError('Error creating issue.')
      console.error('Error creating issue:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof CreateIssueData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter issue title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter issue description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="team">Team *</Label>
            <Select
              value={formData.teamId}
              onValueChange={(value) => handleInputChange('teamId', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map(team => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Select
                value={formData.state}
                onValueChange={(value) => handleInputChange('state', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority?.toString() ?? '0'}
                onValueChange={(value) => handleInputChange('priority', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Urgent</SelectItem>
                  <SelectItem value="2">High</SelectItem>
                  <SelectItem value="3">Medium</SelectItem>
                  <SelectItem value="4">Low</SelectItem>
                  <SelectItem value="0">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.teamId}
            >
              {isSubmitting ? 'Creating...' : 'Create Issue'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}