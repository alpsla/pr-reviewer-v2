/**
 * Minimal Next.js type definitions for middleware
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

declare module 'next' {
  export interface NextApiRequest {
    url?: string;
    method: string;
    headers: Record<string, string | string[] | undefined>;
    query: Record<string, string | string[]>;
    cookies: Record<string, string>;
    body?: any;
  }
  
  export interface NextApiResponse {
    status(code: number): NextApiResponse;
    json(data: any): void;
    send(body: any): void;
    setHeader(name: string, value: string): void;
    end(): void;
  }
}
