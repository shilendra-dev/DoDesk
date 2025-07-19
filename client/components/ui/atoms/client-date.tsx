'use client'

import { useEffect, useState } from 'react'

interface ClientDateProps {
  dateString: string | null | undefined
  format?: 'short' | 'long'
}

export function ClientDate({ dateString, format = 'short' }: ClientDateProps) {
  const [formattedDate, setFormattedDate] = useState<string>('')

  useEffect(() => {
    if (!dateString) {
      setFormattedDate('No date')
      return
    }

    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      setFormattedDate('Invalid date')
      return
    }

    if (format === 'short') {
      setFormattedDate(date.toLocaleDateString())
    } else {
      setFormattedDate(date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }))
    }
  }, [dateString, format])

  return <span>{formattedDate}</span>
} 