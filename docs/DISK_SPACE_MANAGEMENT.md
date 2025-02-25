# Disk Space Management

## Overview
This document provides guidance on managing disk space for the PR Reviewer project. We've encountered disk space issues during builds, and these instructions will help maintain sufficient space for development.

## Quick Solutions

### 1. Run the Cleanup Script
```bash
# Make the script executable
chmod +x ./cleanup.sh

# Run the cleanup script
./cleanup.sh
```

### 2. Use Space-Saving Build
When encountering disk space issues during builds:
```bash
# Using pnpm
pnpm run build:space-saving

# Using npm
npm run build:space-saving
```

Alternatively, you can run the regular build which will fall back to space-saving mode if needed:
```bash
pnpm run build
```

## Common Disk Space Issues

### Build Declaration Files
The TypeScript declaration file generation can require significant disk space. We've modified the build process to provide a space-saving alternative.

### Test Coverage Reports
Coverage reports can consume large amounts of space. Clean them regularly:
```bash
rm -rf coverage
rm -rf .nyc_output
```

### Node Modules Caches
The Node.js cache can grow significantly:
```bash
rm -rf node_modules/.cache
```

### Build Caches
Next.js and Turbo build caches:
```bash
rm -rf .next
rm -rf .turbo
```

## Long-Term Solutions

### 1. Implement CI/CD Pruning
Configure CI/CD pipelines to regularly clean caches and temporary files.

### 2. Docker-Based Development
Consider using a Docker-based development environment with volume mounting to manage disk space separately from your local system.

### 3. Split Repositories
If the project continues to grow, consider splitting into separate repositories.

## Monitoring

Regularly check available disk space:
```bash
# Check overall disk space
df -h

# Find large directories
du -h --max-depth=1 . | sort -hr | head -10
```

## Prevention

1. **Regular Cleaning**: Run the cleanup script weekly
2. **Test Efficiently**: Avoid generating full coverage reports during regular development
3. **Use .gitignore**: Ensure all build artifacts are properly ignored
4. **Build Optimization**: Use incremental builds where possible
