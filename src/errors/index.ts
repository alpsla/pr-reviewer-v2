export class BaseError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
    public readonly code?: string,
    public readonly service?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class AuthError extends BaseError {
  constructor(message: string, originalError?: unknown) {
    super(message, originalError, 'AUTH_ERROR', 'auth');
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string, originalError?: unknown) {
    super(message, originalError, 'DATABASE_ERROR', 'database');
  }
}

export class NetworkError extends BaseError {
  constructor(message: string, originalError?: unknown) {
    super(message, originalError, 'NETWORK_ERROR');
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, undefined, 'VALIDATION_ERROR', undefined, details);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string, service?: string) {
    super(message, undefined, 'UNAUTHORIZED', service);
  }
}

export class RateLimitedError extends BaseError {
  constructor(message: string, service: string, details: unknown) {
    super(message, undefined, 'RATE_LIMITED', service, details);
  }
}

export class LLMError extends BaseError {
  constructor(message: string, service: string) {
    super(message, undefined, 'LLM_ERROR', service);
  }
}