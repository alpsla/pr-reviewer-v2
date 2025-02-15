export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string = "APP_ERROR",
    public readonly statusCode: number = 400,
    public readonly details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class AuthError extends AppError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super(message, "AUTH_ERROR", 401, details);
    this.name = "AuthError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super(message, "NOT_FOUND", 404, details);
    this.name = "NotFoundError";
  }
}

export class GitHubError extends AppError {
  constructor(
    message: string,
    details: Record<string, unknown> & {
      limit?: number;
      remaining?: number;
      reset?: number;
      retryAfter?: number;
    } = {},
  ) {
    super(message, "GITHUB_ERROR", 502, details);
    this.name = "GitHubError";
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super(message, "DATABASE_ERROR", 503, details);
    this.name = "DatabaseError";
  }
}

export class InternalError extends AppError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super(message, "INTERNAL_ERROR", 500, details);
    this.name = "InternalError";
  }
}

export interface ErrorResponse {
  error: {
    message: string;
    type: string;
    code?: string;
    details?: Record<string, unknown>;
  };
}

export function formatError(error: AppError): ErrorResponse {
  return {
    error: {
      message: error.message,
      type: error.name,
      code: error.code,
      details: error.details,
    },
  };
}
