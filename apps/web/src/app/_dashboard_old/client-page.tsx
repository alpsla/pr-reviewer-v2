'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitPullRequest, History, Settings } from "lucide-react";
import Link from "next/link";
import { DashboardNav } from '@/components/layout/dashboard-nav';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClientComponentClient();
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          setUser(data.session.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);
  
  if (loading) {
    return (
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p>Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container py-10 text-center">
        <p>Please sign in to access the dashboard</p>
        <Link href="/auth/signin">
          <Button className="mt-4">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
        <DashboardNav />
      </aside>
      <main className="flex w-full flex-col overflow-hidden py-6">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
            </h2>
            <p className="text-muted-foreground">
              Get started by analyzing a pull request or checking your recent activity.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <GitPullRequest className="h-5 w-5" />
                  PR Analyzer
                </CardTitle>
                <CardDescription>
                  Analyze your pull requests with AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get AI-powered feedback on your code changes.
                  Identify bugs, security issues, and improvement opportunities.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/pr-analyzer" className="w-full">
                  <Button className="w-full">
                    Analyze PRs
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  View your analysis history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access your previously analyzed pull requests
                  and review the feedback history.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/history" className="w-full">
                  <Button variant="outline" className="w-full">
                    View History
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </CardTitle>
                <CardDescription>
                  Configure your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage your connections, preferences,
                  and customize your analysis settings.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/settings" className="w-full">
                  <Button variant="outline" className="w-full">
                    Manage Settings
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}