#!/bin/bash
# Cleanup script to free disk space

echo "🧹 Cleaning up to free disk space..."

# Remove node_modules caches
find . -name ".cache" -type d -exec rm -rf {} +
find . -name "node_modules/.cache" -type d -exec rm -rf {} +

# Remove test coverage reports
find . -name "coverage" -type d -exec rm -rf {} +

# Remove build caches
find . -name ".turbo" -type d -exec rm -rf {} +
find . -name ".next" -type d -exec rm -rf {} \;

# Remove temporary files
find . -name "*.log" -type f -delete
find . -name "*.tmp" -type f -delete

# Remove archived documentation
rm -rf ./docs/archive_*

# Clean git objects (optional, be careful)
# git gc --aggressive

echo "✅ Cleanup complete! Space freed."

# Show disk usage
df -h .
