'use client'

import React from 'react'
import { Button } from '@/components/ui/atoms/button'
import { Plus } from 'lucide-react'

export default function TeamsPage() {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between pl-4 pr-4 pt-2 pb-2 border-b border-border">
        <h1 className="text-lg font-bold text-foreground">Teams</h1>
        
        <Button  size="xs" className="border flex items-center gap-2">
          <Plus size={16} />
          Team
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <span className="text-muted-foreground">Teams management coming soon.</span>
      </div>
    </div>
  )
}