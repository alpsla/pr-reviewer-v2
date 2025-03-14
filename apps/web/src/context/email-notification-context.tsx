'use client';

// This is a placeholder context as email authentication has been removed
// The application now only supports GitHub and GitLab login methods

import React, { createContext, useContext, ReactNode } from 'react';

interface EmailNotificationContextType {
  showEmailNotification: (email: string) => void;
  hideEmailNotification: () => void;
}

const EmailNotificationContext = createContext<EmailNotificationContextType>({
  showEmailNotification: () => {},
  hideEmailNotification: () => {},
});

export const useEmailNotification = () => useContext(EmailNotificationContext);

interface EmailNotificationProviderProps {
  children: ReactNode;
}

// This provider is kept as a placeholder to maintain compatibility
export function EmailNotificationProvider({ children }: EmailNotificationProviderProps) {
  // This component simply passes through children without adding any email notification functionality
  return <>{children}</>;
}
