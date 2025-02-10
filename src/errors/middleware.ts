import { NextRequest, NextResponse } from 'next/server';
import { AppError, GitHubError, type ErrorResponse } from './types';

export function handleError(error: Error, request: NextRequest): NextResponse<ErrorResponse> {
  console.error(`Error handling request to ${request.url}:`, error);

  let status = 500;
  let formattedError: ErrorResponse;

  if (error instanceof AppError) {
    status = error.statusCode;
    formattedError = {
      error: {
        message: error.message,
        type: error.name,
        code: error.code,
        details: error.details
      }
    };

    if (error instanceof GitHubError) {
      const headers: Record<string, string> = {};
      const { limit, remaining, reset, retryAfter } = error.details;

      if (typeof limit === 'number') {
        headers['X-RateLimit-Limit'] = String(limit);
      }
      if (typeof remaining === 'number') {
        headers['X-RateLimit-Remaining'] = String(remaining);
      }
      if (typeof reset === 'number') {
        headers['X-RateLimit-Reset'] = String(reset);
      }
      if (typeof retryAfter === 'number') {
        headers['Retry-After'] = String(retryAfter);
      }

      return NextResponse.json(formattedError, { status, headers });
    }
  } else {
    formattedError = {
      error: {
        message: error.message,
        type: error.name || 'Error'
      }
    };
  }

  return NextResponse.json(formattedError, { status });
}

export function createErrorHandler() {
  return (request: NextRequest) => ({
    handleError: (error: Error) => handleError(error, request)
  });
}