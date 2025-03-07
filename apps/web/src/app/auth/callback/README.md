# Auth Callback Directory

**Note: The contents of this directory have been moved to resolve a routing conflict.**

The auth callback functionality has been split into two separate route groups:

1. **API Route Handler**: `/auth/(callback-api)/callback/route.ts`
   - Handles the server-side OAuth callback from providers
   - Processes the authentication code and creates a session

2. **UI Component**: `/auth/(callback-ui)/callback/page.tsx`
   - Provides a user interface for the callback process
   - Shows loading, success, and error states

This approach resolves the Next.js routing conflict that occurs when a page component and API route exist at the same path.

## References

- [Next.js Route Groups Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
