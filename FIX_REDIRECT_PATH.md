# Fix Redirect Path Issue

## Problem
Password reset email redirects to `https://mellifluous-paletas-ce0b1c.netlify.app/#` instead of `/auth/reset-password`.

## Solution Applied

I've added a redirect handler in the root page (`src/app/page.tsx`) that detects password reset tokens in the URL hash and automatically redirects to the reset password page.

## Additional Fix Needed in Supabase

### Update Supabase Email Template Redirect URL

1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Open the **Reset Password** template
3. Find the redirect URL field
4. Make sure it's set to the **full path**:
   ```
   https://mellifluous-paletas-ce0b1c.netlify.app/auth/reset-password
   ```
   **NOT just:**
   ```
   https://mellifluous-paletas-ce0b1c.netlify.app
   ```
5. Save the template

### Verify Redirect URLs in Supabase

1. Go to **Authentication** → **URL Configuration**
2. Make sure **Redirect URLs** includes:
   ```
   https://mellifluous-paletas-ce0b1c.netlify.app/auth/reset-password
   ```
3. Save

## How It Works Now

1. If Supabase redirects to root with hash (`/#access_token=...`), the root page detects it and redirects to `/auth/reset-password#access_token=...`
2. The reset password page then processes the token and shows the form

## Testing

1. Request a new password reset email
2. Click the link
3. It should now work whether Supabase redirects to root or directly to `/auth/reset-password`

