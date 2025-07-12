// frontend/src/features/more/More.jsx
import React from 'react';
import { Settings, Users, Bell, Shield, HelpCircle, MoreHorizontal } from 'lucide-react';
import { useWorkspace } from '../../providers/WorkspaceContext';

function MoreOptions() {
  const { selectedWorkspace } = useWorkspace();

  const moreOptions = [
    {
      icon: <Settings size={20} />,
      title: 'Workspace Settings',
      description: 'Manage workspace preferences and configuration',
      action: () => console.log('Workspace settings')
    },
    {
      icon: <Users size={20} />,
      title: 'Members & Permissions',
      description: 'Manage team members and their access levels',
      action: () => console.log('Members')
    },
    {
      icon: <Bell size={20} />,
      title: 'Notifications',
      description: 'Configure notification preferences',
      action: () => console.log('Notifications')
    },
    {
      icon: <Shield size={20} />,
      title: 'Security',
      description: 'Security settings and audit logs',
      action: () => console.log('Security')
    },
    {
      icon: <HelpCircle size={20} />,
      title: 'Help & Support',
      description: 'Get help and contact support',
      action: () => console.log('Help')
    }
  ];

  return (
    <div className="flex flex-col h-full bg-primary">
      {/* Page Header */}
      <div className="flex items-center justify-between p-6 border-b border-border-primary">
        <div className="flex items-center gap-4">
          <MoreHorizontal size={24} className="text-primary" />
          <h1 className="text-2xl font-semibold text-primary">More</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-4">
          {moreOptions.map((option, index) => (
            <button
              key={index}
              onClick={option.action}
              className="w-full p-4 bg-bg-secondary rounded-lg border border-border-primary hover:border-border-secondary transition-colors text-left"
            >
              <div className="flex items-start gap-4">
                <div className="text-secondary">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary mb-1">{option.title}</h3>
                  <p className="text-secondary">{option.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MoreOptions;