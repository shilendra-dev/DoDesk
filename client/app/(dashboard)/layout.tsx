import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import WorkspaceBootstrap from "@/components/WorkspaceBootstrap";
import { GlobalModals } from "@/components/ui/organisms/GlobalModals";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication Protection
  const session = await getServerSession(authOptions);
  
  if (!session) {
    // Redirect to signin with current path as callback
    redirect('/signin');
  }
  

  return (
    <div className="flex h-screen bg-background">
      <WorkspaceBootstrap />
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-visible">
        {children}
      </main>
      <GlobalModals />
    </div>
  );
}