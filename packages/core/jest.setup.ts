// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Global mock for logger to prevent console noise during tests
jest.mock('./src/utils/logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn(), // Add this missing method
  },
}));

// In the default test environment, silence console logs
// but keep console.log for debugging tests with the 'DEBUG' environment variable
if (!process.env.DEBUG) {
  global.console.log = jest.fn() as any;
  global.console.error = jest.fn() as any;
  global.console.warn = jest.fn() as any;
}

// Make sure we don't leak console mocks between test runs
afterAll(() => {
  jest.restoreAllMocks();
});
