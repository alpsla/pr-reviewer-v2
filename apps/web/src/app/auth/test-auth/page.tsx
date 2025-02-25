'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function TestAuthPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check environment variables
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set',
      NEXT_PUBLIC_AUTH_CALLBACK_URL: process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL || 'Not set',
    });
    
    setIsLoading(false);
  }, []);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }
    
    setMessage('Sending magic link...');
    setIsLoading(true);
    
    try {
      const supabase = createClientComponentClient();
      const { error, data } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Error sending magic link:', error);
        setMessage(`Error: ${error.message}`);
      } else {
        console.log('Magic link sent successfully:', data);
        setMessage(`Magic link sent to ${email}. Please check your inbox.`);
      }
    } catch (err) {
      console.error('Exception sending magic link:', err);
      setMessage(`Exception: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Email Authentication Test</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
        <ul className="space-y-1">
          {Object.entries(envVars).map(([key, value]) => (
            <li key={key} className="flex justify-between">
              <span className="font-mono text-sm">{key}</span>
              <span className="font-mono text-sm">{value}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Magic Link'}
        </button>
        
        {message && (
          <div className="p-4 bg-gray-100 rounded">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
