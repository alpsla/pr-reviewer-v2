import { NextRequest } from 'next/server';
import { handleError } from '../middleware';
import { 
  AppError, 
  NotFoundError,
  GitHubError,
  DatabaseError,
  InternalError,
  AuthError,
  type ErrorResponse
} from '../types';

describe('Error Middleware', () => {
  const mockUrl = 'http://localhost:3000';
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mock console.error before each test
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error after each test
    consoleErrorSpy.mockRestore();
  });

  it('should handle AuthError', async () => {
    const error = new AuthError('Authentication failed');
    const request = new NextRequest(mockUrl);
    const response = handleError(error, request);
    const data = await response.json() as ErrorResponse;

    expect(response.status).toBe(401);
    expect(data).toEqual({
      error: {
        message: 'Authentication failed',
        type: 'AuthError',
        code: 'AUTH_ERROR',
        details: {}
      }
    });
  });

  it('should handle NotFoundError', async () => {
    const error = new NotFoundError('Resource not found');
    const request = new NextRequest(mockUrl);
    const response = handleError(error, request);
    const data = await response.json() as ErrorResponse;

    expect(response.status).toBe(404);
    expect(data).toEqual({
      error: {
        message: 'Resource not found',
        type: 'NotFoundError',
        code: 'NOT_FOUND',
        details: {}
      }
    });
  });

  it('should handle GitHubError with rate limit details', async () => {
    const details = {
      limit: 5000,
      remaining: 0,
      reset: 1600000000,
      retryAfter: 60
    };
    const error = new GitHubError('GitHub API rate limit exceeded', details);
    const request = new NextRequest(mockUrl);
    const response = handleError(error, request);
    const data = await response.json() as ErrorResponse;

    expect(response.status).toBe(502);
    expect(data).toEqual({
      error: {
        message: 'GitHub API rate limit exceeded',
        type: 'GitHubError',
        code: 'GITHUB_ERROR',
        details
      }
    });

    expect(response.headers.get('X-RateLimit-Limit')).toBe('5000');
    expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
    expect(response.headers.get('X-RateLimit-Reset')).toBe('1600000000');
    expect(response.headers.get('Retry-After')).toBe('60');
  });

  it('should handle DatabaseError', async () => {
    const error = new DatabaseError('Database connection failed');
    const request = new NextRequest(mockUrl);
    const response = handleError(error, request);
    const data = await response.json() as ErrorResponse;

    expect(response.status).toBe(503);
    expect(data).toEqual({
      error: {
        message: 'Database connection failed',
        type: 'DatabaseError',
        code: 'DATABASE_ERROR',
        details: {}
      }
    });
  });

  it('should handle InternalError', async () => {
    const error = new InternalError('Unexpected server error');
    const request = new NextRequest(mockUrl);
    const response = handleError(error, request);
    const data = await response.json() as ErrorResponse;

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: {
        message: 'Unexpected server error',
        type: 'InternalError',
        code: 'INTERNAL_ERROR',
        details: {}
      }
    });
  });

  it('should handle general AppError', async () => {
    const error = new AppError('Application error');
    const request = new NextRequest(mockUrl);
    const response = handleError(error, request);
    const data = await response.json() as ErrorResponse;

    expect(response.status).toBe(400);
    expect(data).toEqual({
      error: {
        message: 'Application error',
        type: 'AppError',
        code: 'APP_ERROR',
        details: {}
      }
    });
  });

  it('should handle unknown errors', async () => {
    const error = new Error('Unknown error');
    const request = new NextRequest(mockUrl);
    const response = handleError(error, request);
    const data = await response.json() as ErrorResponse;

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: {
        message: 'Unknown error',
        type: 'Error'
      }
    });
  });
});