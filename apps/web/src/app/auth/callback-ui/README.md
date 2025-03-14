# Auth Callback UI Page

This directory contains the UI for the authentication callback process. It handles displaying loading, success, and error states during the authentication flow.

The actual OAuth callback handling is performed by the API route at `/auth/callback/route.ts`. This separation is necessary to avoid Next.js routing conflicts that occur when a page component and API route handler exist at the same path.

## Flow

1. The user is redirected to this page after authentication by an OAuth provider
2. This page displays a loading state while checking for an active session
3. Once the session is confirmed, it displays a success message and redirects to the dashboard
4. If an error occurs, it displays an error message with an option to return to the home page

## References

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
