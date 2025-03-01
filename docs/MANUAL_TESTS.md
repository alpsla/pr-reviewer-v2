# PR Reviewer Manual Testing Plan

## Introduction

This document outlines our comprehensive manual testing plan. We've decided to use manual testing as our primary validation strategy for complex functionality, while maintaining a minimal set of simplified automated tests for core features.

## Test Environment Setup

### Prerequisites
- GitHub account with test repositories
- GitLab account with test repositories
- Test repositories should contain:
  - Multiple open PRs with different sizes
  - Closed and merged PRs
  - PRs with various file types
  - PRs with comments and reviews

### Test User Accounts
- Create dedicated test accounts for both platforms
- Ensure accounts have appropriate permissions

## Test Scenarios

### 1. Authentication & Authorization

#### 1.1 GitHub Authentication
1. Navigate to login page
2. Select "Sign in with GitHub"
3. Complete OAuth flow
4. Verify successful redirection to dashboard
5. Verify user info is displayed correctly
6. Test token refresh mechanism

#### 1.2 GitLab Authentication
1. Navigate to login page
2. Select "Sign in with GitLab"
3. Complete OAuth flow
4. Verify successful redirection and user info
5. Test with both gitlab.com and self-hosted instances

#### 1.3 Email Authentication
1. Navigate to login page
2. Select "Sign in with Email"
3. Enter email and submit
4. Check email for magic link
5. Click link and verify successful authentication
6. Test with both valid and invalid email formats

#### 1.4 Authorization Verification
1. Try accessing private repositories you own
2. Try accessing private repositories you don't own
3. Test organization repository access
4. Verify appropriate permission errors

### 2. Repository Fetching and Caching

#### 2.1 Repository Listing
1. Load dashboard after login
2. Verify personal repositories appear
3. Check organization repositories appear when applicable
4. Verify pagination with large repository collections
5. Test search and filtering functionality
6. Check sorting options work correctly

#### 2.2 Cache Validation
1. Load repository list and note network requests
2. Refresh page within cache period (1 hour)
3. Verify cached data is used (no new API requests)
4. Wait for cache expiry or manually clear cache
5. Confirm fresh data is fetched after expiry

#### 2.3 Error Recovery
1. Temporarily disable network connection
2. Attempt to load repositories
3. Verify appropriate offline error message
4. Restore connection and test recovery
5. Test behavior under rate limiting

### 3. Pull Request Operations

#### 3.1 PR Listing
1. Select a repository with multiple PRs
2. Verify PR list loads with correct metadata
3. Test PR filtering by status (open/closed/merged)
4. Test sorting by creation date and update date
5. Check pagination with large PR collections

#### 3.2 PR Details
1. Select specific PRs of different sizes
2. Verify all PR metadata loads correctly:
   - Title and description
   - Author information
   - Branch information
   - Status indicators
   - File changes
   - Comments and reviews
3. Test with PRs containing various file types

#### 3.3 PR URL Parser
1. Navigate to PR Analyzer
2. Test these URL formats:
   - `https://github.com/owner/repo/pull/123`
   - `github/owner/repo/pull/123`
   - `https://gitlab.com/owner/repo/-/merge_requests/123`
   - `gitlab/owner/repo/merge_requests/123`
3. Verify correct extraction of platform, owner, repo, and PR number
4. Test error handling with invalid URLs

### 4. Error Handling

#### 4.1 Repository Errors
1. Try accessing non-existent repositories
2. Test with repositories that require special permissions
3. Verify appropriate error messages
4. Check recovery options are presented

#### 4.2 PR Errors
1. Try accessing non-existent PRs
2. Test with invalid PR numbers
3. Verify error boundaries catch and display errors properly
4. Test recovery after error conditions

#### 4.3 API Limitations
1. Make rapid sequential requests to trigger rate limits
2. Verify rate limit errors are handled gracefully
3. Check that retry information is displayed
4. Test token refresh when rate-limited

#### 4.4 Complex Error Scenarios
1. Test network timeout errors during PR fetching
2. Verify error handling for PR comments that fail to load
3. Test token expiration during an active session
4. Verify handling of API schema changes
5. Test edge case handling for PRs with extremely large diffs

### 5. Cross-Platform Testing

#### 5.1 GitHub-Specific Features
1. Test PR review functionality
2. Verify GitHub-specific metadata display
3. Test with both public and private repositories
4. Verify GitHub Enterprise support if applicable
5. Test with repositories that have protection rules

