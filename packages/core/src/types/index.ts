/**
 * Core shared types
 */

// Re-export database types
export * from './database';

// API response types
export interface APIResponse<T> {
  data: T | null;
  error: Error | null;
}

// Common pagination types
export interface PaginationParams {
  page?: number;
  perPage?: number;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Re-export provider-specific types
export * from './github';

// Re-export analysis types
export * from './analysis';
