#!/bin/bash
# Script to build core package with proper error handling

cd /Users/alpinro/Code\ Prjects/pr-reviewer-v2/packages/core

echo "🧹 Cleaning previous build artifacts..."
rm -rf dist node_modules/.cache

echo "📦 Building JavaScript bundle first..."
npx tsup src/index.ts --format cjs,esm --no-dts --clean

if [ $? -ne 0 ]; then
  echo "❌ JavaScript build failed! Fixing JavaScript errors first..."
  exit 1
fi

echo "📝 Generating declaration files..."
node declaration-build.js

if [ $? -eq 0 ]; then
  echo "🎉 Build completed successfully!"
else
  echo "⚠️ Declaration file generation failed. Using fallback approach..."
  echo "📌 Generating declarations with emitDeclarationOnly flag..."
  
  npx tsc --declaration --emitDeclarationOnly --outDir dist-types
  
  if [ $? -eq 0 ]; then
    echo "✅ Declarations generated with tsc. Copying to dist directory..."
    cp -r dist-types/*.d.ts dist-types/**/*.d.ts dist/ 2>/dev/null || true
    rm -rf dist-types
    echo "🎉 Build process completed with fallback method!"
  else
    echo "❌ All declaration generation methods failed."
    exit 1
  fi
fi
