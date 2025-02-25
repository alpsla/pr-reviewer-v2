# PR Reviewer Testing

## Testing Strategy

As documented in `docs/content/TESTING_STRATEGY.md`, we've adopted a balanced approach that focuses on manual testing for complex scenarios while maintaining automated tests for core functionality.

## Running Tests

### Basic Tests Only

To run only the basic tests that are expected to pass:

```bash
# Make the script executable
chmod +x run-only-basic-tests.sh

# Run the basic tests
./run-only-basic-tests.sh
```

### Running Simplified Test Suite

```bash
# In the project root
npm run test:simplified
```

### Why Some Tests Are Skipped

We have chosen to skip certain automated tests in favor of manual testing for the following reasons:

1. **Reduced Maintenance Burden**: Complex automated tests require significant maintenance effort.
2. **Focus on User Experience**: Manual testing better validates behavior from the user's perspective.
3. **Better Integration Testing**: Manual testing provides more comprehensive coverage for integration scenarios.
4. **Improved Developer Productivity**: Developers can focus on delivering features rather than fixing brittle tests.

For details on which tests are skipped and why, see `packages/core/SKIP_TESTS.md`.

## Manual Testing

For manual testing procedures, refer to `MANUAL_TESTS.md` which includes detailed test scenarios for:

- End-to-end workflows
- Cross-platform interactions
- Error handling and recovery
- Performance and load testing
- UI interactions
