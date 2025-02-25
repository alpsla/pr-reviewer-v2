#!/bin/bash
# Debug script to identify specific DTS build issues

cd /Users/alpinro/Code\ Prjects/pr-reviewer-v2/packages/core

echo "🔎 Running DTS debug with increased verbosity..."

# Clean previous build artifacts
rm -rf dist
rm -rf .turbo
rm -rf node_modules/.cache

# Set environment variables for more detailed errors
export DEBUG=tsup,esbuild,typescript

# Try building with explicit options and maximum logging
npx tsup src/index.ts \
  --dts \
  --dts-resolve \
  --sourcemap \
  --format cjs,esm \
  --clean \
  --verbose \
  --target es2020 \
  2>&1 | tee dts-debug-log.txt

echo "✓ Debug log saved to packages/core/dts-debug-log.txt"

# If it failed, check for common issues in the project
echo "🔍 Checking for potential issues..."

# 1. Check for circular dependencies
echo "Checking for potential circular dependencies..."
npx madge --circular --extensions ts,tsx src/

# 2. Check for missing type declarations
echo "Checking for missing type dependencies..."
find src -name "*.ts" -exec grep -l "import.*from" {} \; | xargs grep -l "any" | sort

echo "Debug process completed. Please check the logs for details."
