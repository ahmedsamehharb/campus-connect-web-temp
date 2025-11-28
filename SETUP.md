# Campus Connect - Backend Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up (free)
3. Create a new project - name it "campus-connect"
4. Wait ~2 minutes for the project to initialize

### Step 2: Get Your API Keys
1. In your Supabase dashboard, go to **Settings** (gear icon) → **API**
2. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (a long string starting with `eyJ...`)

### Step 3: Create Environment File
Create a file called `.env.local` in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Replace with your actual values from Step 2.

> **Note:** `NEXT_PUBLIC_SITE_URL` should be your production URL when deploying (e.g., `https://your-app.netlify.app`)

### Step 4: Create Database Tables
1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New query"
3. Open `supabase-schema.sql` from this project
4. Copy ALL the SQL content
5. Paste into the SQL Editor
6. Click "Run" (or press Cmd/Ctrl + Enter)

You should see "Success. No rows returned" - that means it worked!

### Step 5: Enable Authentication
1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. (Optional) Disable "Confirm email" for easier testing:
   - Go to **Authentication** → **Settings**
   - Turn off "Enable email confirmations"

### Step 5b: Configure Redirect URLs (Important for Production!)
1. Go to **Authentication** → **URL Configuration**
2. Set the **Site URL** to your production domain (e.g., `https://your-app.netlify.app`)
3. Add your production callback URL to **Redirect URLs**:
   - `https://your-app.netlify.app/auth/callback`
   - Also add `http://localhost:3000/auth/callback` for local development

### Step 6: Restart Your App
```bash
# Stop the running server (Ctrl+C)
# Then restart:
npm run dev
```

## ✅ You're Done!

Now you can:
- **Sign up** with any email/password
- **Sign in** with your account
- All data will be stored in Supabase!

---

## 🔧 Troubleshooting

### "Invalid API key" Error
- Double-check your `.env.local` file exists
- Make sure you copied the **anon public** key (not the secret one)
- Restart your dev server after changing `.env.local`

### "relation does not exist" Error
- Make sure you ran the SQL schema in Step 4
- Check that all queries completed successfully

### Auth Not Working
- Check if Email provider is enabled
- Try disabling email confirmations for testing

### Can't See Data
- Make sure Row Level Security (RLS) policies were created
- Check browser console for specific errors

---

## 📊 Database Overview

The schema creates these main tables:

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (auto-created on signup) |
| `courses` | Available courses |
| `enrollments` | Student course enrollments |
| `assignments` | Course assignments |
| `events` | Campus events |
| `event_attendees` | Event RSVPs |
| `posts` | Community forum posts |
| `faqs` | FAQ entries |
| `transactions` | Financial transactions |
| `study_rooms` | Study room inventory |
| `room_bookings` | Study room reservations |
| `jobs` | Job listings |
| `notifications` | User notifications |
| `achievements` | Gamification achievements |

---

## 🔐 Security Notes

- Row Level Security (RLS) is enabled on all sensitive tables
- Users can only see their own private data
- Public data (courses, events, FAQs) is visible to everyone
- API keys in `.env.local` are safe to use client-side (they're "anon" keys)

---

## 📈 Adding Sample Data

After running the schema, you'll have some sample data:
- 3 sample courses
- 3 sample events
- 5 sample FAQs
- 5 sample achievements

To add more, use the Supabase **Table Editor** or add more INSERT statements to the SQL.

---

## 🚀 Deploying to Netlify

### Step 1: Prepare Your Repository
Make sure your code is pushed to GitHub, GitLab, or Bitbucket.

### Step 2: Create Netlify Site
1. Go to [https://netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Connect your Git provider and select your repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`

### Step 3: Configure Environment Variables
1. In Netlify, go to **Site settings** → **Environment variables**
2. Add these variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_SITE_URL=https://your-site-name.netlify.app
   ```

> **Important:** Set `NEXT_PUBLIC_SITE_URL` to your actual Netlify domain. This is required for email confirmation links to work correctly on mobile devices!

### Step 4: Update Supabase Redirect URLs
After deploying, go back to Supabase:
1. **Authentication** → **URL Configuration**
2. Set **Site URL** to your Netlify domain (e.g., `https://your-app.netlify.app`)
3. Add to **Redirect URLs**:
   - `https://your-app.netlify.app/auth/callback`

### Step 5: Redeploy
Trigger a redeploy in Netlify after setting environment variables to apply changes.

---

## 📱 Email Confirmation Flow

When users sign up, they receive a confirmation email. The link in that email will:
1. Redirect to `/auth/callback` on your site
2. Verify the email and create a session
3. Redirect the user to the dashboard

This works on both desktop and mobile devices as long as:
- `NEXT_PUBLIC_SITE_URL` is set correctly in Netlify
- The redirect URL is added in Supabase URL Configuration

