'use client'

import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/atoms/button'

interface CommonHeaderProps {
  onBack?: () => void
  showBackButton?: boolean
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
  className?: string
}

export function CommonHeader({ 
  onBack, 
  showBackButton = false, 
  leftContent, 
  rightContent,
  className = ""
}: CommonHeaderProps) {
  return (
    <div className={`sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border/30 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && onBack && (
              <Button 
                onClick={onBack} 
                variant="ghost" 
                size="sm"
                className="h-6 w-6 p-0 hover:bg-muted/50 rounded-full"
              >
                <ArrowLeft className="h-3 w-3" />
              </Button>
            )}
            {leftContent}
          </div>
          {rightContent && (
            <div className="flex items-center gap-2">
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 