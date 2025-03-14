# Manual Testing Guide

This document provides comprehensive testing procedures for key features of the PR Reviewer application.

## Repository Access Verification Testing

### Test Objective
Verify that the repository access verification system correctly identifies whether a user has access to a repository before allowing PR analysis.

### Prerequisites
- A GitHub account with access to both public and private repositories
- A GitLab account with access to both public and private repositories
- The PR Reviewer application running locally or in a test environment

### Test Cases

#### 1. Authentication Token Testing

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| AUTH-1 | GitHub login repository access | 1. Log in with GitHub<br>2. Enter GitHub PR URL<br>3. Observe validation | System should validate access and show "Access Verified" | ⬜ |
| AUTH-2 | GitLab login repository access | 1. Log in with GitLab<br>2. Enter GitLab PR URL<br>3. Observe validation | System should validate access and show "Access Verified" | ⬜ |
| AUTH-3 | Cross-platform authentication | 1. Log in with GitHub<br>2. Enter GitLab PR URL<br>3. Observe validation | System should show error message about needing GitLab authentication | ⬜ |
| AUTH-4 | Token refresh | 1. Log in<br>2. Wait for token to approach expiry<br>3. Enter PR URL | System should refresh token automatically and proceed with validation | ⬜ |

#### 2. Private Repository Testing

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| PRIV-1 | Own private repository access | 1. Log in with GitHub<br>2. Enter URL of own private repository PR<br>3. Observe validation | System should verify access and show Private badge | ⬜ |
| PRIV-2 | Shared private repository access | 1. Log in with GitHub<br>2. Enter URL of a shared private repository PR<br>3. Observe validation | System should verify access and show Private badge | ⬜ |
| PRIV-3 | No-access private repository | 1. Log in with GitHub<br>2. Enter URL of private repository without access<br>3. Observe validation | System should show access denied error and prevent analysis | ⬜ |
| PRIV-4 | Private repository UI indicator | 1. Log in<br>2. Enter private repository PR URL<br>3. Observe UI after validation | "Private" badge should appear in repository preview section | ⬜ |

#### 3. Error Handling

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| ERR-1 | Invalid GitHub token | 1. Modify code to use invalid GitHub token<br>2. Attempt to access GitHub repository | System should show clear authentication error message | ⬜ |
| ERR-2 | Network failure during verification | 1. Simulate network failure<br>2. Attempt to verify repository access | System should show appropriate network error message | ⬜ |
| ERR-3 | Repository not found | 1. Enter PR URL for non-existent repository<br>2. Observe validation | System should show "Repository not found" error | ⬜ |
| ERR-4 | Rate limit handling | 1. Exceed GitHub/GitLab API rate limits<br>2. Attempt repository access | System should show rate limit error with appropriate guidance | ⬜ |

#### 4. UI Feedback

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| UI-1 | Access verification loading state | 1. Enter valid PR URL<br>2. Observe UI during verification | Loading indicator should appear during verification process | ⬜ |
| UI-2 | Access verification success state | 1. Enter valid PR URL<br>2. Observe UI after successful verification | Success indicator should appear after verification | ⬜ |
| UI-3 | Access verification error state | 1. Enter invalid PR URL<br>2. Observe UI after failed verification | Error message should appear with clear guidance | ⬜ |
| UI-4 | Private repository indicator | 1. Enter private repository PR URL<br>2. Observe repository preview | "Private" badge should be visible in repository details | ⬜ |

## Repository Fingerprinting Testing

### Test Objective
Verify that the repository fingerprinting system correctly identifies unique repositories and tracks usage limits across different authentication methods.

### Prerequisites
- GitHub and GitLab accounts
- Access to multiple repositories on both platforms
- A test environment with database access for verification

### Test Cases

