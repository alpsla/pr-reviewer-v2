export class AuthError extends Error {
  code: string;
  originalError?: Error | unknown;

  constructor(message: string, originalError?: Error | unknown) {
    super(message);
    this.name = "AuthError";
    this.code = "AUTH_ERROR";
    this.originalError = originalError;
  }
}
