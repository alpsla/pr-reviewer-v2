'use client';

// This is a placeholder component as email authentication has been removed
// The application now only supports GitHub and GitLab login methods

import React from 'react';

interface EmailSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export function EmailSignInModal({ isOpen, onClose, onSuccess }: EmailSignInModalProps) {
  // This component is intentionally empty as we've removed email authentication
  // It's kept as a placeholder to maintain compatibility with existing imports
  return null;
}
