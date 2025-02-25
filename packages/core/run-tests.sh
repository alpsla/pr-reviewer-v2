#!/bin/bash
# Make script executable with: chmod +x run-tests.sh
# Script to run the fixed tests

echo "Running simplified tests with custom configuration..."
npx jest --config jest.config.testing.js

# Exit with the Jest exit code
exit $?
