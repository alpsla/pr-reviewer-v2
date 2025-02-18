'use client';

import { useState } from "react";

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
import { authService } from '@/lib/auth/init';
import { logger } from '@/lib/utils/logger';

export function ProvidersMenu() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleGitHubSignIn = async () => {
    try {
      logger.log('Starting GitHub sign-in process with callback:', process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL);
      setIsLoading(true);
      const signInResult = await authService.signInWithGitHub();
      logger.log('GitHub sign-in initiated:', signInResult);
    } catch (error) {
      logger.error('Error signing in with GitHub:', error);
      if (error instanceof Error) {
        logger.error('Error details:', error.message);
        if ('stack' in error) {
          logger.error('Stack trace:', error.stack);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitLabSignIn = async () => {
    try {
      setIsLoading(true);
      await authService.signInWithGitLab();
    } catch (error) {
      logger.error('Error signing in with GitLab:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // These handlers are commented out for Phase 1 MVP to reduce testing scope
  // Will be re-enabled in Phase 2 based on enterprise customer needs
  /*
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await authService.signInWithGoogle({
        redirectTo: `${window.location.origin}/auth/callback`
      });
    } catch (error) {
      console.error('Error signing in with Google:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      setIsLoading(true);
      await authService.signInWithMicrosoft({
        redirectTo: `${window.location.origin}/auth/callback`
      });
    } catch (error) {
      console.error('Error signing in with Microsoft:', error);
    } finally {
      setIsLoading(false);
    }
  };
  */

  const handleEmailSignIn = () => {
    setIsEmailModalOpen(true);
  };

  const handleEmailSuccess = (_emailAddress: string) => {
    setIsEmailSent(true);
    setIsEmailModalOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="hidden md:inline-flex">
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

          {/* 
          Google and Azure providers commented out for Phase 1 MVP.
          Will be re-enabled in Phase 2 based on enterprise customer needs.
          */}

          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleEmailSignIn} 
            className="cursor-pointer"
            disabled={isLoading || isEmailSent}
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