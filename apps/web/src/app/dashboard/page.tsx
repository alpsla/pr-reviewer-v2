'use client';

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useSupabase } from "@/lib/providers/supabase-provider";

export default function DashboardPage() {
  const { user, signOut, isLoading } = useSupabase();
  const [authInfo, setAuthInfo] = useState<Record<string, string>>({});

  useEffect(() => {
    // Parse URL for debugging info
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const debugInfo: Record<string, string> = {};
      params.forEach((value, key) => {
        debugInfo[key] = value;
      });
      setAuthInfo(debugInfo);
      
      // eslint-disable-next-line no-console
      console.log('Dashboard mounted', { 
        isLoading, 
        hasUser: !!user,
        url: window.location.href,
        params: debugInfo
      });

      // If we're fully loaded and have no user, offer a manual redirect
      if (!isLoading && !user) {
        // eslint-disable-next-line no-console
        console.log('Dashboard: No authenticated user detected');
      }
    }
  }, [isLoading, user]);
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          {user ? (
            <p className="text-lg">Welcome, {user.email}</p>
          ) : (
            <p className="text-yellow-600">Loading user data...</p>
          )}
        </div>
        
        <div className="mt-4 md:mt-0 p-4 bg-gray-50 rounded-md">
          <h2 className="font-semibold mb-2">Auth Status:</h2>
          <p className="mb-2">Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p className="mb-4">User: {user ? `Authenticated (${user.email})` : 'Not logged in'}</p>
          
          {Object.keys(authInfo).length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium">URL Parameters:</h3>
              <ul className="text-sm">
                {Object.entries(authInfo).map(([key, value]) => (
                  <li key={key}><span className="font-mono">{key}</span>: {value}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex space-x-2">
            <Button 
              variant="destructive" 
              onClick={() => {
                // eslint-disable-next-line no-console
                console.log('Sign out button clicked, user:', user?.id);
                signOut().catch(err => {
                  // eslint-disable-next-line no-console
                  console.error('Error during sign out:', err);
                });
              }}
              disabled={isLoading || !user}
              className="font-medium"
            >
              Sign Out
            </Button>
            
            <a 
              href="/"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 inline-flex items-center justify-center text-sm"
            >
              Home
            </a>
          </div>
          
          {user && (
            <div className="mt-4 text-xs text-gray-500">
              If sign out button doesn&apos;t work, try the
              <button 
                onClick={() => {
                  // eslint-disable-next-line no-console
                  console.log('Alternative sign out clicked');
                  // Clear auth data and redirect
                  if (typeof window !== 'undefined') {
                    // Clear Supabase cookies and storage
                    for (let i = localStorage.length - 1; i >= 0; i--) {
                      const key = localStorage.key(i);
                      if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
                        localStorage.removeItem(key);
                      }
                    }
                    // Redirect to home
                    window.location.href = '/?manual-signout=true';
                  }
                }}
                className="text-blue-500 ml-1 underline"
              >
                alternative sign out
              </button>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}