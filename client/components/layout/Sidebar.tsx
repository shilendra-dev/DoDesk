// client/components/layout/Sidebar.tsx
'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  Inbox, Target, FolderOpen, Eye, MoreHorizontal, Import, UserPlus,
  Search, Plus, HelpCircle, LogOut
} from 'lucide-react'
import { useWorkspace } from '@/providers/WorkspaceContext'
import { Avatar, AvatarFallback } from '@/components/ui/atoms/avatar'
import { Button } from '@/components/ui/atoms/button'
import { WorkspaceDropdown } from './WorkspaceDropdown'
import { CollapsibleSection } from './CollapsibleSection'
import { SidebarItem } from './SidebarItem'
import { TeamsSection } from './TeamSection'

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { currentWorkspace } = useWorkspace()
  
  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    workspace: true,
    teams: true,
    try: false
  })
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set(['1'])) // Team '1' expanded by default
  const toggleTeam = (teamId: string) => {
    setExpandedTeams(prev => {
      const newSet = new Set(prev)
      if (newSet.has(teamId)) {
        newSet.delete(teamId)
      } else {
        newSet.add(teamId)
      }
      return newSet
    })
  }

  // Toggle section expanded state
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Handle navigation within workspace
  const handleMenuClick = (path: string) => {
    if (currentWorkspace) {
      router.push(`/${currentWorkspace.slug}/${path}`)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/signin' })
  }

  // Check if current path is active
  const isActive = (path: string) => pathname.includes(path)

  return (
    <aside className="w-[240px] h-screen bg-card border-r border-border flex flex-col overflow-hidden">
      {/* Workspace Section */}
      <div className="px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <WorkspaceDropdown />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-1.5 h-auto"
            onClick={() => console.log('Search clicked')}
          >
            <Search size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1.5 h-auto"
            onClick={() => handleMenuClick('myissues')}
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2 space-y-3">
          {/* Personal Section */}
          <div>
            <nav className="space-y-1">
              <SidebarItem
                icon={<Inbox size={16} />}
                label="Inbox"
                isActive={isActive('/inbox')}
                onClick={() => handleMenuClick('inbox')}
              />
              <SidebarItem
                icon={<Target size={16} />}
                label="My issues"
                isActive={isActive('/myissues')}
                onClick={() => handleMenuClick('myissues')}
              />
            </nav>
          </div>

          {/* Workspace Section */}
          <CollapsibleSection
            title="Workspace"
            isExpanded={expandedSections.workspace}
            onToggle={() => toggleSection('workspace')}
          >
            <nav className="space-y-1">
              <SidebarItem
                icon={<FolderOpen size={16} />}
                label="Projects"
                isActive={isActive('/projects')}
                onClick={() => handleMenuClick('projects')}
              />
              <SidebarItem
                icon={<Eye size={16} />}
                label="Views"
                isActive={isActive('/views')}
                onClick={() => handleMenuClick('views')}
              />
              <SidebarItem
                icon={<MoreHorizontal size={16} />}
                label="More"
                isActive={isActive('/more')}
                onClick={() => handleMenuClick('more')}
              />
            </nav>
          </CollapsibleSection>

          {/* Teams Section */}
          <CollapsibleSection
            title="Teams"
            isExpanded={expandedSections.teams}
            onToggle={() => toggleSection('teams')}
          >
            <div className="space-y-1">
            <TeamsSection 
              teams={[{
                id: '1',
                name: 'StartingNew',
                color: '#8b5cf6'
              }]} 
              onNavigate={handleMenuClick}
              expandedTeams={expandedTeams}
              onToggleTeam={toggleTeam}
            />
            </div>
          </CollapsibleSection>

          {/* Try Section */}
          <CollapsibleSection
            title="Try"
            isExpanded={expandedSections.try}
            onToggle={() => toggleSection('try')}
          >
            <nav className="space-y-1">
              <SidebarItem
                icon={<Import size={16} />}
                label="Import issues"
                onClick={() => handleMenuClick('import')}
              />
              <SidebarItem
                icon={<UserPlus size={16} />}
                label="Invite people"
                onClick={() => handleMenuClick('invite')}
              />
            </nav>
          </CollapsibleSection>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-3 py-2 border-t border-border">
        <nav className="space-y-1">
          <SidebarItem
            icon={<HelpCircle size={16} />}
            label="Help"
            onClick={() => console.log('Help clicked')}
          />
          
          {/* Profile Section */}
          <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-accent/50 transition-all duration-200 cursor-pointer">
            <div className="flex items-center gap-2">
              <Avatar className="w-[18px] h-[18px]">
                <AvatarFallback className="text-xs">U</AvatarFallback>
              </Avatar>
              <span className="text-sm text-foreground">Profile</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto"
              onClick={() => console.log('Theme toggle')}
            >
              <span className="text-sm">🌙</span>
            </Button>
          </div>
          
          <SidebarItem
            icon={<LogOut size={16} />}
            label="Logout"
            onClick={handleLogout}
          />
        </nav>
      </div>
    </aside>
  )
}