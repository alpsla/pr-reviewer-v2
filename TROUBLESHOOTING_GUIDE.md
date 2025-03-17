# Module Resolution Troubleshooting Guide

## Current Situation

We've tried multiple approaches to fix the module resolution error with `@pr-reviewer/core`, but the build still fails with:

```
Module not found: Can't resolve '@pr-reviewer/core'
```

This is a challenging issue that could be caused by several factors:

1. **Next.js Build Configuration**: Next.js has its own webpack configuration that might be overriding our customizations
2. **Monorepo Setup**: The pnpm workspace setup might not be correctly linking packages
3. **Module Resolution Algorithm**: Node.js and webpack have specific module resolution rules
4. **Cache Issues**: Previous build artifacts might be causing issues

## Diagnostic Approach

I've created a diagnostic script that will:

1. **Examine the project structure**: Look at package.json files, dependencies, and configurations
2. **Create a thorough cleanup script**: Clean build artifacts and create a fresh implementation
3. **Test with a single file**: Try to compile a simple file to verify module resolution

## Next Steps

### 1. Run the Diagnostic Script

```bash
chmod +x enable-diagnostic.sh
./enable-diagnostic.sh
./diagnostic.sh
```

This will provide detailed information about your project structure and create a thorough cleanup script.

### 2. Run the Thorough Cleanup Script

After running the diagnostic script, run the generated cleanup script:

```bash
./thorough-cleanup.sh
```

This script will:
- Clean all build artifacts
- Create a direct implementation in node_modules
- Create a minimal next.config.js
- Test a single file with TypeScript
- Attempt to build the web app

### 3. Analyze the Results

If the build succeeds:
- The issue was likely related to caching or inconsistent package state
- You can now work with the mock implementation while fixing the actual core package

If the build still fails:
- Check the specific error messages
- Look at the diagnostic information
- Consider these advanced options:

## Advanced Troubleshooting Options

If the issue persists, try these advanced options:

### Option 1: Add Trace to Node.js Module Resolution

Run the build with module resolution tracing:

```bash
NODE_OPTIONS="--trace-warnings --trace-modules" npm run build
```

This will show detailed information about module resolution.

### Option 2: Use a Local Package Instead of Workspace Reference

Try changing the dependency in apps/web/package.json:

```json
"dependencies": {
  "@pr-reviewer/core": "file:../../packages/core",
  // other dependencies...
}
```

Then run:
```bash
cd apps/web
npm install
npm run build
```

### Option 3: Build With Extra Verbosity

```bash
cd apps/web
npm run build -- --verbose
```

### Option 4: Create a Minimal Reproduction

Create a simplified project with minimal configuration to test module resolution.

## Last Resort Options

If all else fails:

### Option 1: Copy Core Logic Directly

Copy the essential code from the core package directly into the web application.

### Option 2: Use Dynamic Import as Fallback

Modify the code to use dynamic imports with fallbacks:

```typescript
let coreModule;
try {
  coreModule = require('@pr-reviewer/core');
} catch (e) {
  console.warn('Using fallback implementation for @pr-reviewer/core');
  coreModule = {
    // Fallback implementation
  };
}

const { DatabaseService } = coreModule;
```

### Option 3: Rebuild from Different Angle

Consider a complete rebuild of the project with a different monorepo setup (e.g., Turborepo).
