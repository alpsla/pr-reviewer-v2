# PR Reviewer Testing Plan

## Testing Strategy Overview

The PR Reviewer application uses a balanced testing approach combining simplified automated tests with comprehensive manual testing. This approach was adopted after experiencing challenges with complex mocking and integration tests.

## Testing Components

### 1. Simplified Automated Tests

We maintain a core set of essential automated tests focused on:

- **Basic service functionality**: Creation, configuration, initialization
- **Critical error handling**: Rate limits, permission errors, not found errors
- **Platform support**: GitHub/GitLab compatibility
- **Error propagation**: Transformation of platform-specific errors

These tests are:
- Fast and reliable
- Focused on essential functionality
- Easy to maintain
- Deterministic (no timing dependencies)

### 2. Comprehensive Manual Testing

Complex user flows and integration scenarios are covered by our manual testing plan:

- **Repository fetching and caching**
- **PR listing and details**
- **Cross-platform functionality**
- **Error handling in UI**
- **Network behavior and recovery**

Benefits of manual testing for these scenarios:
- More realistic validation using real APIs
- Better coverage of UI interactions
- Easier verification of visual elements
- More thorough exploration of edge cases

## Implementation Details

### Directory Structure

```
/packages/core/
├── src/
│   └── __tests__/
│       └── repository/
│           ├── basic-service.test.ts       # Basic service tests
│           ├── error-handling-simplified.test.ts  # Error handling
│           ├── platform-support-simplified.test.ts  # Platform support
│           ├── simplified-tests.ts         # Core functionality
│           ├── README.md                   # Testing strategy docs
│           └── ... (legacy test files)     # Not actively maintained
└── test-plan.md                           # This file

/docs/
└── MANUAL_TESTS.md                        # Manual testing procedures
```

### Running Tests

To run the simplified test suite:
```
npm test -- -t "Basic|Error|Platform|Core"
```

To run manual tests, follow the procedures in `/docs/MANUAL_TESTS.md`.

## Maintenance Guidelines

### Automated Tests

1. Keep automated tests focused on critical functionality
2. Avoid complex mocking that's brittle and hard to maintain
3. Update tests when core error handling or platform support changes
4. Always run automated tests before commits

### Manual Tests

1. Keep manual test procedures up-to-date
2. Run complete manual test suite before releases
3. Create test repositories on GitHub/GitLab for consistent testing
4. Document any issues found during manual testing

## Conclusion

This balanced approach gives us the best of both worlds:
- Reliable automated testing of core functionality
- Comprehensive manual validation of complex user flows
- Reduced maintenance burden
- Better developer experience

By focusing automated tests on what they do best and leveraging manual testing for complex scenarios, we've created a more sustainable and effective testing strategy.
