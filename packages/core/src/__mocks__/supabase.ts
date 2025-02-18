import type { Session } from '@supabase/supabase-js';

export interface MockClient {
  auth: {
    signInWithOAuth: jest.Mock;
    signInWithOtp: jest.Mock;
    verifyOtp: jest.Mock;
    refreshSession: jest.Mock;
    signOut: jest.Mock;
    getSession: jest.Mock;
    getUser: jest.Mock;
    onAuthStateChange: jest.Mock;
  };
}

export class MockSupabaseClient {
  auth = {
    signInWithOAuth: jest.fn(),
    signInWithOtp: jest.fn(),
    verifyOtp: jest.fn(),
    refreshSession: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
    getUser: jest.fn(),
    onAuthStateChange: jest.fn((callback) => {
      this.authStateCallback = callback;
      return {
        data: { subscription: { unsubscribe: jest.fn() } },
        error: null,
      };
    }),
  };

  private authStateCallback?: (event: string, session: Session | null) => void;

  triggerAuthChange(event: string, session: Session | null) {
    if (this.authStateCallback) {
      this.authStateCallback(event, session);
    }
  }
}