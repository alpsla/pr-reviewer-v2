# Platform Integration Guide

This guide explains how our PR Reviewer application integrates with different platforms (GitHub, GitLab) and the mechanisms we use to handle both authenticated and public repository access.

## Overview

The PR Reviewer application supports multiple version control platforms:

- GitHub (github.com)
- GitLab (gitlab.com)

We provide different methods of repository access depending on the authentication status and repository visibility:

1. **Same-Platform Authenticated**: User is signed in with Platform A and accessing Platform A repositories
2. **Cross-Platform Authenticated**: User is signed in with Platform A but accessing Platform B repositories
3. **Public Repository Access**: Access to public repositories regardless of authentication

## Authentication Mechanisms

### GitHub Authentication

- **OAuth Flow**: We use GitHub's OAuth 2.0 flow for user authentication
- **Token Storage**: Tokens are stored securely and encrypted in our database
- **Scopes Required**: `repo`, `read:user`, `user:email`
- **Refresh Mechanism**: GitHub tokens don't expire but may be revoked by users

### GitLab Authentication

- **OAuth Flow**: We use GitLab's OAuth 2.0 flow for user authentication
- **Token Storage**: Tokens are stored securely and encrypted in our database
- **Scopes Required**: `api`, `read_user`
- **Refresh Mechanism**: We handle GitLab refresh tokens when main tokens expire

## Cross-Platform Access

The application supports cross-platform access with certain limitations:

### Authenticated Cross-Platform Access

- **GitHub → GitLab**: Users with GitHub authentication can access GitLab repositories
- **GitLab → GitHub**: Users with GitLab authentication can access only **public** GitHub repositories

### Technical Implementation

Our cross-platform support uses a proactive approach:

1. **Public Repository Detection**: We first check if a repository is public without authentication
2. **Token Sharing**: GitHub tokens can be used for GitLab API calls in some cases
3. **Public Repository Fallback**: For public repositories, we create special database records

## Repository Access Logic

The application uses the following decision tree for repository access:

```
Is the repository public?
├── Yes
│   ├── Is the user authenticated?
│   │   ├── Yes → Use appropriate platform token
│   │   └── No → Use public repository handling
│   │
│   └── Is this cross-platform access?
│       ├── Yes → Use public repository handling
│       └── No → Use normal authenticated access
│
└── No
    ├── Is the user authenticated?
    │   ├── Yes → Check if proper platform
    │   │   ├── Yes → Use normal authenticated access
    │   │   └── No → Return access denied error
    │   │
    │   └── No → Return authentication required error
```

## Troubleshooting Common Issues

### 1. Cross-Platform Authentication Errors

When users encounter "Access denied: Cross-platform authentication issue":

- **Cause**: GitLab user trying to access private GitHub repository
- **Solution**: Ask user to sign in with GitHub account instead

### 2. Rate Limiting Issues

When "Rate limit exceeded" errors appear:

- **Check**: Monitor API rate limit consumption in logs
- **Solution**: Implement rate limit protection or ask user to try again later

### 3. Public Repository Access Failures

When public repository detection fails:

- **Check**: Verify GitHub/GitLab public API endpoints are working
- **Solution**: Run `verifyPublicApiEndpoints()` to check public API health

## Monitoring and Alerts

We monitor platform integration health through:

1. **API Health Checks**: Regular verification of public API endpoints
2. **Error Rate Tracking**: Monitoring cross-platform errors and authentication failures
3. **Response Time Monitoring**: Tracking latency of platform API calls

Set up alerts for:
- Sustained high error rates from platform APIs
- Changes in public API response structures
- Authentication failure patterns

## Future Improvements

Planned enhancements to platform integration:

1. **BitBucket Support**: Adding Bitbucket as a supported platform
2. **Self-Hosted GitLab**: Support for self-hosted GitLab instances
3. **Enhanced Public Repo Data**: Better PR data for public repositories without authentication
4. **API Caching**: Improved caching mechanisms for API responses

## Support Procedures

When handling platform integration issues:

1. **Verify Platform Status**: Check GitHub/GitLab status pages for outages
2. **Check API Documentation**: Confirm if there are API changes or deprecations
3. **Examine Logs**: Look for patterns in API responses or errors
4. **Test with Known Repos**: Use test repositories to verify functionality

---

*Last updated: March 2025*
