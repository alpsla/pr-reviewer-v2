// Set environment variables for testing
process.env.NODE_ENV = 'test';  // Enable test mode

// Mock console methods to reduce test noise
global.console = {
  ...console,
  // Keep these for testing
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Add global fail function for Jest
global.fail = (message) => {
  throw new Error(message || 'Test failed');
};
