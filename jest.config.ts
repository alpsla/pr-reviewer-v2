import type { Config } from 'jest';

const config: Config = {
  projects: ['<rootDir>/apps/*/jest.config.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { 
      presets: ['next/babel'],
      plugins: ['@babel/plugin-transform-modules-commonjs']
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/.next/',
    '<rootDir>/node_modules/'
  ],
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/types.ts',
    '!src/generated/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
};

export default config;