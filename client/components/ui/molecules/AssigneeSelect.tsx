'use client'

import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/atoms/select'

interface Member {
  userId: string
  user: { name?: string; email: string }
}

interface AssigneeSelectProps {
  members: Member[]
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
          {members.map(member => (
            <SelectItem key={member.userId} value={member.userId}>
              {member.user.name || member.user.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}