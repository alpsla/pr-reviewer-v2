# PR Reviewer Manual Test Plan

## Overview

This document outlines the manual test procedures for validating the PR Reviewer application's functionality. These tests focus on scenarios that are difficult to automate or require human judgment.

## Test Environment Setup

### Prerequisites
- Development environment set up according to ONBOARDING.md
- Test GitHub/GitLab accounts with access to test repositories
- Test PRs of various sizes and complexity
- OpenAI API key for LLM integration testing
- Supabase project configured

### Test Repositories
Create or use existing repositories with the following characteristics:
1. **Small PR Repository**: 1-5 files changed, simple changes
2. **Medium PR Repository**: 5-20 files changed, moderate complexity
3. **Large PR Repository**: 20+ files changed, high complexity
4. **Multi-Language Repository**: Mix of programming languages

## Core Functionality Tests

### 1. Authentication Flow Testing

#### Test Case A1: GitHub OAuth Authentication
1. Navigate to the login page
2. Click "Sign in with GitHub"
3. Complete GitHub OAuth flow
4. **Expected**: Successfully redirected to dashboard
5. **Verification**: User profile shows GitHub information

#### Test Case A2: GitLab OAuth Authentication
1. Navigate to the login page
2. Click "Sign in with GitLab"
3. Complete GitLab OAuth flow
4. **Expected**: Successfully redirected to dashboard
5. **Verification**: User profile shows GitLab information

#### Test Case A3: Magic Link Authentication
1. Navigate to the login page
2. Enter email address
3. Click "Send Magic Link"
4. Open email and click the provided link
5. **Expected**: Successfully authenticated
6. **Verification**: User session persists across tabs

### 2. Repository and PR Fetching

#### Test Case R1: GitHub PR Fetching
1. Enter a valid GitHub PR URL in the input field
2. Submit the URL for analysis
3. **Expected**: PR metadata is fetched and displayed
4. **Verification**: PR title, author, and statistics are correct

#### Test Case R2: GitLab PR Fetching
1. Enter a valid GitLab MR URL in the input field
2. Submit the URL for analysis
3. **Expected**: MR metadata is fetched and displayed
4. **Verification**: MR title, author, and statistics are correct

#### Test Case R3: Error Handling for Invalid URLs
1. Enter an invalid or non-existent PR URL
2. Submit the URL
3. **Expected**: Appropriate error message displayed
4. **Verification**: UI recovers gracefully, allows retry

### 3. Analysis Queue Testing

#### Test Case Q1: Queue Processing
1. Submit a PR for analysis
2. Observe queue status updates
3. **Expected**: PR advances through queue stages
4. **Verification**: Status indicators update correctly

#### Test Case Q2: Multiple Queue Entries
1. Submit multiple PRs for analysis in succession
2. Observe queue behavior
3. **Expected**: PRs are processed in order (or by priority)
4. **Verification**: Each job completes with correct results

#### Test Case Q3: Queue Recovery
1. Submit a PR for analysis
2. Manually interrupt the process (e.g., stop the server)
3. Restart the application
4. **Expected**: Processing resumes or appropriate error shown
5. **Verification**: System recovers without data loss

### 4. LLM Integration Tests

#### Test Case L1: Basic Code Review
1. Submit a simple PR for analysis
2. Wait for LLM processing to complete
3. **Expected**: Relevant code review comments generated
4. **Verification**: Comments are contextually appropriate

#### Test Case L2: Multi-Language Support
1. Submit a PR containing multiple programming languages
2. Wait for LLM processing to complete
3. **Expected**: Language-specific insights provided
4. **Verification**: Comments show understanding of each language

#### Test Case L3: Large PR Handling
1. Submit a PR with 20+ files changed
2. Wait for LLM processing to complete
3. **Expected**: Important issues identified despite size
4. **Verification**: System doesn't fail or time out

## Edge Case Testing

### 1. Rate Limiting Scenarios

#### Test Case E1: GitHub API Rate Limiting
1. Submit multiple GitHub PRs in rapid succession
2. Observe system behavior when rate limits are approached
3. **Expected**: Appropriate throttling or error messages
4. **Verification**: System recovers after rate limit reset

#### Test Case E2: LLM API Rate Limiting
1. Submit several complex PRs for analysis in succession
2. Monitor for API rate limit errors
3. **Expected**: Graceful handling of rate limits
4. **Verification**: Jobs resume when rate limits reset

### 2. Error Recovery

#### Test Case E3: VCS Authentication Failures
1. Revoke OAuth token access
2. Attempt to fetch a PR
3. **Expected**: Clear authentication error message
4. **Verification**: User prompted to reauthenticate

#### Test Case E4: Database Connectivity Issues
1. Simulate a database connectivity issue
2. Perform operations that require database access
3. **Expected**: Appropriate error messages shown
4. **Verification**: Operations retry or fail gracefully

## User Interface Testing

### 1. Responsive Design

#### Test Case U1: Mobile Responsiveness
1. Access the application on a mobile device or using browser dev tools
2. Navigate through all major screens
3. **Expected**: UI adapts appropriately to smaller screens
4. **Verification**: All functions remain accessible

#### Test Case U2: Large Screen Experience
1. Access the application on a large monitor
2. Navigate through PR analysis views
3. **Expected**: UI utilizes available space effectively
4. **Verification**: Information density appropriate for screen size

### 2. Accessibility Testing

#### Test Case U3: Keyboard Navigation
1. Navigate the application using only keyboard
2. Attempt to access all major functions
3. **Expected**: All features accessible via keyboard
4. **Verification**: Focus indicators are visible

#### Test Case U4: Screen Reader Compatibility
1. Enable a screen reader
2. Navigate through the application
3. **Expected**: Content properly announced by screen reader
4. **Verification**: All important elements have appropriate ARIA attributes

## Performance Testing

### 1. Load Testing

#### Test Case P1: Large Repository Collection
1. Link multiple repositories (10+) to the application
2. Navigate repository browsing interfaces
3. **Expected**: UI remains responsive
4. **Verification**: No significant lag in rendering

#### Test Case P2: Large PR Analysis
1. Submit a PR with 50+ files and significant changes
2. Monitor system resource usage during analysis
3. **Expected**: Analysis completes without timeout
4. **Verification**: Results are comprehensive despite size

## Test Reporting

For each test session:

1. **Environment Details**:
   - Browser and version
   - Operating system
   - Device type
   - Backend version

2. **Test Results**:
   - Pass/Fail status for each test case
   - Description of any unexpected behavior
   - Screenshots of errors or issues

3. **Performance Metrics**:
   - Time to complete key operations
   - Resource usage patterns
   - API call frequency

## Test Schedule

- **Pre-release Testing**: Complete full test suite
- **Post-significant Changes**: Test affected components
- **Bi-weekly Regression Testing**: Core functionality tests
- **Monthly Full Testing**: Complete test suite

## Future Test Additions

As we implement new features, we'll expand this manual test plan to include:

1. User preference configurations
2. Advanced PR filtering and search
3. Feedback submission workflow
4. Team collaboration features
5. Historical analysis comparison

## Test Case Template

When adding new test cases, follow this format:

```
#### Test Case [ID]: [Title]
1. [Step 1]
2. [Step 2]
3. ...
**Expected**: [Expected outcome]
**Verification**: [How to verify success]
```
