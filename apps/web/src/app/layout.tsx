import "./globals.css";
import { EmailNotificationProvider } from "@/context/email-notification-context";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PR Reviewer",
  description: "Review your pull requests with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-background antialiased">
        <EmailNotificationProvider>
          {children}
        </EmailNotificationProvider>
      </body>
    </html>
  );
}