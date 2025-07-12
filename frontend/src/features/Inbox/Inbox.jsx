// frontend/src/features/inbox/Inbox.jsx
import React, { useState, useEffect } from 'react';
import { Filter, LayoutGrid, List, Plus, Inbox as InboxIcon } from 'lucide-react';
import { useWorkspace } from '../../providers/WorkspaceContext';

function Inbox() {
  const { selectedWorkspace } = useWorkspace();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's notifications/assigned tasks
    fetchInboxItems();
  }, [selectedWorkspace]);

  const fetchInboxItems = async () => {
    try {
      setLoading(true);
      // TODO: Implement inbox API call
      // For now, simulate empty inbox
      setNotifications([]);
    } catch (error) {
      console.error('Error fetching inbox:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-primary">
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mx-auto mb-4"></div>
            <p className="text-secondary">Loading inbox...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-primary">
      {/* Page Header */}
      <div className="flex items-center justify-between p-6 border-b border-border-primary">
        <div className="flex items-center gap-4">
          <InboxIcon size={24} className="text-primary" />
          <h1 className="text-2xl font-semibold text-primary">Inbox</h1>
          <span className="text-sm text-secondary">
            {notifications.length} {notifications.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-bg-hover transition-colors">
            <Filter size={16} className="text-secondary" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-24 h-24 bg-bg-secondary rounded-full flex items-center justify-center mb-4">
              <InboxIcon size={32} className="text-secondary" />
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">No notifications</h2>
            <p className="text-secondary">
              You're all caught up! New notifications and assigned tasks will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item, index) => (
              <div key={index} className="p-4 bg-bg-secondary rounded-lg border border-border-primary">
                {/* Notification content */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Inbox;