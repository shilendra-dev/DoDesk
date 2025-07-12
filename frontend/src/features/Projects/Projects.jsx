// frontend/src/features/projects/Projects.jsx
import React, { useState, useEffect } from 'react';
import { Filter, LayoutGrid, List, Plus, FolderOpen } from 'lucide-react';
import { useWorkspace } from '../../providers/WorkspaceContext';

function Projects() {
  const { selectedWorkspace } = useWorkspace();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [selectedWorkspace]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // TODO: Implement projects API call
      setProjects([]);
    } catch (error) {
      console.error('Error fetching projects:', error);
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
            <p className="text-secondary">Loading projects...</p>
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
          <FolderOpen size={24} className="text-primary" />
          <h1 className="text-2xl font-semibold text-primary">Projects</h1>
          <span className="text-sm text-secondary">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-bg-hover transition-colors">
            <Filter size={16} className="text-secondary" />
          </button>
          <button className="p-2 rounded-lg hover:bg-bg-hover transition-colors">
            <LayoutGrid size={16} className="text-secondary" />
          </button>
          <button className="flex items-center gap-2 bg-accent-primary text-white px-3 py-1.5 rounded-lg hover:bg-accent-secondary transition-colors">
            <Plus size={16} />
            <span>New project</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-24 h-24 bg-bg-secondary rounded-full flex items-center justify-center mb-4">
              <FolderOpen size={32} className="text-secondary" />
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">No projects yet</h2>
            <p className="text-secondary mb-4">
              Create your first project to organize your work and track progress.
            </p>
            <button className="flex items-center gap-2 bg-accent-primary text-white px-4 py-2 rounded-lg hover:bg-accent-secondary transition-colors">
              <Plus size={16} />
              <span>Create project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="p-6 bg-bg-secondary rounded-lg border border-border-primary hover:border-border-secondary transition-colors">
                <h3 className="text-lg font-semibold text-primary mb-2">{project.name}</h3>
                <p className="text-secondary mb-4">{project.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary">{project.taskCount} tasks</span>
                  <span className="text-secondary">{project.progress}% complete</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;