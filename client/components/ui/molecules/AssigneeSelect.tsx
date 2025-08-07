'use client'

import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/atoms/select'
import { TeamMember } from '@/types/workspace'

interface AssigneeSelectProps {
  members: TeamMember[]
  value: string | null
  onChange: (assigneeId: string | null) => void
}

export function AssigneeSelect({ members, value, onChange }: AssigneeSelectProps) {
  return (
    <div>
      <Select
        value={value ?? '__unassigned__'}
        onValueChange={val => onChange(val === '__unassigned__' ? null : val)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Unassigned" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__unassigned__">Unassigned</SelectItem>
          {members && members.length > 0 && members
            .filter(member => member?.user) // Filter out members without user data
            .map(member => (
              <SelectItem key={member.userId} value={member.userId}>
                {member.user?.name || member.user?.email || 'Unknown User'}
              </SelectItem>
            ))}
          {(!members || members.length === 0) && (
            <SelectItem value="__no_members__" disabled>
              No team members available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}