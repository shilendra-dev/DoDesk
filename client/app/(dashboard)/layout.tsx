import { Sidebar } from "@/components/layout/Sidebar";
import WorkspaceBootstrap from "@/components/WorkspaceBootstrap";
import { GlobalModals } from "@/components/ui/organisms/GlobalModals";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {


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