export interface Workspace {
    id: string;
    name: string;
    slug: string;
}

export interface WorkspaceContextType {
    currentWorkspace: Workspace | null
    switchWorkspace: (workspaceSlug: string) => void
    getDefaultWorkspace: () => Workspace | null
    getWorkspaceBySlug: (slug: string) => Workspace | null
    isLoading: boolean
    workspaces: Workspace[]
}