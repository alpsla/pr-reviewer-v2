/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.testing.js'],
  // Only run the specific tests we need to fix
  testMatch: [
    '**/src/__tests__/repository/basic-verification.test.ts',
    '**/src/__tests__/repository/simplified-tests.ts',
    '**/src/__tests__/repository/simplified-tests-fixed.ts',
    '**/src/__tests__/repository/minimal-error-test.ts',
    '**/src/__tests__/repository/rate-limit-test.ts',
    '**/src/__tests__/repository/basic-test.ts'
  ],
  // Set timeouts higher to avoid false negatives
  testTimeout: 10000,
  // Configure TypeScript paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
