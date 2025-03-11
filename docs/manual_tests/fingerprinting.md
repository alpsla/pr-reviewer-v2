# Manual Testing: Repository Fingerprinting & Analysis Limits

This document outlines testing scenarios for verifying the repository fingerprinting and analysis limit tracking functionality. These tests should be run against a real GitHub repository to validate the implementation.

## Prerequisites

1. **GitHub Account**: You'll need a GitHub account with access to at least one repository
2. **PR Reviewer Application**: Running instance of the application with the fingerprinting functionality implemented
3. **Multiple User Accounts**: To fully test the fingerprinting across users, you should have 2 different user accounts that can access the same repository

## Test Scenarios

### 1. Basic Repository Fingerprinting

**Objective**: Verify that the application correctly generates and stores fingerprints for repositories.

**Steps**:
1. Log in to the application with your GitHub account
2. Navigate to the Analyze page
3. Enter a PR URL from one of your GitHub repositories
4. Open your browser's developer tools and check the API calls or logs
5. Look for evidence that a fingerprint was generated and stored

**Expected Results**:
- The application should generate a fingerprint for the repository
- The fingerprint should be stored in the database
- The repository should appear in your dashboard with "4 free analyses remaining" (since 1 was used)

### 2. Analysis Count Tracking

**Objective**: Verify that the application correctly tracks the number of analyses performed on a repository.

**Steps**:
1. Analyze another PR from the same repository
2. Check the repository details in your dashboard

**Expected Results**:
- The analysis count for the repository should increase to 2
- The UI should display "3 free analyses remaining"

### 3. Cross-User Fingerprinting

**Objective**: Verify that the application correctly identifies the same repository across different user accounts.

**Steps**:
1. Log out of the application
2. Log in with a different user account that has access to the same repository
3. Analyze a PR from the same repository
4. Check the repository details in the dashboard

**Expected Results**:
- The application should recognize the repository as the same one (using the fingerprint)
- The analysis count should now be 3, not 1 (it's tracking per repository, not per user)
- The UI should display "2 free analyses remaining"

### 4. Free Tier Limit Enforcement

**Objective**: Verify that the application enforces the free tier analysis limit.

**Steps**:
1. Continue analyzing PRs from the same repository until you've performed 5 analyses total
2. Attempt to analyze another PR from the same repository

**Expected Results**:
- After 5 analyses, the UI should display "0 free analyses remaining"
- When attempting the 6th analysis, the application should:
  - Show an error or warning message about reaching the free tier limit
  - Prompt the user to upgrade to a paid plan
  - Block the analysis request

### 5. Bypass Limit for Premium Users

**Objective**: Verify that premium users can bypass the analysis limit.

**Steps**:
1. Modify the user account to have premium status (this might require database manipulation or using an admin account)
2. Attempt to analyze more PRs from the same repository that has reached its limit

**Expected Results**:
- The application should allow premium users to analyze PRs even if the repository has reached its free tier limit
- The analysis count should continue to increment (6, 7, etc.)
- No error messages about limits should be displayed

### 6. Repository Name Normalization

**Objective**: Verify that the fingerprinting is case-insensitive and handles slight variations in repository names.

**Steps**:
1. Analyze a PR using a URL with different capitalization in the repository name (e.g., `github.com/Owner/Repo` instead of `github.com/owner/repo`)

**Expected Results**:
- The application should identify this as the same repository
- The analysis count should increment based on previous usage
- The UI should display the correct number of remaining free analyses

### 7. Error Handling for Limit Exceeded

**Objective**: Verify that the application handles limit-exceeded errors gracefully.

**Steps**:
1. Use a free tier account on a repository that has reached its limit
2. Try to force an analysis by bypassing UI restrictions (e.g., API call)

**Expected Results**:
- The backend should return a clear error message
- The UI should display a helpful message explaining the limit
- The application should not crash or show generic error messages

## Verification Steps

For each test scenario, verify the following:

1. **UI Feedback**: Check that the UI correctly displays the analysis count and limits
2. **Database State**: Verify that the database contains the correct fingerprint and analysis count
3. **Error Handling**: Ensure errors are handled gracefully with clear user messaging
4. **Performance**: The fingerprinting and checking should not noticeably slow down the application

## Test Recording

For each test scenario, record:

1. The repository used
2. User accounts tested
3. Initial analysis count
4. Actions performed
5. Final analysis count
6. Any errors or unexpected behavior
7. Screenshots of key steps (especially error messages and limit notifications)

This documentation will help QA verify the implementation and identify any edge cases or issues.
