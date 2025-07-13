// components/ui/atoms/theme-toggle.tsx
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/providers/ThemeContext'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative h-10 w-10 rounded-full cursor-pointer transition-all duration-300",
        "focus:outline-none",
        "hover:shadow-lg",
        theme === 'dark'
          ? "bg-slate-800 shadow-inner"
          : "bg-yellow-100 shadow-inner"
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={cn(
            "transition-all duration-500",
            theme === 'dark' ? "scale-100" : "scale-0"
          )}
        >
          <Moon className="h-5 w-5 text-slate-200" />
        </div>
        <div
          className={cn(
            "absolute transition-all duration-500",
            theme === 'dark' ? "scale-0" : "scale-100"
          )}
        >
          <Sun className="h-5 w-5 text-yellow-600" />
        </div>
      </div>
      
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}