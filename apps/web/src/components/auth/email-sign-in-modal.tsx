'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

interface EmailSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export function EmailSignInModal({ isOpen, onClose, onSuccess }: EmailSignInModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();
  const supabase = createClientComponentClient();

  // Listen for auth completion across tabs/windows
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleAuthComplete = (event: MessageEvent) => {
      if (event.data === 'auth_complete' && event.origin === window.location.origin) {
        onClose();
        router.push('/dashboard');
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_complete_time') {
        onClose();
        router.push('/dashboard');
      }
    };

    const handleBroadcastMessage = (e: MessageEvent) => {
      if (e.data === 'auth_complete') {
        onClose();
        router.push('/dashboard');
      }
    };

    let bc: BroadcastChannel | null = null;

    if (typeof window !== 'undefined') {
      // Window message listener
      window.addEventListener('message', handleAuthComplete);
      
      // Storage event listener
      window.addEventListener('storage', handleStorageChange);
      
      // Broadcast channel listener
      bc = new BroadcastChannel('auth_channel');
      bc.onmessage = handleBroadcastMessage;

      // Check if auth was already completed
      const lastAuthTime = localStorage.getItem('auth_complete_time');
      if (lastAuthTime) {
        const timeDiff = Date.now() - parseInt(lastAuthTime, 10);
        if (timeDiff < 5000) {
          // Within last 5 seconds
          onClose();
          router.push('/dashboard');
        }
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handleAuthComplete);
        window.removeEventListener('storage', handleStorageChange);
        if (bc) {bc.close()}
      }
    };
  }, [isOpen, onClose, router]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setError('');
      setIsMagicLinkSent(false);
      setIsCheckingUser(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
    setError('Please enter your email address');
    return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsLoading(true);
    setIsCheckingUser(true);
    
    try {
      setError('');
      setIsLoading(true);
      setIsCheckingUser(true);
      
      await signIn('email', email);
      
      setIsMagicLinkSent(true);
      onSuccess(email);
    } catch (err: any) {
      console.error('Error sending magic link:', err);
      
      if (err?.message?.includes('can only request this after')) {
        const seconds = parseInt(err.message.match(/\d+/)?.[0] || '60', 10);
        setError(`Please wait ${seconds} seconds before requesting another magic link`);
      } else {
        setError(err?.message || 'Failed to send sign-in link. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setIsCheckingUser(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {onClose()}
      }}
    >
      <DialogContent className="sm:max-w-[425px] bg-white shadow-lg border-0">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-semibold text-foreground">
            {isMagicLinkSent ? 'Check Your Email' : 'Sign in with Email'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm mt-1">
            {isMagicLinkSent
              ? `We've sent a magic link to ${email}. Click it to sign in.`
              : "We'll send you a magic link to your email address. No password required."}
          </DialogDescription>
        </DialogHeader>
        
        {isMagicLinkSent ? (
          <div className="py-6">
            <Alert className="mb-4 bg-blue-50 border-blue-200 text-blue-800">
              <AlertDescription>
                <div className="space-y-3">
                  <p className="font-medium">
                    <strong>Magic link sent!</strong> Please check your inbox to continue.
                  </p>
                  <p>
                    <strong>Important:</strong> The link will be sent from <strong>noreply@mail.app.supabase.io</strong>
                  </p>
                  <p>
                    If you don&apos;t see the email in a minute or two, check your spam folder.
                  </p>
                  <p>
                    When you click the link in the email, you&apos;ll be automatically signed in and this window will close.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    You can safely close this window after clicking the magic link in your email.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center justify-center mt-6">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                onClick={() => {
                  const domain = email.split('@')[1]?.toLowerCase();
                  const commonEmailProviders: Record<string, string> = {
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
                  
                  const emailUrl = domain ? commonEmailProviders[domain] : null;
                  if (emailUrl) {
                    window.open(emailUrl, '_blank');
                  }
                }}
              >
                Open Email Provider
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSubmit(e)}
                disabled={isLoading}
                className="bg-background border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
              {error && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                type="button"
                className="border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="default" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2" 
                disabled={isLoading}
              >
                {isLoading ? (isCheckingUser ? 'Checking...' : 'Sending...') : 'Continue with Email'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}