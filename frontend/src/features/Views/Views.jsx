// frontend/src/features/views/Views.jsx
import React, { useState, useEffect } from 'react';
import { Filter, Plus, Eye } from 'lucide-react';
import { useWorkspace } from '../../providers/WorkspaceContext';

function Views() {
  const { selectedWorkspace } = useWorkspace();
  const [views, setViews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchViews();
  }, [selectedWorkspace]);

  const fetchViews = async () => {
    try {
      setLoading(true);
      // TODO: Implement views API call
      setViews([]);
    } catch (error) {
      console.error('Error fetching views:', error);
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
            <p className="text-secondary">Loading views...</p>
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
          <Eye size={24} className="text-primary" />
          <h1 className="text-2xl font-semibold text-primary">Views</h1>
          <span className="text-sm text-secondary">
            {views.length} {views.length === 1 ? 'view' : 'views'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-accent-primary text-white px-3 py-1.5 rounded-lg hover:bg-accent-secondary transition-colors">
            <Plus size={16} />
            <span>New view</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {views.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-24 h-24 bg-bg-secondary rounded-full flex items-center justify-center mb-4">
              <Eye size={32} className="text-secondary" />
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">No custom views</h2>
            <p className="text-secondary mb-4">
              Create custom views to filter and organize your tasks exactly how you want.
            </p>
            <button className="flex items-center gap-2 bg-accent-primary text-white px-4 py-2 rounded-lg hover:bg-accent-secondary transition-colors">
              <Plus size={16} />
              <span>Create view</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {views.map((view, index) => (
              <div key={index} className="p-4 bg-bg-secondary rounded-lg border border-border-primary hover:border-border-secondary transition-colors cursor-pointer">
                <h3 className="text-lg font-semibold text-primary mb-2">{view.name}</h3>
                <p className="text-secondary">{view.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Views;