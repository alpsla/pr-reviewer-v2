'use client';

// This is a placeholder component as email authentication has been removed
// The application now only supports GitHub and GitLab login methods

import React from 'react';

interface EmailNotificationBannerProps {
  email: string;
  isVisible: boolean;
  onDismiss: () => void;
}

export function EmailNotificationBanner({ email, isVisible, onDismiss }: EmailNotificationBannerProps) {
  // This component is intentionally empty as we've removed email authentication
  // It's kept as a placeholder to maintain compatibility with existing imports
  return null;
}
