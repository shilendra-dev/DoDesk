import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeContext";
import { ClientToaster } from "@/components/ui/organisms/ClientToaster";
import { AuthProvider } from "@/providers/auth-provider";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
          <ThemeProvider>
            <ClientToaster />
              <AuthProvider>
                {children}
              </AuthProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}