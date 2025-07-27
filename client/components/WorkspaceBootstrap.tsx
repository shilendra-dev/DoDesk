'use client';

import { useEffect } from 'react';
import { useWorkspaceStore } from '@/stores/workspaceStore';

export default function WorkspaceBootstrap() {
  const fetchWorkspaces = useWorkspaceStore((state) => state.fetchWorkspaces);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return null;
}