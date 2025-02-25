#!/bin/bash
# Build helper script for PR Reviewer project

echo "🔍 Running PR Reviewer diagnostic build process..."

# Step 1: Clean up any previous build artifacts
echo "🧹 Cleaning previous builds..."
cd /Users/alpinro/Code\ Prjects/pr-reviewer-v2/packages/core
rm -rf dist
rm -rf node_modules/.cache

# Step 2: Check TypeScript version
echo "📊 TypeScript version:"
npx tsc --version

# Step 3: Verify tsconfig
echo "🔍 Validating tsconfig..."
npx tsc --noEmit

# Step 4: Build without DTS first
echo "🏗️ Building without declaration files..."
npx tsup --no-dts

# Step 5: If previous step succeeds, try with declaration files
if [ $? -eq 0 ]; then
  echo "✅ Basic build successful. Now attempting with declaration files..."
  npx tsup
else
  echo "❌ Basic build failed. Fix the issues before trying declaration files."
  exit 1
fi

echo "✅ Build process completed"
