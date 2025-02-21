#!/bin/bash
# Script to run ESLint with special handling for test files

echo "Running ESLint with updated configuration..."
cd "$(dirname "$0")/.."

# Only check test files
npx eslint "src/__tests__/**/*.ts" --fix

echo "ESLint check completed."
