import { ReactNode } from "react";
import { Metadata } from "next";
import { SiteHeaderWithAuth } from "@/components/layout/site-header-with-auth";
import ClientDashboardWrapper from "@/components/wrappers/client-dashboard-wrapper";

export const metadata: Metadata = {
  title: "Dashboard | PR Reviewer",
  description: "AI-powered code review for your pull requests"
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeaderWithAuth />
      <ClientDashboardWrapper>
        {children}
      </ClientDashboardWrapper>
    </div>
  );
}
