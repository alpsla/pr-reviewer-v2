#!/bin/bash
# Comprehensive script to fix DTS build issues

cd /Users/alpinro/Code\ Prjects/pr-reviewer-v2/packages/core

echo "🔧 Starting DTS build fix process..."

# Step 1: Clean everything
echo "🧹 Cleaning previous builds..."
rm -rf dist
rm -rf node_modules/.cache
rm -rf .turbo

# Step 2: Build JS files first (without types)
echo "📦 Building JS only..."
npx tsup src/index.ts --format cjs,esm --no-dts --clean --target es2020

if [ $? -ne 0 ]; then
  echo "❌ JS build failed. Fixing basic issues first."
  exit 1
fi

# Step 3: Run custom type-checking to identify issues
echo "🔍 Type checking..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
  echo "❌ Type checking failed. Fix these errors first."
  exit 1
fi

# Step 4: Generate declarations directly with tsc
echo "📝 Generating declarations with tsc..."
npx tsc --declaration --emitDeclarationOnly --outDir dist-types

if [ $? -eq 0 ]; then
  echo "✅ Declaration files generated successfully with tsc!"
  echo "📋 Copying declarations to dist directory..."
  cp -r dist-types/*.d.ts dist-types/**/*.d.ts dist/
  rm -rf dist-types
else
  echo "❌ Declaration generation failed with tsc."
  
  # Step 5: Fallback - try isolatedModules approach
  echo "🔄 Trying isolatedModules approach..."
  
  # Create temporary tsconfig for isolated modules
  cat > tsconfig.isolated.json << EOL
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "isolatedModules": true,
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "dist"
  }
}
EOL
  
  npx tsc -p tsconfig.isolated.json
  
  if [ $? -eq 0 ]; then
    echo "✅ Declarations generated with isolatedModules approach!"
  else
    echo "❌ All declaration generation approaches failed."
    echo "💡 Recommendation: Try manual declaration files for problematic modules."
    exit 1
  fi
fi

echo "🎉 Build process completed!"
