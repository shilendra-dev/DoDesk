import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

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
  
  // if user needs onboarding
  if (!session.user.default_workspace_id) {
    redirect('/onboarding');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard-wide components can go here */}
      {children}
    </div>
  );
}