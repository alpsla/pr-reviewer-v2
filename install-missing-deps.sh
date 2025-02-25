#!/bin/bash
# Script to install missing dev dependencies

echo "📦 Installing missing development dependencies..."

# Change to the core package directory
cd /Users/alpinro/Code\ Prjects/pr-reviewer-v2/packages/core

# Install missing @types
npm install --save-dev @types/next

echo "✅ Installed missing dependencies"
