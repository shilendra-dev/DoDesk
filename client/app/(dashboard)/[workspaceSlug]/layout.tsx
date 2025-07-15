
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { validateWorkspaceAccess } from "@/lib/workspace-helpers";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    workspaceSlug: string;
  }>;
}

export default async function WorkspaceLayout({ 
  children, 
  params 
}: WorkspaceLayoutProps) {
  const session = await getServerSession(authOptions);
  const resolvedParams = await params;
  
  // Double-check authentication (already protected by parent layout)
  if (!session) {
    redirect('/signin');
  }
  
  // Validate workspace access
  const isValidWorkspace = validateWorkspaceAccess(session, resolvedParams.workspaceSlug);
  
  if (!isValidWorkspace) {
    // Invalid workspace - redirect to default workspace
    const defaultWorkspace = session.user.workspaces?.find(
      ws => ws.id === session.user.default_workspace_id
    );
    
    if (defaultWorkspace) {
      redirect(`/${defaultWorkspace.slug}/myissues`);
    } else {
      redirect('/onboarding');
    }
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Workspace-specific layout components */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}