#### 1. Cross-Platform Analysis Limits (Completed)

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| FP-1 | Cross-platform fingerprint consistency | 1. Log in with GitHub<br>2. Analyze repository<br>3. Log out and log in with GitLab<br>4. Analyze same repository | System should recognize as the same repository despite different login methods | ⬜ |
| FP-2 | Limit tracking across platforms | 1. Analyze repository 4 times with GitHub login<br>2. Log in with GitLab<br>3. Analyze same repository | System should show 4/5 analyses used | ⬜ |
| FP-3 | Limit reached notification | 1. Analyze repository 5 times<br>2. Attempt 6th analysis | System should show limit reached message and block analysis | ⬜ |
| FP-4 | Consistent limit messaging | 1. Reach limit on repository<br>2. Log in with different account<br>3. Attempt analysis | Limit message should be consistent regardless of login method | ⬜ |

#### 2. Multiple Repository Testing  (Completed)

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| FP-5 | Independent repository tracking | 1. Analyze repository A<br>2. Analyze repository B<br>3. Check usage counts | Each repository should have its own analysis count | ⬜ |
| FP-6 | Similar name repositories | 1. Analyze repository "owner1/repo"<br>2. Analyze repository "owner2/repo"<br>3. Check fingerprints | System should create different fingerprints despite same repo name | ⬜ |
| FP-7 | Case sensitivity | 1. Analyze "Owner/Repo"<br>2. Analyze "owner/repo"<br>3. Check fingerprints | System should recognize these as the same repository | ⬜ |

#### 3. Edge Cases

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| FP-8 | Special characters in names | 1. Analyze repository with special characters<br>2. Verify fingerprint generation | System should normalize and handle special characters correctly | ⬜ |
| FP-9 | Very large PRs | 1. Analyze PR with 1000+ files<br>2. Observe system behavior | System should handle large PRs without performance issues | ⬜ |
| FP-10 | Public/private repository switch | 1. Analyze public repository<br>2. Make repository private<br>3. Analyze again | System should maintain the same fingerprint | ⬜ |

#### 4. Premium Tier Testing

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| FP-11 | Premium tier bypass | 1. Reach analysis limit on repository<br>2. Upgrade to premium tier<br>3. Attempt analysis | System should allow analysis despite limit being reached | ⬜ |
| FP-12 | Downgrade handling | 1. Analyze with premium tier<br>2. Downgrade to free tier<br>3. Continue analyzing | System should enforce limits after downgrade | ⬜ |

#### 5. Database Integrity

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| FP-13 | Consistent fingerprint storage | 1. Generate fingerprints for several repositories<br>2. Check database records | Fingerprints should be consistently stored in the database | ⬜ |
| FP-14 | Analysis count accuracy | 1. Analyze repository multiple times<br>2. Check database records<br>3. Compare with UI display | Database count should match displayed count | ⬜ |

## Combined Repository Access and Fingerprinting Testing

### Test Objective
Verify that the repository access verification and fingerprinting systems work together correctly.

### Test Cases

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| COMB-1 | Access denial before fingerprinting | 1. Enter private repo without access<br>2. Attempt analysis | System should deny access before fingerprinting or analysis count incrementing | ⬜ |
| COMB-2 | Limit check after access verification | 1. Enter repository at limit<br>2. Verify system behavior | System should first verify access, then check limits before allowing analysis | ⬜ |
| COMB-3 | UI progression | 1. Enter valid PR URL<br>2. Observe UI progression | UI should show: validating URL → checking access → checking limits → analysis | ⬜ |
| COMB-4 | Error handling sequence | 1. Enter invalid URLs of various types<br>2. Observe error sequence | Errors should appear in proper sequence (URL validation → access → limits) | ⬜ |

## Performance Testing

### Test Objective
Ensure the repository access verification and fingerprinting systems perform efficiently.

### Test Cases

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| PERF-1 | Access verification speed | 1. Measure time for access verification<br>2. Repeat across multiple repositories | Access verification should complete in under 2 seconds | ⬜ |
| PERF-2 | Fingerprinting speed | 1. Measure time for fingerprint generation<br>2. Repeat across multiple repositories | Fingerprinting should complete in under 500ms | ⬜ |
| PERF-3 | Full verification flow timing | 1. Measure complete flow from URL input to analysis start<br>2. Test with both new and previously analyzed repositories | Complete flow should complete in under 5 seconds for previously analyzed repos | ⬜ |
| PERF-4 | Response under load | 1. Simulate multiple concurrent repository access checks<br>2. Measure response times | System should maintain acceptable performance under load | ⬜ |

