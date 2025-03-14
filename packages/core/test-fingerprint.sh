#!/bin/bash
# Run just the fingerprint tests to verify they pass
cd /Users/alpinro/Code\ Prjects/pr-reviewer-v2/packages/core
pnpm jest --config jest.config.ts 'fingerprint/fingerprint.test.ts' --verbose
