export type ErrorDetails = Record<string, unknown>;

export interface ErrorResponseData {
  message: string;
  type: string;
  code?: string;
  details?: ErrorDetails;
}

export interface ErrorResponse {
  error: ErrorResponseData;
}

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'APP_ERROR',
    public readonly details: ErrorDetails = {}
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details: ErrorDetails = {}) {
    super(message, 'NOT_FOUND', details);
    this.name = 'NotFoundError';
  }
}

export class GitHubError extends AppError {
  constructor(message: string, details: ErrorDetails = {}) {
    super(message, 'GITHUB_ERROR', details);
    this.name = 'GitHubError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details: ErrorDetails = {}) {
    super(message, 'DATABASE_ERROR', details);
    this.name = 'DatabaseError';
  }
}

export class InternalError extends AppError {
  constructor(message: string, details: ErrorDetails = {}) {
    super(message, 'INTERNAL_ERROR', details);
    this.name = 'InternalError';
  }
}

export class AuthError extends AppError {
  constructor(message: string, details: ErrorDetails = {}) {
    super(message, 'AUTH_ERROR', details);
    this.name = 'AuthError';
  }
}