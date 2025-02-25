// Rate limiting utility for auth attempts
const RATE_LIMIT_KEY = 'auth_rate_limit';

interface RateLimitData {
  timestamp: number;
  email: string;
  isRateLimited: boolean;
}

export const RateLimit = {
  set: (email: string, isRateLimited: boolean = true) => {
    try {
      const data: RateLimitData = {
        timestamp: Date.now(),
        email,
        isRateLimited
      };
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error setting rate limit:', error);
    }
  },

  check: (email: string): number | null => {
    try {
      const stored = localStorage.getItem(RATE_LIMIT_KEY);
      if (!stored) {
        return null;
      }

      const data: RateLimitData = JSON.parse(stored);
      
      // If checking for a different email, allow the attempt
      if (data.email !== email) {
        return null;
      }

      const elapsed = Date.now() - data.timestamp;
      const waitTime = 60000; // 60 seconds

      if (elapsed < waitTime) {
        return Math.ceil((waitTime - elapsed) / 1000);
      }

      // Clear expired rate limit
      localStorage.removeItem(RATE_LIMIT_KEY);
      return null;
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return null;
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(RATE_LIMIT_KEY);
    } catch (error) {
      console.error('Error clearing rate limit:', error);
    }
  }
};