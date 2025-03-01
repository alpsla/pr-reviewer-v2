'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SiteHeaderWithAuth } from "@/components/layout/site-header-with-auth";
import { useSearchParams } from 'next/navigation';
import { useEmailNotification } from '@/context/email-notification-context';

export default function SimplePage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const { showEmailNotification } = useEmailNotification();
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const supabase = createClientComponentClient();
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  // Check for email parameters and show notification if present
  useEffect(() => {
    const email = searchParams.get('email');
    const emailSent = searchParams.get('email_sent');
    
    if (email && emailSent === 'true' && !emailVerificationSent) {
      showEmailNotification(email);
      setEmailVerificationSent(true);
      
      // Remove the query params from the URL without refreshing the page
      if (typeof window !== 'undefined') {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, [searchParams, showEmailNotification, emailVerificationSent]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeaderWithAuth />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeaderWithAuth />
      <div className="flex-1 p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">PR Reviewer</h1>
          
          {session ? (
            <div>
              <p className="mb-4">Welcome, {session.user.email || 'User'}!</p>
              <p className="text-lg mb-4">Navigate to one of these pages:</p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <a href="/dashboard" className="p-4 bg-card rounded-lg shadow hover:shadow-md transition-shadow">
                  <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
                  <p className="text-muted-foreground">View your dashboard and recent activity</p>
                </a>
                <a href="/dashboard/pr-analyzer" className="p-4 bg-card rounded-lg shadow hover:shadow-md transition-shadow">
                  <h2 className="text-xl font-semibold mb-2">PR Analyzer</h2>
                  <p className="text-muted-foreground">Analyze your pull requests with AI</p>
                </a>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-lg mb-6">
                Welcome to PR Reviewer, an AI-powered code review tool for your GitHub and GitLab 
                pull requests.
              </p>
              <p className="mb-6">
                Sign in to get started with automated code reviews, best practices suggestions, 
                and insightful analysis of your code changes.
              </p>
              <p>
                Use the &ldquo;Join Us&rdquo; button in the header to sign in with GitHub, GitLab, or Email.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