## Security Testing

### Test Objective
Verify that the repository access verification and fingerprinting systems are secure and cannot be bypassed.

### Test Cases

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| SEC-1 | Token tampering | 1. Attempt to modify authentication token<br>2. Try to access repository | System should reject modified tokens | ⬜ |
| SEC-2 | API request forgery | 1. Use tools to forge API requests<br>2. Bypass frontend validation | Backend verification should still enforce access controls | ⬜ |
| SEC-3 | Analysis limit bypass | 1. Attempt to bypass repository limit via request manipulation<br>2. Check if limit is enforced | System should maintain proper limit enforcement | ⬜ |
| SEC-4 | Cross-user access | 1. Analyze repository as User A<br>2. Log in as User B<br>3. Try to access User A's analysis | System should prevent access to analyses from other users | ⬜ |

## Regression Testing

### Test Objective
Ensure that previous functionality continues to work correctly after implementing repository access verification.

### Test Cases

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| REG-1 | Public repository analysis | 1. Enter public repository PR URL<br>2. Complete analysis<br>3. Verify results | Analysis should complete successfully with correct results | ⬜ |
| REG-2 | Repository history | 1. Analyze multiple repositories<br>2. Check repository history in dashboard | All analyzed repositories should appear in history | ⬜ |
| REG-3 | Analysis results persistence | 1. Analyze repository<br>2. Log out and log back in<br>3. Check analysis results | Results should persist across sessions | ⬜ |
| REG-4 | Navigation flow | 1. Complete analysis flow<br>2. Navigate through various screens | Navigation should work correctly with all components functional | ⬜ |

## Reporting Test Results

When executing these tests, use the following format to report results:

```
Test ID: [ID]
Date: [YYYY-MM-DD]
Tester: [Name]
Status: [Pass/Fail/Partial]
Observations:
- [Observation 1]
- [Observation 2]
Issues Found:
- [Issue 1]
- [Issue 2]
Screenshots/Logs: [Links if applicable]
```

## Test Execution Plan

1. Execute Authentication Token Testing (AUTH-1 to AUTH-4)
2. Execute Private Repository Testing (PRIV-1 to PRIV-4)
3. Execute Error Handling Tests (ERR-1 to ERR-4)
4. Execute UI Feedback Tests (UI-1 to UI-4)
5. Execute Cross-Platform Analysis Limits Tests (FP-1 to FP-4)
6. Execute Multiple Repository Testing (FP-5 to FP-7)
7. Execute Edge Cases Tests (FP-8 to FP-10)
8. Execute Premium Tier Testing (FP-11 to FP-12)
9. Execute Database Integrity Tests (FP-13 to FP-14)
10. Execute Combined Tests (COMB-1 to COMB-4)
11. Execute Performance Tests (PERF-1 to PERF-4)
12. Execute Security Tests (SEC-1 to SEC-4)
13. Execute Regression Tests (REG-1 to REG-4)

## Success Criteria

The repository access verification and fingerprinting features will be considered successfully implemented when:

1. All test cases pass without critical issues
2. Private repository access is correctly verified before analysis
3. Repository fingerprinting consistently identifies repositories across platforms
4. Analysis limits are correctly enforced based on fingerprints
5. The system maintains performance under load
6. No security vulnerabilities are identified
7. The user experience remains smooth and intuitive

## Issue Tracking

All issues found during testing should be documented with the following information:
- Issue ID
- Related Test Case ID
- Severity (Critical, Major, Minor, Cosmetic)
- Description
- Steps to Reproduce
- Expected vs. Actual Behavior
- Screenshots/Logs
- Suggested Fix (if applicable)
