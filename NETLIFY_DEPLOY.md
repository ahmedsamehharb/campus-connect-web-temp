# Netlify Deployment Guide

## Fixing the Build Error

The build was failing with `Error: supabaseUrl is required` because the Supabase client was being initialized during the build process without environment variables.

## Changes Made

1. **Updated `src/lib/supabase.ts`**: Modified the Supabase client initialization to use placeholder values when environment variables are missing during build time. This allows the build to complete successfully.

2. **Updated `README.md`**: Added a deployment section with instructions for setting environment variables in Netlify.

## Required Steps for Netlify Deployment

### 1. Set Environment Variables in Netlify

Go to your Netlify dashboard:
1. Navigate to **Site settings** → **Environment variables**
2. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
```

**Important**: Replace the placeholder values with your actual Supabase credentials:
- Get `NEXT_PUBLIC_SUPABASE_URL` from Supabase Dashboard → Settings → API → Project URL
- Get `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase Dashboard → Settings → API → anon public key
- Set `NEXT_PUBLIC_SITE_URL` to your Netlify site URL

### 2. Redeploy

After setting the environment variables:
1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Deploy site**
3. The build should now complete successfully

## How the Fix Works

The code now uses placeholder values during build time when environment variables are not available. At runtime, when the app is served, it will use the actual environment variables set in Netlify.

The placeholder values are:
- URL: `https://placeholder-project.supabase.co`
- Key: A placeholder JWT token

These are only used during the build process and will be replaced with real values at runtime.

## Troubleshooting

If you still see build errors:
1. Verify all three environment variables are set in Netlify
2. Check that the values are correct (no extra spaces, correct format)
3. Make sure you're using `NEXT_PUBLIC_` prefix (required for client-side access in Next.js)
4. Redeploy after making changes to environment variables


