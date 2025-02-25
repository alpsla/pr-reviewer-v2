#!/bin/bash

# Run only basic tests
echo "Running only basic tests according to testing strategy"
echo "See packages/core/SKIP_TESTS.md for details on skipped tests"
cd packages/core
npx jest basic-test.ts minimal-index.test.ts
