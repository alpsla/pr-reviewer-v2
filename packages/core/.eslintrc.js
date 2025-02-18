module.exports = {
  root: true,
  extends: ['../../.eslintrc.json'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    // Prevent imports from root src directory
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['src/*'],
            message: 'Please use relative imports within the package',
          },
        ],
      },
    ],
    // Ensure consistent file structure
    'import/no-relative-parent-imports': 'error',
    // Enforce named exports
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
  },
};