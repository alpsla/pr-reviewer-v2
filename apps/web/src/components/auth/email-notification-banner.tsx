'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Mail, CheckCircle, ArrowRightCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface EmailNotificationBannerProps {
  email: string;
  isVisible: boolean;
  onDismiss: () => void;
}

export function EmailNotificationBanner({ email, isVisible, onDismiss }: EmailNotificationBannerProps) {
  const [showBanner, setShowBanner] = useState(isVisible);
  const [emailOpened, setEmailOpened] = useState(false);
  const [countdown, setCountdown] = useState(30);
  
  // Handle closing the banner
  const handleClose = useCallback(() => {
    setShowBanner(false);
    onDismiss();
  }, [onDismiss]);

  // Handle countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (showBanner && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [showBanner, countdown]);
  
  // Close banner when countdown finishes
  useEffect(() => {
    if (countdown === 0) {
      setTimeout(() => {
        handleClose();
      }, 1000);
    }
  }, [countdown, handleClose]);

  // Handle email provider links
  const getEmailLink = () => {
    const domain = email.split('@')[1]?.toLowerCase();
    
    if (!domain) {
      return null;
    }
    
    const commonEmailProviders: { [key: string]: string } = {
      'gmail.com': 'https://mail.google.com',
      'outlook.com': 'https://outlook.live.com/mail',
      'hotmail.com': 'https://outlook.live.com/mail',
      'live.com': 'https://outlook.live.com/mail',
      'yahoo.com': 'https://mail.yahoo.com',
      'icloud.com': 'https://www.icloud.com/mail',
      'protonmail.com': 'https://mail.proton.me',
      'aol.com': 'https://mail.aol.com',
      'zoho.com': 'https://mail.zoho.com'
    };
    
    return commonEmailProviders[domain] || null;
  };
  
  const emailLink = getEmailLink();
  
  const handleOpenEmail = () => {
    if (emailLink) {
      window.open(emailLink, '_blank', 'noopener,noreferrer');
      setEmailOpened(true);
    }
  };
  
  if (!showBanner) {
    return null;
  }
  
  return (
    <div className="fixed top-16 left-0 right-0 z-50 px-4 py-2 flex justify-center">
      <Alert className="max-w-2xl w-full bg-blue-50 border border-blue-200 shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-2">
            <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
            <AlertDescription className="text-sm text-blue-800">
              <div className="space-y-1">
                <p className="font-semibold">
                  {emailOpened 
                    ? "Check your inbox for the magic link" 
                    : `Magic link sent to ${email}`}
                </p>
                <p className="text-sm text-blue-700">
                  {emailOpened 
                    ? "Click the link in your email to complete the sign-in process. You can close this tab afterward." 
                    : "Check your email and click the magic link to sign in. If it opens in a new tab, you can close it after signing in."}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {emailLink && !emailOpened && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center space-x-1 text-xs"
                      onClick={handleOpenEmail}
                    >
                      <ArrowRightCircle className="h-3.5 w-3.5 mr-1" />
                      Open Email Provider
                    </Button>
                  )}
                  
                  {emailOpened && (
                    <div className="flex items-center text-xs text-green-700">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Email provider opened
                    </div>
                  )}
                  
                  <div className="text-xs text-blue-500">
                    Auto-hiding in {countdown}s
                  </div>
                </div>
              </div>
            </AlertDescription>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 rounded-full" 
            onClick={handleClose}
          >
            <X className="h-4 w-4 text-blue-700" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </Alert>
    </div>
  );
}