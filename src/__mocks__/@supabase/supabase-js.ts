export const createClient = jest.fn(() => ({
  auth: {
    signInWithOtp: jest.fn(),
    verifyOtp: jest.fn(),
    refreshSession: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
    getUser: jest.fn(),
    onAuthStateChange: jest.fn(),
    signInWithOAuth: jest.fn()
  }
}));

export const createMockSupabaseClient = () => ({
  auth: {
    signInWithOtp: jest.fn(),
    verifyOtp: jest.fn(),
    refreshSession: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
    getUser: jest.fn(),
    onAuthStateChange: jest.fn(),
    signInWithOAuth: jest.fn()
  }
});