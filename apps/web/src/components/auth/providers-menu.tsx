'use client';

import { useState, useEffect } from "react";

import { GitHubIcon, GitLabIcon, EmailIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { EmailSignInModal } from "@/components/auth/email-sign-in-modal";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEmailNotification } from "@/context/email-notification-context";

export function ProvidersMenu() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const { showEmailNotification } = useEmailNotification();

  // Reset email sent status after a timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isEmailSent) {
      timeoutId = setTimeout(() => {
        setIsEmailSent(false);
      }, 30000); // Reset after 30 seconds
    }
    
    return () => {
      if (timeoutId) { clearTimeout(timeoutId); }
    };
  }, [isEmailSent]);

  const handleGitHubSignIn = async () => {
    try {
      console.log('Starting GitHub sign-in process');
      setIsLoading(true);
      const supabase = createClientComponentClient();
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'read:user repo'
        }
      });
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitLabSignIn = async () => {
    try {
      setIsLoading(true);
      const supabase = createClientComponentClient();
      await supabase.auth.signInWithOAuth({
        provider: 'gitlab',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'read_user'
        }
      });
    } catch (error) {
      console.error('Error signing in with GitLab:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = () => {
    setIsEmailModalOpen(true);
  };

  const handleEmailSuccess = (emailAddress: string) => {
    console.log(`Magic link sent to ${emailAddress}`);
    setIsEmailSent(true);
    // Do NOT close the modal after sending the email
    // The modal will now show instructions instead
    // setIsEmailModalOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="hidden md:inline-flex bg-blue-500 hover:bg-blue-600 text-white border-blue-500">
            Join Us
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem 
            onClick={handleGitHubSignIn} 
            className="cursor-pointer"
            disabled={isLoading}
          >
            <GitHubIcon className="mr-2 h-4 w-4" />
            <span>{isLoading ? 'Loading...' : 'Continue with GitHub'}</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={handleGitLabSignIn} 
            className="cursor-pointer"
            disabled={isLoading}
          >
            <GitLabIcon className="mr-2 h-4 w-4" />
            <span>Continue with GitLab</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleEmailSignIn} 
            className="cursor-pointer"
            disabled={isLoading}
          >
            <EmailIcon className="mr-2 h-4 w-4" />
            <span>
              {isLoading ? 'Sending...' : 
               isEmailSent ? `Check your email` :
               'Sign in with Email'}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EmailSignInModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSuccess={handleEmailSuccess}
      />
    </>
  );
}