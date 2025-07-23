'use client'

import React from 'react'
import { ChevronDown, ListTodo } from 'lucide-react'
import { SidebarItem } from './SidebarItem'
import {toast} from 'react-hot-toast'

interface TeamDropdownProps {
    name: string
    color: string
    isExpanded: boolean
    onNavigate: (path: string) => void
    onToggle: () => void
}

export function TeamDropdown({
    name,
    color,
    isExpanded,
    // onNavigate,
    onToggle
}: TeamDropdownProps) {
    return (
        <div className="">
            <button 
                onClick={onToggle}
                className="w-full flex items-center gap-2.5 px-2 py-1 rounded text-sm font-medium text-accent-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
            >
                <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                />
                <span className="flex-1 text-left">{name}</span>
                <ChevronDown 
                    size={12} 
                    className={`transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : 'rotate-0'
                    }`}
                />
            </button>
            <div className={`ml-5 space-y-1 overflow-hidden transition-all duration-200 ${
                isExpanded 
                    ? 'max-h-32 opacity-100' 
                    : 'max-h-0 opacity-0'
            }`}>
                <SidebarItem
                    icon={<ListTodo size={16} />}
                    label="Issues"
                    onClick={() => {
                        //onNavigate('team/issues')
                        toast.error('This feature is coming soon')
                    }}
                />
                {/* <SidebarItem
                    icon={<FolderOpen size={16} />}
                    label="Projects"
                    onClick={() => onNavigate('team/projects')}
                /> */}
                {/* <SidebarItem
                    icon={<Eye size={16} />}
                    label="Views"
                    onClick={() => onNavigate('team/views')}
                /> */}
            </div>
        </div>
    )
}