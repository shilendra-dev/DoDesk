'use client'
import { Toaster } from 'react-hot-toast'
import { useTheme } from '@/providers/ThemeContext'

export function ClientToaster() {
  const { theme } = useTheme()
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: theme === 'dark' ? '#18181b' : '#fff',
          color: theme === 'dark' ? '#fff' : '#18181b',
        },
      }}
    />
  )
}