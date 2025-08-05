'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import {
  Inbox, Target, UserPlus,
  Search, Plus, LogOut,
  Users
} from 'lucide-react'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { Avatar, AvatarFallback } from '@/components/ui/atoms/avatar'
import { Button } from '@/components/ui/atoms/button'
import { WorkspaceDropdown } from './WorkspaceDropdown'
import { CollapsibleSection } from './CollapsibleSection'
import { SidebarItem } from './SidebarItem'
import { TeamsSection } from './TeamSection'
import { useTheme } from '@/providers/ThemeContext'
import { useSession } from "@/lib/auth-client"
import { useModalStore } from '@/stores/modalStore'
import {toast} from 'react-hot-toast'

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace)
  const teams = useWorkspaceStore((state) => state.teams)
  const { toggleTheme } = useTheme()
  const { data: session } = useSession()
  const { openCreateIssue } = useModalStore()
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
    await signOut()
  }

  // Check if current path is active
  const isActive = (path: string) => pathname.includes(path)

  return (
    <aside className="w-[240px] h-screen bg-background flex flex-col overflow-hidden">
      {/* Workspace Section */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <WorkspaceDropdown />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-1.5 h-auto"
            onClick={() => {
              console.log('Search clicked')
              toast.error('This feature is coming soon')
            }}
          >
            <Search size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-1.5 h-auto"
            onClick={openCreateIssue}
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
                onClick={() => {
                  //handleMenuClick('inbox')
                  toast.error('This feature is coming soon')
                }}
              />
              <SidebarItem
                icon={<Target size={16} />}
                label="My issues"
                isActive={isActive('/myissues')}
                onClick={() => handleMenuClick('myissues')}
              />
              <SidebarItem
                icon={<Users size={16} />}
                label="Teams"
                isActive={isActive('/teams')}
                onClick={() => handleMenuClick('teams')}
              />
            </nav>
          </div>

          {/* Workspace Section */}
          {/* <CollapsibleSection
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
          </CollapsibleSection> */}

          {/* Teams Section */}
          <CollapsibleSection
            title="Teams"
            isExpanded={expandedSections.teams}
            onToggle={() => toggleSection('teams')}
          >
            <div className="space-y-1">
            <TeamsSection 
              teams={teams} 
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
                icon={<UserPlus size={16} />}
                label="Invite people"
                onClick={() => toast.error('This feature is coming soon')}
              />
            </nav>
          </CollapsibleSection>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-3 py-2">
        <nav className="space-y-1">
          {/*
          <SidebarItem
            icon={<HelpCircle size={16} />}
            label="Help"
            onClick={() => console.log('Help clicked')}
          />
          */}
          
          {/* Profile Section */}
          <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-accent/50 transition-all duration-200 cursor-pointer">
            <div className="flex items-center gap-2">
              <Avatar className="w-[18px] h-[18px]">
                <AvatarFallback className="text-xs">
                  {session?.user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-foreground">
                {session?.user?.name || "Profile"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto"
              onClick={() => toggleTheme()}
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