'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitPullRequest, History, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Broadcast authentication success to other tabs/windows
  useEffect(() => {
    // Only run when we have a valid user and we're in the browser
    if (!mounted || !user) {
      return;
    }
    
    const params = new URLSearchParams(window.location.search);
    const isAuthRedirect = params.get('auth_redirect') === 'true';
    
    if (isAuthRedirect) {
      // Remove the query parameter from the URL without a page reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // Broadcast to all open tabs that authentication is complete
      if (window.opener) {
        try {
          // If this window was opened from another window, tell the opener
          window.opener.postMessage('auth_complete', window.location.origin);
        } catch (e) {
          console.log('Could not communicate with opener window');
        }
      } else {
        // If this wasn't opened from another window, broadcast to all tabs
        // using localStorage as a communication channel
        window.localStorage.setItem('auth_complete_time', Date.now().toString());
      }
    }
  }, [user, mounted]);

  
  const handleSignOut = async () => {
    try {
      setLoading(true);
      const response = await fetch('/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Clear any local state
        setUser(null);
        
        // Also manually clear localStorage and sessionStorage
        if (mounted) {
          window.localStorage.clear();
          window.sessionStorage.clear();
        }
        
        // Redirect to home page
        router.push('/');
      } else {
        console.error('Failed to sign out');
      }
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Skip if not mounted yet
    if (!mounted) {
      return;
    }
    
    async function checkSession() {
      try {
        setLoading(true);
        const supabase = createClientComponentClient();
        
        // First, try to get the session
        const { data, error } = await supabase.auth.getSession();
        
        console.log('Dashboard session check:', { data, error });
        
        if (error) {
          console.error('Session error:', error);
          router.push('/');
          return;
        }
        
        if (!data.session) {
          console.log('No session found, redirecting to home');
          router.push('/');
          return;
        }
        
        // Additional check - verify that the user actually exists in Supabase
        // by calling getUser which will validate the token
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError || !userData.user) {
          console.error('User verification failed:', userError);
          // Clear any invalid session state
          await supabase.auth.signOut({ scope: 'global' });
          
          if (mounted) {
            window.localStorage.clear();
            window.sessionStorage.clear();
          }
          
          router.push('/');
          return;
        }
        
        setUser(userData.user);
      } catch (error) {
        console.error('Error checking session:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, [router, mounted]);

  // Show loading during SSR or while checking auth
  if (!mounted || loading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Welcome{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}!
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
  );
}