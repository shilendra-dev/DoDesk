'use client'

import React from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface CollapsibleSectionProps {
  title: string | React.ReactNode
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
  className?: string
}

export function CollapsibleSection({ 
  title, 
  isExpanded, 
  onToggle, 
  children,
  className 
}: CollapsibleSectionProps) {
  return (
    <div className={className}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-2 py-1 text-xs font-medium text-foreground/80 uppercase tracking-wider hover:text-foreground hover:bg-accent/50 rounded transition-all duration-200"
      >
        {isExpanded ? (
          <ChevronDown size={12} />
        ) : (
          <ChevronRight size={12} />
        )}
        <span className="flex items-center gap-2">{title}</span>
      </button>
      
      {/* Always render, just control visibility */}
      <div 
        className={`mt-0.5 space-y-1 overflow-hidden transition-all duration-200 ${
          isExpanded 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  )
}