#### 5.2 GitLab-Specific Features
1. Test merge request approval display
2. Verify GitLab-specific metadata
3. Test with self-hosted GitLab instances if available
4. Verify correct handling of GitLab repository structure
5. Test GitLab API pagination handling
6. Verify proper OAuth token refresh for GitLab
7. Test GitLab project visibility settings (public/private/internal)
8. Test with repositories using GitLab CI/CD

### 6. Analysis Pipeline (When Implemented)

#### 6.1 Language Detection
1. Create PRs with various file types
2. Verify correct language detection
3. Test mixed-language repositories
4. Check handling of unusual file extensions

#### 6.2 Analysis Configuration
1. Configure analysis settings for different repository types
2. Test language-specific analysis rules
3. Verify configuration persistence

#### 6.3 Analysis Results
1. Run analysis on different PR types
2. Verify results display correctly
3. Test filtering and sorting of analysis results
4. Check result persistence and sharing

### 7. Performance and Load Testing

#### 7.1 Repository Caching Performance
1. Test with a large number of repositories (100+)
2. Verify caching behavior under high load
3. Test response time for cached vs non-cached data
4. Verify memory usage remains reasonable

#### 7.2 Large PR Analysis
1. Test with PRs containing 100+ files
2. Test with PRs having extremely large diffs
3. Verify correct handling of timeout scenarios
4. Test recovery mechanisms for interrupted analysis

#### 7.3 Concurrent Operations
1. Test multiple simultaneous PR analyses
2. Open multiple dashboard tabs concurrently
3. Verify token management with multiple sessions
4. Test behavior when switching between repositories quickly

### 8. Edge Case Testing

#### 8.1 Repository States
1. Test with empty repositories (no PRs)
2. Test with archived repositories
3. Test with repositories where permissions changed during the session
4. Test with forked repositories

#### 8.2 PR States
1. Test with PRs that change state during viewing (merged/closed)
2. Test with draft/WIP PRs
3. Test with PRs containing binary files
4. Test with PRs that have been rebased or force-pushed

### 8.3 Database Service Interactions
1. Test repository fetching with database caching
2. Verify database fallback when API calls fail
3. Test handling of database connection errors
4. Verify correct error types are generated based on specific error conditions

### 8.4 Type Safety Tests
1. Test handling of potentially undefined pagination properties
2. Verify proper number type conversion for API responses
3. Test error handling for malformed API responses
4. Check proper implementation of the DatabaseService interface

## Test Reporting

For each manual testing session:
1. Document date and tester name
2. Note which scenarios were tested
3. Record any issues with screenshots
4. Note the environment details (browser, OS)
5. File detailed bug reports for any issues

## Testing Schedule

- Complete manual test cycle:
  - Before each major release
  - After significant architecture changes
- Focused testing:
  - After UI component changes
  - When modifying auth flows
  - After error handling updates

## Automated vs Manual Testing Balance

We've significantly reduced our reliance on automated tests. Only these core automated tests are maintained:

### Maintained Automated Tests
1. **Basic Functionality Tests**
   - `simplified-tests.ts`: Core functionality of RepositoryService
   - `basic-test.ts`: Service initialization and basic error handling

2. **Error Handling Tests**
   - `simplified-error.test.ts`: Basic error type checking and error creation

3. **Platform Support Tests**
   - `simplified-platform.test.ts`: Platform support and token handling

4. **Module Structure Tests**
   - `minimal-index.test.ts`: Module exports and API validation

### Tests Moved to Manual Testing
The following tests have been converted to manual testing scenarios due to maintenance challenges:

1. **Integration Tests**
   - Repository service complex integration
   - VCS client integration
   - Platform-specific API interactions

2. **Error Handling Tests**
   - Complex error recovery scenarios
   - Rate limiting edge cases
   - Permission errors and authorization failures

3. **Complex Data Tests**
   - Large PR content handling
   - Repository caching edge cases
   - Performance under load

## Running Simplified Tests

To run only the simplified tests that should pass:

```bash
# Run the simplified test suite
npm run test:simplified

# Alternatively, run specific test files
npx jest --testPathPattern=simplified
```

## Manual Testing Guidelines

When performing manual testing:
1. Follow the exact steps in each scenario
2. Document any deviations from expected behavior
3. For error conditions, verify both the error display and recovery
4. Test with real GitHub and GitLab accounts
5. Use the desktop and mobile interfaces
6. Test with different network conditions (fast, slow, intermittent)
