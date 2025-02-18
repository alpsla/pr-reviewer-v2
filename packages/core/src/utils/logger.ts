/**
 * Utility for conditional logging that won't trigger ESLint warnings
 */
const isTestEnv = process.env.NODE_ENV === 'test';

type LogArgs = unknown[];

export const logger = {
  log: (...args: LogArgs) => {
    if (!isTestEnv) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },
  error: (...args: LogArgs) => {
    if (!isTestEnv) {
      // eslint-disable-next-line no-console
      console.error(...args);
    }
  },
  warn: (...args: LogArgs) => {
    if (!isTestEnv) {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },
  info: (...args: LogArgs) => {
    if (!isTestEnv) {
      // eslint-disable-next-line no-console
      console.info(...args);
    }
  },
};
