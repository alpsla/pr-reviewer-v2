'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/lib/providers/supabase-provider';

export function DashboardLink() {
  const { user, isLoading } = useSupabase();
  const [hasAuth, setHasAuth] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated once loading is complete
    if (!isLoading) {
      setHasAuth(!!user);
    }
  }, [user, isLoading]);

  const navigateToDashboard = () => {
    // Force direct navigation with timestamp to prevent caching
    window.location.href = `/dashboard?direct=true&t=${Date.now()}`;
  };

  return (
    <div className="mt-8">
      <button
        onClick={navigateToDashboard}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? 'Checking Auth...' : hasAuth ? 'Go to Dashboard' : 'Sign In Required'}
      </button>
      
      {!isLoading && !hasAuth && (
        <p className="text-red-500 mt-2 text-sm">
          You need to sign in first to access the dashboard.
        </p>
      )}

      {!isLoading && hasAuth && (
        <p className="text-green-500 mt-2 text-sm">
          You&apos;re signed in! Click to enter dashboard.
        </p>
      )}
    </div>
  );
}
