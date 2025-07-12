// frontend/src/shared/components/organisms/Sidebar.jsx
import React, { useState } from 'react';
import {
  Home, ListTodo, CalendarDays, BarChart2, Users, Settings,
  HelpCircle, LogOut, Search, Plus, ChevronDown, ChevronRight,
  Inbox, Target, FolderOpen, Eye, MoreHorizontal, Import, UserPlus
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import WorkspaceDropdown from "../../../features/workspace/WorkspaceDropdown";
import { useWorkspace } from "../../../providers/WorkspaceContext";
import { useTheme } from "../../../providers/ThemeContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { selectedWorkspace } = useWorkspace();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const [expandedSections, setExpandedSections] = useState({
    workspace: true,
    teams: true,
    try: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleMenuClick = (path) => {
    navigate(`/${selectedWorkspace.id}/${path}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("workspaces");
    navigate("/");
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <aside className="w-[240px] h-screen bg-bg-secondary flex flex-col overflow-hidden">
      {/* Workspace Section */}
      <div className="px-3 py-2 border-border-tertiary">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <WorkspaceDropdown />
          </div>
          <button 
            className="p-1.5 rounded hover:bg-[var(--color-bg-hover)] transition-all duration-200"
            onClick={() => console.log('Search clicked')}
          >
            <Search size={16} className="text-secondary hover:text-[var(--color-text-primary)] transition-colors" />
          </button>
          <button 
            className="p-1.5 rounded hover:bg-[var(--color-bg-hover)] transition-all duration-200"
            onClick={() => handleMenuClick('tasks')}
          >
            <Plus size={16} className="text-secondary hover:text-[var(--color-text-primary)] transition-colors" />
          </button>
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
                isActive={isActive('/tasks')}
                onClick={() => handleMenuClick('tasks')}
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
            title="Your teams"
            isExpanded={expandedSections.teams}
            onToggle={() => toggleSection('teams')}
          >
            <div className="space-y-1">
              <TeamDropdown
                name="StartingNew"
                color="#8b5cf6"
                isExpanded={true}
                onNavigate={handleMenuClick}
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
      <div className="px-3 py-2">
        <nav className="space-y-1">
          <SidebarItem
            icon={<HelpCircle size={16} />}
            label="Help"
            onClick={() => console.log('Help clicked')}
          />
          <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-[var(--color-bg-hover)] transition-all duration-200 cursor-pointer">
            <div className="flex items-center gap-2">
              <Avatar sx={{ width: 18, height: 18 }} />
              <span className="text-sm text-primary">Profile</span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-1 rounded hover:bg-[var(--color-bg-hover)] transition-all duration-200"
            >
              <span className="text-sm">{theme === 'dark' ? '🌙' : '☀️'}</span>
            </button>
          </div>
          <SidebarItem
            icon={<LogOut size={16} />}
            label="Logout"
            onClick={handleLogout}
          />
        </nav>
      </div>
    </aside>
  );
}

// Balanced Helper Components
function CollapsibleSection({ title, isExpanded, onToggle, children }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-2 py-1 text-xs font-medium text-secondary uppercase tracking-wider hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] rounded transition-all duration-200"
      >
        {isExpanded ? (
          <ChevronDown size={12} />
        ) : (
          <ChevronRight size={12} />
        )}
        <span>{title}</span>
      </button>
      {isExpanded && (
        <div className="mt-2 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

function SidebarItem({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2 py-1 rounded text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bg-[var(--color-bg-hover)] text-primary font-semibold'
          : 'text-secondary hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
      }`}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
}

function TeamDropdown({ name, color, isExpanded, onNavigate }) {
  return (
    <div className="space-y-1">
      <button className="w-full flex items-center gap-2.5 px-2 py-1 rounded text-sm font-medium text-secondary hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-all duration-200">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="flex-1 text-left">{name}</span>
        <ChevronDown size={12} />
      </button>
      {isExpanded && (
        <div className="ml-5 space-y-1">
          <SidebarItem
            icon={<ListTodo size={16} />}
            label="Issues"
            onClick={() => onNavigate('team/issues')}
          />
          <SidebarItem
            icon={<FolderOpen size={16} />}
            label="Projects"
            onClick={() => onNavigate('team/projects')}
          />
          <SidebarItem
            icon={<Eye size={16} />}
            label="Views"
            onClick={() => onNavigate('team/views')}
          />
        </div>
      )}
    </div>
  );
}