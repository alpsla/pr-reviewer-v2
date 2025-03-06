'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui";
import { ProvidersMenu } from "@/components/auth/providers-menu";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function SiteHeaderWithAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  
  // Check if the user is authenticated
  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClientComponentClient();
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuth();
  }, [pathname]); // Re-check when path changes
  
  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Clear browser storage
        if (typeof window !== 'undefined') {
          localStorage.clear();
          sessionStorage.clear();
        }
        
        // Redirect to home page
        router.push('/');
      } else {
        console.error('Failed to sign out');
      }
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">PR Reviewer</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-5">
            {isAuthenticated ? (
              <button 
              onClick={handleSignOut}
              disabled={isLoading}
              className="flex items-center gap-1 hidden md:inline-flex rounded-md p-3 bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" />
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </button>
            ) : (
              <ProvidersMenu />
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
