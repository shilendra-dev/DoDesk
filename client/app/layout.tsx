import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ThemeProvider } from "@/providers/ThemeContext";
import SessionProviderWrapper from "@/providers/SessionProviderWrapper";
import { WorkspaceProvider } from "@/providers/WorkspaceContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DoDesk - Workspace",
  description: "Open source project management tool for team collaboration",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <SessionProviderWrapper session={session}>
          <WorkspaceProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </WorkspaceProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}