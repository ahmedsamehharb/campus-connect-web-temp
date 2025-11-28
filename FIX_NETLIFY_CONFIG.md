# Fix Configuration for mellifluous-paletas-ce0b1c.netlify.app

## Problem
The password reset redirect is working, but the access token is a placeholder, causing authentication to fail.

## Root Cause
The Supabase client is using placeholder values because environment variables aren't set in Netlify for this site.

## Solution

### Step 1: Set Environment Variables in Netlify

1. Go to **Netlify Dashboard** for `mellifluous-paletas-ce0b1c.netlify.app`
2. Navigate to **Site settings** → **Environment variables**
3. Add these three variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
NEXT_PUBLIC_SITE_URL=https://mellifluous-paletas-ce0b1c.netlify.app
```

**Important:**
- Replace `your-actual-project.supabase.co` with your real Supabase project URL
- Replace `your-actual-anon-key-here` with your real Supabase anon key
- Get these from: Supabase Dashboard → Settings → API
- Make sure `NEXT_PUBLIC_SITE_URL` matches your Netlify domain exactly

### Step 2: Update Supabase Redirect URLs

1. Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Set **Site URL** to:
   ```
   https://mellifluous-paletas-ce0b1c.netlify.app
   ```
3. In **Redirect URLs**, add:
   ```
   https://mellifluous-paletas-ce0b1c.netlify.app/auth/reset-password
   https://mellifluous-paletas-ce0b1c.netlify.app/auth/callback
   ```
4. Save changes

### Step 3: Update Email Template

1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Open **Reset Password** template
3. Update redirect URL to:
   ```
   https://mellifluous-paletas-ce0b1c.netlify.app/auth/reset-password
   ```
4. Save

### Step 4: Redeploy on Netlify

1. After setting environment variables, trigger a new deploy:
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**
2. Or push a new commit to trigger automatic deploy

### Step 5: Test

1. Request a new password reset email
2. Click the link - it should redirect to: `https://mellifluous-paletas-ce0b1c.netlify.app/auth/reset-password`
3. The token should now be a real token (not a placeholder)
4. You should be able to reset your password

## Why This Happens

The code uses placeholder values during build when environment variables are missing. At runtime, if the environment variables aren't set, it continues using placeholders, which causes authentication to fail.

Setting the environment variables ensures the Supabase client uses real credentials at runtime.

