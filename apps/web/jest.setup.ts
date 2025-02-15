import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    query: {}
  })
}));

// Add missing DOM environment APIs
if (typeof window !== 'undefined') {
  Object.assign(window, { TextEncoder, TextDecoder });
}

// Mock IntersectionObserver with full implementation
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];
  
  constructor(
    private callback: IntersectionObserverCallback,
    private options: IntersectionObserverInit = {}
  ) {}

  observe(): void {}
  
  unobserve(): void {}
  
  disconnect(): void {}
  
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

global.IntersectionObserver = MockIntersectionObserver;