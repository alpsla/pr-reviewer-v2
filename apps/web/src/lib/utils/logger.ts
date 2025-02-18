/**
 * Utility for conditional logging that won't trigger ESLint warnings
 */
const isDev = process.env.NODE_ENV === 'development';

type LogArgs = unknown[];

export const logger = {
  log: (...args: LogArgs) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },
  error: (...args: LogArgs) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.error(...args);
    }
  },
  warn: (...args: LogArgs) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },
  info: (...args: LogArgs) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.info(...args);
    }
  },
};
