import { errorMiddleware } from '../middleware';
import { AuthError } from '../auth-error';
import { createRequest, createResponse } from 'node-mocks-http';
// Removed unused imports

describe('errorMiddleware', () => {
  it('should handle auth errors with 401 status', () => {
    const req = createRequest();
    const res = createResponse();
    const error = new AuthError('Invalid credentials');

    errorMiddleware(error, req, res);

    expect(res._getStatusCode()).toBe(401);
    const data = JSON.parse(res._getData());
    expect(data.error.message).toBe('Invalid credentials');
  });

  it('should handle general errors with 500 status', () => {
    const req = createRequest();
    const res = createResponse();
    const error = new Error('Something went wrong');

    errorMiddleware(error, req, res);

    expect(res._getStatusCode()).toBe(500);
    const data = JSON.parse(res._getData());
    expect(data.error.message).toBe('Something went wrong');
  });

  it('should preserve original error message', () => {
    const req = createRequest();
    const res = createResponse();
    const message = 'Custom error message';
    const error = new Error(message);

    errorMiddleware(error, req, res);

    const data = JSON.parse(res._getData());
    expect(data.error.message).toBe(message);
  });
});