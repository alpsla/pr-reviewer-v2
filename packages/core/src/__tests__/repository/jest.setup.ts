// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Global mock for logger to prevent console noise during tests
jest.mock('../../utils/logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Silence console.log/console.error during tests
// but keep console.log for debugging tests with the 'DEBUG' environment variable
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

if (!process.env.DEBUG) {
  global.console.log = jest.fn();
  global.console.error = jest.fn();
}

// Restore console after all tests
afterAll(() => {
  global.console.log = originalConsoleLog;
  global.console.error = originalConsoleError;
});
