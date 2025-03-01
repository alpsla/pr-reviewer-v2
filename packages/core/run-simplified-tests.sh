#!/bin/bash
# Script to run the simplified tests
# Make script executable with: chmod +x run-simplified-tests.sh

echo "Running simplified tests..."
pnpm test:simplified

# Exit with the pnpm exit code
exit $?
