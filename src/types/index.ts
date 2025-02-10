// Re-export analysis types
export * from './analysis';
export * from './github';

// Common API Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    timestamp: string;
    version: string;
  };
}

// Database Types
export interface DatabaseUser {
  id: string;
  github_id: number;
  github_login: string;
  email: string | null;
  created_at: Date;
  updated_at: Date;
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> extends APIResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Types
export interface APIError {
  code: string;
  message: string;
  details?: unknown;
}
