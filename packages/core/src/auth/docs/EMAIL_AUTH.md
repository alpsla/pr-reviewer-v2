# Email Authentication Service

## Overview

The Email Authentication Service provides a secure, passwordless authentication system using magic links. It leverages Supabase's built-in email and authentication infrastructure to handle the entire flow.

## Setup

### 1. Supabase Configuration

First, ensure email authentication is enabled in your Supabase project:

1. Go to your Supabase dashboard
2. Navigate to Authentication > Providers
3. Enable "Email" provider
4. Optional: Configure custom email templates in Supabase dashboard

### 2. Service Configuration

```typescript
import { AuthService } from "@pr-reviewer/core";

const emailConfig = {
  // URL where users will be redirected after clicking the magic link
  redirectTo: "https://your-app.com/auth/callback",

  // Optional: Configure email template
  emailTemplate: {
    subject: "Sign in to Your App",
    from: "noreply@your-app.com", // Will use Supabase's default if not specified
    template: "magic-link",
    buttonText: "Sign In", // Customize the button text in the email
  },

  // Optional: Configure token expiry (default: 60 minutes)
  tokenExpiryMinutes: 60,
};

const authService = new AuthService(
  supabaseClient,
  databaseService,
  authProviderConfig,
  emailConfig,
);
```

## Usage

### 1. Sending Magic Links

```typescript
try {
  // Send magic link to user's email
  await authService.signInWithEmail("user@example.com");
  // Success - email sent
} catch (error) {
  // Handle error
  console.error("Failed to send magic link:", error);
}
```

### 2. Handling Magic Link Callback

```typescript
// In your callback route handler
async function handleAuthCallback(token: string) {
  try {
    // Verify the magic link token
    const { user, session } = await authService.verifyEmailLink(token);

    // Success - user is authenticated
    // Store session, redirect user, etc.
    return { user, session };
  } catch (error) {
    // Handle error
    console.error("Failed to verify magic link:", error);
    throw error;
  }
}
```

### 3. Session Management

```typescript
// Refresh token
const refreshToken = currentSession.refresh_token;
try {
  const newSession = await emailAuth.refreshToken(refreshToken);
  // Update session storage with new tokens
} catch (error) {
  // Handle refresh error
}

// Sign out
try {
  await emailAuth.signOut(sessionId);
  // Clear local session data
} catch (error) {
  // Handle sign out error
}
```

## Security Considerations

1. **Token Expiry**: Magic links expire after the configured time (default: 60 minutes)
2. **Single Use**: Each magic link can only be used once
3. **Rate Limiting**: Supabase provides built-in rate limiting for email sending
4. **Email Verification**: Users are automatically verified when they click the magic link

## Error Handling

The service throws `AuthError` in various scenarios:

```typescript
try {
  await authService.signInWithEmail(email);
} catch (error) {
  if (error instanceof AuthError) {
    switch (error.code) {
      case "AUTH_ERROR":
        // Handle general auth errors
        break;
      case "RATE_LIMITED":
        // Handle rate limiting
        break;
      default:
        // Handle other errors
        break;
    }
  }
}
```

## Important Notes

1. **Email Service**:

   - You don't need to set up a separate email service or email account
   - Supabase handles all email sending infrastructure
   - Default sender will be from Supabase's domain
   - You can customize sender email in Supabase dashboard:
     - Go to Authentication > Email Templates
     - Update the "From" email address

2. **Email Templates**:

   - Default templates are provided by Supabase
   - Can be customized in Supabase dashboard
   - Support HTML and text versions
   - Variables can be used in templates

3. **Custom Domain**:

   - If you want to send from your domain (e.g., auth@codequal.dev):
     1. Set up SPF and DKIM records for your domain
     2. Verify domain ownership in Supabase
     3. Configure custom sender in email templates

4. **Testing**:
   - In development, emails are logged in Supabase dashboard
   - Can use test email services (like Mailtrap) by configuring SMTP
   - Rate limits are more relaxed in development

## Best Practices

1. **Rate Limiting**:

   - Implement API-level rate limiting
   - Monitor failed attempts
   - Consider IP-based restrictions

2. **Error Messages**:

   - Don't reveal if email exists
   - Use generic error messages
   - Log detailed errors server-side

3. **Security**:

   - Use HTTPS for callback URLs
   - Implement proper session management
   - Consider adding additional verification steps

4. **Monitoring**:
   - Monitor failed login attempts
   - Track email delivery rates
   - Set up alerts for unusual patterns
