# Manual Test Procedures

This document outlines step-by-step manual test procedures for verifying PR Reviewer functionality.

## Test Environment Setup

### Prerequisites
- Development environment set up according to README.md
- Test GitHub/GitLab accounts with access to test repositories
- Test PRs of various sizes and complexity
- OpenAI API key for LLM integration testing
- Supabase project configured

### Test Repositories
Use these repositories for testing:
1. **Small PR Repository**: 1-5 files changed, simple changes
2. **Medium PR Repository**: 5-20 files changed, moderate complexity
3. **Large PR Repository**: 20+ files changed, high complexity
4. **Multi-Language Repository**: Mix of programming languages

## Core Functionality Tests

### 1. Authentication Testing

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

### 2. PR URL Input Testing

#### Test Case P1: GitHub PR URL Input
1. Navigate to PR analyzer
2. Enter a valid GitHub PR URL
3. Submit the URL
4. **Expected**: PR metadata is fetched and displayed
5. **Verification**: PR title, author, and statistics are correct

#### Test Case P2: GitLab MR URL Input
1. Navigate to PR analyzer
2. Enter a valid GitLab MR URL
3. Submit the URL
4. **Expected**: MR metadata is fetched and displayed
5. **Verification**: MR title, author, and statistics are correct

#### Test Case P3: Invalid URL Handling
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

### 4. Results Visualization Testing

#### Test Case R1: Results Summary
1. Complete an analysis of a test PR
2. View the results summary
3. **Expected**: Overview statistics and key findings displayed
4. **Verification**: Data matches expected analysis results

#### Test Case R2: Code Context View
1. Select a specific issue from results
2. View the code context
3. **Expected**: Relevant code section displayed with highlighting
4. **Verification**: Issue location in code is accurate

#### Test Case R3: Issue Filtering
1. Complete an analysis with multiple issue types
2. Use filters to show specific categories
3. **Expected**: Only selected issue types displayed
4. **Verification**: Filter counts match actual numbers

## UI Component Tests

### 1. Button Component Testing

#### Test Case B1: Basic Button Functionality
1. Locate various button instances throughout the application
2. Click each button type (primary, secondary, outline, etc.)
3. **Expected**: Button responds with appropriate action
4. **Verification**: Visual feedback on click, action performed

#### Test Case B2: Loading State
1. Find a button that triggers an async action
2. Click the button to initiate action
3. **Expected**: Button shows loading spinner while action is in progress
4. **Verification**: Button returns to normal state after action completes

#### Test Case B3: Disabled State
1. Find contexts where buttons should be disabled
2. Verify button appearance
3. Try clicking disabled button
4. **Expected**: Disabled button has muted appearance and cannot be clicked
5. **Verification**: No action occurs on click

### 2. Form Component Testing

#### Test Case F1: Input Validation
1. Find a form with validation requirements
2. Enter invalid data
3. Submit the form
4. **Expected**: Validation error displayed
5. **Verification**: Form prevents submission with invalid data

#### Test Case F2: Form Submission
1. Complete a form with valid data
2. Submit the form
3. **Expected**: Success feedback shown after submission
4. **Verification**: Data is correctly processed

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

#### Test Case E4: Network Connectivity Issues
1. Disable network connection during operation
2. Observe error handling
3. Re-enable network
4. **Expected**: Appropriate error messages shown
5. **Verification**: Operations recover when connection restored

## Responsive Design Testing

### 1. Device Testing

#### Test Case D1: Mobile View
1. Open application on mobile device or using dev tools mobile emulation
2. Navigate through key screens
3. **Expected**: UI adapts appropriately to small screens
4. **Verification**: All functionality remains accessible

#### Test Case D2: Tablet View
1. Open application on tablet or using dev tools tablet emulation
2. Navigate through key screens
3. **Expected**: UI utilizes medium screen space effectively
4. **Verification**: Layout adjusts appropriately

#### Test Case D3: Desktop View
1. Open application on large desktop monitor
2. Navigate through key screens
3. **Expected**: UI utilizes available space efficiently
4. **Verification**: Information density appropriate for large screens

## Accessibility Testing

### 1. Keyboard Navigation

#### Test Case K1: Tab Navigation
1. Start at application homepage
2. Navigate using only Tab key
3. **Expected**: Focus moves logically through interactive elements
4. **Verification**: All features accessible via keyboard

#### Test Case K2: Form Interaction
1. Navigate to a form using Tab key
2. Complete and submit form using only keyboard
3. **Expected**: All form controls usable with keyboard
4. **Verification**: Form submits successfully

### 2. Screen Reader Compatibility

#### Test Case S1: Critical Flows
1. Enable screen reader
2. Complete core user flows (authentication, PR analysis)
3. **Expected**: Screen reader announces all relevant information
4. **Verification**: All actions can be completed with screen reader

## Test Reporting Template

For each test session, include:

**Date**: [Test Date]
**Tester**: [Tester Name]
**Environment**: 
- Browser: [Browser and Version]
- OS: [Operating System]
- Screen Size: [Resolution]

**Tests Performed**:
- [Test ID]: [Pass/Fail]
  - Notes: [Observations]
  - Screenshots: [If applicable]
  
**Issues Found**:
- [Issue Description]
  - Steps to Reproduce: [Detailed steps]
  - Expected Behavior: [What should happen]
  - Actual Behavior: [What did happen]
  - Severity: [Critical/High/Medium/Low]
  
**Recommendations**:
- [Suggested improvements]
