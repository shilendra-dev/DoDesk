'use client'

import React from 'react'
import { List, Kanban } from 'lucide-react'
import { Button } from '@/components/ui/atoms/button'
import { cn } from '@/lib/utils'

interface ViewToggleProps {
  view: 'list' | 'board'
  setView: (view: 'list' | 'board') => void
}

export function ViewToggle({ view, setView }: ViewToggleProps) {
  return (
    <div className="flex items-center border border-border rounded p-0.5 bg-muted/40">
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => setView('list')}
        className={cn(
          "h-7 w-7",
          view === 'list' && "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
        aria-label="List view"
        title="List view"
      >
        <List size={16} />
      </Button>
      <Button
        variant={view === 'board' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => setView('board')}
        className={cn(
          "h-7 w-7",
          view === 'board' && "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
        aria-label="Board view"
        title="Board view"
      >
        <Kanban size={16} />
      </Button>
    </div>
  )
}