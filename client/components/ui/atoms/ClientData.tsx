'use client'

import { useEffect, useState } from 'react'

interface ClientDateProps {
  dateString?: string
  options?: Intl.DateTimeFormatOptions
  fallback?: string
}

export function ClientDate({ dateString, options, fallback = '—' }: ClientDateProps) {
  const [formatted, setFormatted] = useState(fallback)

  useEffect(() => {
    if (dateString) {
      const date = new Date(dateString)
      setFormatted(date.toLocaleDateString(undefined, options))
    }
  }, [dateString, options])

  return <span>{formatted}</span>
}