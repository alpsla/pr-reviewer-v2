'use client';

import { useState } from 'react';
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
import { authService } from '@/lib/auth/init';
import { logger } from '@/lib/utils/logger';

interface EmailSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export function EmailSignInModal({ isOpen, onClose, onSuccess }: EmailSignInModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    
    try {
      await authService.signInWithEmail(email);
      onSuccess(email);
    } catch (err) {
      logger.error('Error sending magic link:', err);
      // Log additional details for debugging
      if (err instanceof Error) {
        logger.error('Error message:', err.message);
        logger.error('Error stack:', err.stack);
        // If the error has additional properties, try to log them
        const errorDetails = Object.getOwnPropertyNames(err)
          .filter(prop => prop !== 'name' && prop !== 'message' && prop !== 'stack')
          .reduce((acc, prop) => {
            // @ts-expect-error - We're explicitly trying to access unknown properties
            acc[prop] = err[prop];
            return acc;
          }, {} as Record<string, unknown>);
          
        if (Object.keys(errorDetails).length > 0) {
          logger.error('Additional error details:', errorDetails);
        }
      }
      setError('Failed to send sign-in link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign in with Email</DialogTitle>
          <DialogDescription>
            We&apos;ll send you a magic link to your email address.
            No password required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
