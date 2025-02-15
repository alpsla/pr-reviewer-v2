import '@testing-library/jest-dom';
import 'cross-fetch/polyfill';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Global beforeAll setup
beforeAll(() => {
  // Add any global setup here
});

// Global afterAll cleanup
afterAll(() => {
  // Add any global cleanup here
});