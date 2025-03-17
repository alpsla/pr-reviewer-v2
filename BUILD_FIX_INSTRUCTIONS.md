# PR Reviewer Build Fix Instructions

This document provides step-by-step instructions to fix the build issues with the PR Reviewer project.

## Problem Description

The build is failing with these errors:

```
Module not found: Can't resolve '@pr-reviewer/core'
```

The issue is that the core package (`@pr-reviewer/core`) is not being built properly - it's generating only TypeScript declaration files but missing the actual JavaScript files that are needed at runtime.

## Solution Overview

We've created a simplified build process for the core package that:

1. Uses esbuild directly to generate JavaScript files
2. Creates a simplified type declaration file that covers the main exports
3. Ensures both CommonJS and ESM versions are available

## Fix Instructions

### Method 1: Using the Automated Script

1. Make the script executable:
   ```bash
   chmod +x chmod_fix.sh
   ./chmod_fix.sh
   ```

2. Run the fix script:
   ```bash
   ./fix-and-build.sh
   ```

This script will:
- Install esbuild if needed
- Build the core package with our fixed build script
- Verify the build outputs exist
- Build the web app

### Method 2: Manual Steps

If the automated script doesn't work, follow these manual steps:

1. Install esbuild in the core package:
   ```bash
   cd packages/core
   npm install --no-save esbuild
   ```

2. Build the core package using our fixed build script:
   ```bash
   node build-fix.js
   ```

3. Verify the build outputs exist:
   ```bash
   ls -la dist/
   ```
   
   You should see:
   - `index.js` (CommonJS bundle)
   - `index.mjs` (ESM bundle)
   - `index.d.ts` (TypeScript declarations)

4. Go back to the project root and build the web app:
   ```bash
   cd ../..
   cd apps/web
   npm run build
   ```

## Troubleshooting

If you still encounter issues after following these steps:

1. **Workspace Resolution Issues**: 
   - Make sure pnpm workspaces are properly set up
   - Try running `pnpm install` at the root of the project

2. **Missing Dependencies**:
   - If esbuild fails to run, try installing it globally: `npm install -g esbuild`

3. **Path Resolution**:
   - If the web app still can't find the core package, try:
     ```bash
     cd apps/web
     npm link ../../packages/core
     ```

4. **Clean Build**:
   - Try cleaning node_modules and reinstalling:
     ```bash
     rm -rf node_modules
     rm -rf packages/*/node_modules
     rm -rf apps/*/node_modules
     pnpm install
     ```

## Long-term Solution

For a more permanent fix:

1. Properly configure tsup or another bundler to generate JavaScript outputs reliably
2. Add proper build error handling to prevent TypeScript errors from blocking JavaScript output
3. Set up CI/CD to catch build issues earlier
4. Consider moving to a more standard monorepo setup (e.g., Turborepo, Nx)

## Support

If you continue to experience issues, please contact the repository maintainers.
