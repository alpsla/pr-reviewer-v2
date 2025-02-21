import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthError } from './auth-error';

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
interface ErrorResponseBody {
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export function errorMiddleware(
  err: Error,
  _req: NextApiRequest,
  res: NextApiResponse /* <ErrorResponseBody> */
) {
  const response = {
    error: {
      message: err.message,
    },
  };

  if (err instanceof AuthError) {
    return res.status(401).json(response);
  }

  // Log unexpected errors in production
  if (process.env.NODE_ENV === 'production') {
    console.error('Unexpected error:', err);
  }

  return res.status(500).json(response);
}