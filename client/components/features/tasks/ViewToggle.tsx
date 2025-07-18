'use client'

import React from 'react'
import { List, Kanban } from 'lucide-react'
import { Button } from '@/components/ui/atoms/button'
import { useTaskUIStore } from '@/stores/taskUIStore'
import { cn } from '@/lib/utils'

export function ViewToggle() {
  const { view, setView } = useTaskUIStore()

  return (
    <div className="flex items-center border border-border rounded-md p-1">
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setView('list')}
        className={cn(
          "h-8 px-3",
          view === 'list' && "bg-primary text-primary-foreground"
        )}
      >
        <List size={16} className="mr-2" />
        List
      </Button>
      
      <Button
        variant={view === 'board' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setView('board')}
        className={cn(
          "h-8 px-3",
          view === 'board' && "bg-primary text-primary-foreground"
        )}
      >
        <Kanban size={16} className="mr-2" />
        Board
      </Button>
    </div>
  )
}