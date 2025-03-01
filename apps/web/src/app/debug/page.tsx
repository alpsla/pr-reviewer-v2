'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';

export default function DebugPage() {
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [cookieInfo, setCookieInfo] = useState<any>(null);
  const [localStorageInfo, setLocalStorageInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      // Check Supabase session
      const supabase = createClientComponentClient();
      const { data } = await supabase.auth.getSession();
      setSessionInfo(data);
      
      // Get cookies
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=');
        if (name && name.includes('sb-')) {
          acc[name] = value;
        }
        return acc;
      }, {} as Record<string, string>);
      setCookieInfo(cookies);
      
      // Get localStorage items
      const localStorage: Record<string, string> = {};
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.includes('sb-')) {
          localStorage[key] = window.localStorage.getItem(key) || '';
        }
      }
      setLocalStorageInfo(localStorage);
    } catch (error) {
      console.error('Error checking auth:', error);
      setMessage('Error checking auth status');
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllAuth = async () => {
    try {
      setMessage('Clearing auth data...');
      
      // 1. Clear browser storage
      Object.keys(window.localStorage).forEach(key => {
        if (key.startsWith('sb-')) {
          window.localStorage.removeItem(key);
        }
      });
      
      // 2. Clear cookies manually
      document.cookie.split(';').forEach(c => {
        const [name] = c.trim().split('=');
        if (name && name.includes('sb-')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
      
      // 3. Call our signout API
      await fetch('/auth/signout', {
        method: 'POST',
      });
      
      // 4. Force Supabase signout
      const supabase = createClientComponentClient();
      await supabase.auth.signOut({ scope: 'global' });
      
      setMessage('Auth data cleared. Refreshing...');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('Error clearing auth:', error);
      setMessage('Error clearing auth data: ' + String(error));
    }
  };

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="mb-4 flex items-center gap-4">
        <Button onClick={checkAuth} disabled={isLoading}>
          Refresh Auth Status
        </Button>
        <Button 
          onClick={clearAllAuth} 
          variant="destructive" 
          disabled={isLoading}
        >
          Force Clear All Auth Data
        </Button>
      </div>
      
      {message && (
        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded mb-6">
          {message}
        </div>
      )}
      
      {isLoading ? (
        <div>Loading auth data...</div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Session Status</h2>
            <div className="p-4 bg-gray-50 rounded overflow-auto max-h-60">
              <pre className="text-sm">{JSON.stringify(sessionInfo, null, 2)}</pre>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Auth Cookies</h2>
            <div className="p-4 bg-gray-50 rounded overflow-auto max-h-60">
              <pre className="text-sm">{JSON.stringify(cookieInfo, null, 2)}</pre>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Local Storage</h2>
            <div className="p-4 bg-gray-50 rounded overflow-auto max-h-60">
              <pre className="text-sm">{JSON.stringify(localStorageInfo, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}