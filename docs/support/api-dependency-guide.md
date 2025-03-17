# External API Dependencies Guide

This document outlines the external APIs that our PR Reviewer application depends on, how they're used, potential issues, and troubleshooting guidance for support staff.

## Public Repository Detection APIs

These APIs are used to check if a repository is public without requiring authentication.

### GitHub Public API

- **Endpoint**: `https://api.github.com/repos/{owner}/{repo}`
- **Expected Status**: 
  - 200 for public repos
  - 404 for non-existent repos
  - 403 for private repos or rate limiting
- **Used for**: Checking if a repository is public without authentication
- **Headers**: 
  - `Accept: application/vnd.github.v3+json` 
  - `User-Agent: PR-Reviewer-App/1.0`
- **Last Verified**: March 2025

### GitLab Public API

- **Endpoint**: `https://gitlab.com/api/v4/projects/{owner}%2F{repo}`
- **Expected Status**: 
  - 200 for public repos
  - 404 for non-existent repos
  - 403 for private repos or rate limiting
- **Used for**: Checking if a repository is public without authentication
- **Headers**: 
  - `User-Agent: PR-Reviewer-App/1.0`
- **Last Verified**: March 2025

## Implementation Details

The public repository detection is implemented in:
- `packages/core/src/utils/public-repository-checker.ts`

This utility is used primarily in:
- `apps/web/src/app/api/prs/[owner]/[repo]/[number]/basic-details/route.ts`
- Other routes that need to determine repository visibility

## Troubleshooting

### Common Error Messages

#### `GITHUB_PUBLIC_API_ERROR: Status 403 when checking if {owner}/{repo} is public`
- **Possible causes**: 
  - GitHub API changes
  - Rate limiting 
  - Repository is private
- **Solution**: 
  - Check GitHub API documentation for changes
  - Consider implementing rate limit backoff
  - Verify the repository existence and visibility

#### `GITLAB_PUBLIC_API_ERROR: Status 404 when checking if {owner}/{repo} is public`
- **Possible causes**: 
  - GitLab API endpoint changes
  - Repository path format changed
  - Repository doesn't exist
- **Solution**: 
  - Verify GitLab API documentation 
  - Update URL encoding if needed
  - Check if repository exists and is spelled correctly

#### `UNSUPPORTED_PLATFORM: {platform} is not supported for public API checks`
- **Possible causes**: 
  - Code is trying to use a platform we don't support
  - Platform parameter value is incorrect
- **Solution**:
  - Verify the platform parameter is 'github' or 'gitlab'
  - Add support for the new platform if needed

### API Changes Detection

The `verifyPublicApiEndpoints` function in `public-repository-checker.ts` can be used to proactively check if the public API endpoints are still working. It verifies access to known public repositories.

We recommend running this check periodically as part of system health monitoring.

### Handling API Version Changes

GitHub sometimes changes its API behavior or structure. Our implementation:

1. Uses explicit API version headers when available
2. Logs API version headers returned by GitHub
3. Validates expected fields in responses to detect changes

If GitHub or GitLab changes their API behavior, look for logs containing:
- `GitHub API version used`
- `Missing expected fields`
- `Unexpected API response`

## Response Structure Validation

We validate response structures from external APIs to detect changes. We check:

1. Expected fields existence (e.g., 'id', 'visibility', 'private')
2. Field type correctness
3. Response structure consistency

If response validation fails, you'll see these logs:
- `Public API response missing expected fields`
- Lists of expected vs. received fields

## When to Update the Code

Consider updating the code when:

1. GitHub or GitLab announces API changes
2. Logs show consistent errors from public API checks
3. Success rates for public repository checks drop significantly
4. API version headers change

## Adding Support for New Platforms

To add support for a new platform:

1. Update the `Platform` type in `public-repository-checker.ts`
2. Add platform-specific logic in `getPublicApiEndpoint`
3. Implement platform-specific response parsing in `isPublicRepository`
4. Add a known public repository for the platform in `verifyPublicApiEndpoints`
5. Update this documentation

## Getting Help

For issues not covered in this guide:

1. Check GitHub/GitLab API documentation for changes
2. Review application logs for error patterns
3. Test API endpoints directly using curl or Postman
4. Contact the development team with details about the specific error and affected repositories

---

*Last updated: March 2025*
