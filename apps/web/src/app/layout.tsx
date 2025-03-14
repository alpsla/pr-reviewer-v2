import "./globals.css";
import "./global.css";
import "../styles/select-fixes.css";
import "../styles/layout-fix.css";
import "../styles/footer-fix.css";
import "../styles/button-fix.css";
import { AuthProvider } from "@/context/auth-context";
// Email authentication removed
import { ThemeProvider } from "@/components/theme-provider";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CodeQual",
  description: "AI-Powered Code Review",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon-option3-fixed.svg" />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-background antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}