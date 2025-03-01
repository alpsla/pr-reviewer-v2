'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EmailNotificationBanner } from '@/components/auth/email-notification-banner';

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

export function EmailNotificationProvider({ children }: EmailNotificationProviderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');

  const showEmailNotification = (emailAddress: string) => {
    setEmail(emailAddress);
    setIsVisible(true);
  };

  const hideEmailNotification = () => {
    setIsVisible(false);
  };

  return (
    <EmailNotificationContext.Provider value={{ showEmailNotification, hideEmailNotification }}>
      {children}
      <EmailNotificationBanner 
        email={email}
        isVisible={isVisible}
        onDismiss={hideEmailNotification}
      />
    </EmailNotificationContext.Provider>
  );
}
