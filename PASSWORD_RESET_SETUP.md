# Password Reset Setup Guide

This guide explains how to set up and use the password reset functionality in your Campus Connect app.

## Overview

The password reset feature allows users to reset their forgotten passwords via email. The reset page is located at `/auth/reset-password` and is **not publicly visible** - it can only be accessed through the reset link sent via email.

## How It Works

1. User requests a password reset (via your app or Supabase dashboard)
2. Supabase sends an email with a reset link
3. User clicks the link, which redirects to `/auth/reset-password` with a token
4. The page verifies the token and shows a password reset form
5. User enters and confirms their new password
6. Password is updated and user is redirected to login

## Supabase Configuration

### Step 1: Configure Email Templates

1. Go to your **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Find the **Reset Password** template
3. Update the redirect URL to point to your reset password page:

**For Local Development:**
```
http://localhost:3000/auth/reset-password
```

**For Production (Netlify):**
```
https://your-site.netlify.app/auth/reset-password
```

### Step 2: Configure Site URL and Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Set the **Site URL**:
   - Local: `http://localhost:3000`
   - Production: `https://your-site.netlify.app`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/reset-password`
   - `https://your-site.netlify.app/auth/reset-password`
   - `http://localhost:3000/auth/callback` (for other auth flows)
   - `https://your-site.netlify.app/auth/callback`

### Step 3: Enable Email Provider

1. Go to **Authentication** → **Providers**
2. Make sure **Email** provider is enabled
3. Configure email settings as needed

## Using Password Reset in Your App

### Option 1: Add "Forgot Password" Link to Login Page

You can add a "Forgot Password" link to your login page that calls the reset function:

```tsx
import { auth } from '@/lib/supabase';

const handleForgotPassword = async (email: string) => {
  const { error } = await auth.resetPasswordForEmail(email);
  if (error) {
    console.error('Error sending reset email:', error);
    // Show error message to user
  } else {
    // Show success message: "Check your email for reset instructions"
  }
};
```

### Option 2: Use Supabase Dashboard

Users can also request password resets directly from the Supabase dashboard:
1. Go to **Authentication** → **Users**
2. Find the user
3. Click **Send password reset email**

## Testing Password Reset Locally

### Step 1: Start Your Development Server

```bash
npm run dev
```

### Step 2: Request a Password Reset

You can test the reset flow by:

1. **Using the Supabase Dashboard:**
   - Go to **Authentication** → **Users**
   - Find or create a test user
   - Click **Send password reset email**

2. **Or add a test button to your login page:**
   ```tsx
   <button onClick={() => auth.resetPasswordForEmail('test@example.com')}>
     Test Reset Email
   </button>
   ```

### Step 3: Check Your Email

- Supabase will send a reset email to the user's email address
- The email contains a link that looks like:
  ```
  http://localhost:3000/auth/reset-password#access_token=...&type=recovery
  ```

### Step 4: Click the Reset Link

- The link will open your app at `/auth/reset-password`
- The page will automatically verify the token
- If valid, it will show the password reset form
- If invalid/expired, it will show an error message

### Step 5: Reset Password

- Enter a new password (minimum 6 characters)
- Confirm the password
- Click "Update Password"
- You'll be redirected to the login page after success

## Security Features

1. **Token Verification**: The page verifies the reset token before showing the form
2. **Expiration Handling**: Expired tokens are detected and users are prompted to request a new one
3. **Password Validation**: Minimum 6 characters required
4. **Password Confirmation**: Users must confirm their new password
5. **Not Publicly Accessible**: The page is only accessible via email links (no navigation links to it)

## Troubleshooting

### Issue: "Invalid or expired reset link"

**Causes:**
- Token has expired (default: 1 hour)
- Token has already been used
- URL configuration in Supabase is incorrect

**Solutions:**
1. Request a new password reset email
2. Verify redirect URLs in Supabase dashboard
3. Check that `NEXT_PUBLIC_SITE_URL` is set correctly in your environment variables

### Issue: Reset email not received

**Causes:**
- Email provider not configured
- Email in spam folder
- Wrong email address

**Solutions:**
1. Check spam/junk folder
2. Verify email address is correct
3. Check Supabase email logs in dashboard
4. Ensure email provider is enabled

### Issue: Page shows "Verifying" indefinitely

**Causes:**
- Token format issue
- Network error
- Supabase client not initialized

**Solutions:**
1. Check browser console for errors
2. Verify Supabase environment variables are set
3. Try requesting a new reset email

## Code Reference

### Auth Functions (src/lib/supabase.ts)

```typescript
// Request password reset email
auth.resetPasswordForEmail(email: string)

// Update password (called from reset page)
auth.updatePassword(newPassword: string)
```

### Reset Password Page

- Location: `src/app/auth/reset-password/page.tsx`
- Route: `/auth/reset-password`
- Access: Only via email reset links

## Production Deployment

When deploying to Netlify:

1. **Set Environment Variables:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your Netlify URL)

2. **Update Supabase Redirect URLs:**
   - Add your production URL: `https://your-site.netlify.app/auth/reset-password`
   - Update email template redirect URL

3. **Test the Flow:**
   - Request a password reset
   - Verify email is received
   - Test the reset link works
   - Confirm password update succeeds

## Notes

- The reset password page is intentionally not linked in the navigation
- Users can only access it via the email reset link
- Tokens expire after 1 hour (configurable in Supabase)
- Each token can only be used once
- After successful password reset, users are automatically redirected to login

