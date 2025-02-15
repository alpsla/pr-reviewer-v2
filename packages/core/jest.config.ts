import type { Config } from "@jest/types";

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/__tests__/**/*.test.ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@octokit/(.*)$": "<rootDir>/src/__mocks__/@octokit/$1.ts",
    "^@supabase/supabase-js$":
      "<rootDir>/src/__mocks__/@supabase/supabase-js.ts",
    "^next/(.*)$": "<rootDir>/src/__mocks__/next/$1.ts",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@octokit|octokit|@supabase|before-after-hook|universal-user-agent|node-fetch)/)",
  ],
  transform: {
    "^.+\\.[tj]sx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "./tsconfig.json",
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  moduleDirectories: ["node_modules"],
  testPathIgnorePatterns: ["<rootDir>/dist/"],
  cacheDirectory: "<rootDir>/.jest-cache",
} satisfies Config.InitialOptions;
