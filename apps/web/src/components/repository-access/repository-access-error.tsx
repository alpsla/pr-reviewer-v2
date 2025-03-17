'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle, LogOut, Lock, LogIn, Github, Gitlab, XCircle } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export interface RepositoryAccessErrorProps {
  error: string;
  isPrivate?: boolean;
  platform?: 'github' | 'gitlab';
  owner?: string;
  repo?: string;
  currentUser?: {
    username?: string;
    provider?: string;
  };
  onRetry?: () => void;
}

export function RepositoryAccessError({
  error,
  isPrivate = true,
  platform,
  owner,
  repo,
  currentUser,
  onRetry
}: RepositoryAccessErrorProps) {
  // Use the auth context
  const { signOut, signIn } = useAuth();
  
  // Determine if this appears to be a cross-platform access attempt
  const isCrossPlatformAccess = 
    platform && currentUser?.provider && 
    platform !== currentUser.provider;
  
  // Handle sign out and sign in
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };
  
  const handleSignIn = async (provider: 'github' | 'gitlab') => {
    try {
      await signIn(provider);
    } catch (err) {
      console.error(`Error signing in with ${provider}:`, err);
    }
  };
  
  const platformName = platform === 'github' ? 'GitHub' : platform === 'gitlab' ? 'GitLab' : 'Git';
  const icon = platform === 'github' ? <Github className="h-4 w-4 mr-2" /> : <Gitlab className="h-4 w-4 mr-2" />;
  
  return (
    <div className="border border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900/50 p-4 rounded-md">
      <div className="flex items-start mb-4">
        <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2 flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 mr-2 text-red-500 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            Repository Access Denied
          </h3>
          <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
        </div>
      </div>
      
      {isPrivate && (
        <div className="mb-4 bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-slate-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300">Private Repository</span>
          </div>
          
          {platform && owner && repo && (
            <div className="flex items-center p-2 bg-slate-100 dark:bg-slate-700/50 rounded text-sm">
              {icon}
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {platformName} / {owner} / {repo}
              </span>
            </div>
          )}
          
          <p className="text-sm mt-3 text-slate-600 dark:text-slate-400">
            This is a private {platformName} repository and you don't have access with your current credentials.
            Please sign in with a {platformName} account that has permission to view this repository.
          </p>
        </div>
      )}
      
      {currentUser && (
        <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
          <p>
            Currently signed in as: <span className="font-medium">{currentUser.username || 'Not signed in'}</span>
            {currentUser.provider && (
              <span className="ml-1">({currentUser.provider})</span>
            )}
          </p>
          
          {isCrossPlatformAccess && (
            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
              <p className="text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> You're signed in with {currentUser.provider} but trying to access a {platform} repository.
              </p>
            </div>
          )}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mt-3">
        <Button
          variant="outline" 
          size="sm"
          onClick={handleSignOut}
          className="bg-white dark:bg-slate-800"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
        
        {platform === 'github' && (
          <Button 
            size="sm" 
            className="bg-gray-800 hover:bg-gray-900 text-white"
            onClick={() => handleSignIn('github')}
          >
            <Github className="h-4 w-4 mr-2" />
            Sign in with GitHub
          </Button>
        )}
        
        {platform === 'gitlab' && (
          <Button 
            size="sm" 
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => handleSignIn('gitlab')}
          >
            <Gitlab className="h-4 w-4 mr-2" />
            Sign in with GitLab
          </Button>
        )}
        
        {onRetry && (
          <Button onClick={onRetry} variant="secondary" size="sm">
            <LogIn className="h-4 w-4 mr-2" />
            Retry Verification
          </Button>
        )}
      </div>
    </div>
  );
}

// Also export an index.ts file for easier imports
export * from './repository-access-error';
