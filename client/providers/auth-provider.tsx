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

const publicPaths = ["/signin", "/signup", "/", "/forgot-password", "/reset-password"];

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

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading...</div>
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