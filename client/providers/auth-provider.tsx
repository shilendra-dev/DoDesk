"use client";

import { createContext, useContext, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name?: string;
  } | null;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isAuthenticated: false,
  user: null,
});

const publicPaths = ["/signin", "/signup", "/", "/auth/forgotPassword", "/auth/resetPassword"];
const noGlobalLoadingPaths = [...publicPaths, "/auth/callback", "/onboarding"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending) {
      const isPublicPath = publicPaths.includes(pathname);
      
      // redirect to signin if not authenticated
      if (!session && !isPublicPath) {
        router.push("/signin");
      }
    }
  }, [session, isPending, pathname, router]);

  // Don't show global loading screen for certain paths that handle their own loading
  const shouldShowGlobalLoading = isPending && !noGlobalLoadingPaths.includes(pathname);
  
  if (shouldShowGlobalLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoading: isPending,
        isAuthenticated: !!session,
        user: session?.user || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);