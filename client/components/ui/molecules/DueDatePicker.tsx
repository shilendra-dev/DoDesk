'use client'

import React from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/atoms/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/molecules/popover'
import { Calendar as CalendarComponent } from '@/components/ui/atoms/calendar'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface DueDatePickerProps {
  value?: string
  onChange: (date: string | undefined) => void
}

export function DueDatePicker({ value, onChange }: DueDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="date"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={date => onChange(date ? date.toISOString() : undefined)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}