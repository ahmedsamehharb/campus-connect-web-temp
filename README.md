# Campus Connect 🎓

A comprehensive student community app built with Next.js and Supabase - your complete digital campus ecosystem.

## ✨ Features

### Core Features
- 🔐 **Authentication** - Secure login/signup with Supabase Auth
- 📅 **Events** - Browse and join campus events with RSVP tracking
- 👥 **Community** - Post questions, share discussions, and help fellow students
- ❓ **FAQ** - Searchable, collapsible frequently asked questions
- ✨ **Animations** - Smooth page transitions and micro-interactions

### Full Feature Set (24 Categories)
- 🎓 **Academic Management** - Grades, courses, GPA tracking, degree planning
- 💰 **Financial Services** - Tuition, wallet, transactions, meal plan balance
- 🍽️ **Campus Dining** - Menus, nutrition info, dining locations
- 🚌 **Transportation** - Bus routes, parking, campus navigation
- 📚 **Study Spaces** - Library rooms, booking, availability
- 🤖 **AI Assistant** - Intelligent tutoring and study help
- 💬 **Messaging** - Direct messages and group chats
- 💼 **Career Services** - Job listings, applications, career fairs
- 🧘 **Wellness** - Mood tracking, mental health resources
- 🏆 **Gamification** - Achievements, points, streaks
- 🔔 **Smart Notifications** - Priority-based alerts
- 🔍 **Universal Search** - Find anything on campus

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔧 Backend Setup (Supabase)

**See [SETUP.md](./SETUP.md) for detailed instructions.**

Quick steps:
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create `.env.local` with your API keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Run the SQL schema in `supabase-schema.sql`
4. Restart your dev server

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Login page
│   ├── providers.tsx      # Auth context provider
│   ├── dashboard/         # Main dashboard with all features
│   │   ├── academics/     # Academic management
│   │   ├── financial/     # Financial services
│   │   ├── dining/        # Campus dining
│   │   ├── transport/     # Transportation
│   │   ├── study/         # Study rooms
│   │   ├── ai/            # AI assistant
│   │   ├── messages/      # Messaging
│   │   ├── career/        # Career services
│   │   ├── wellness/      # Wellness support
│   │   ├── achievements/  # Gamification
│   │   ├── events/        # Events calendar
│   │   ├── community/     # Community forums
│   │   └── notifications/ # Notifications
│   └── event/[id]/        # Event details page
├── components/            # Reusable React components
│   └── tabs/              # Tab content components
├── context/               # React contexts (Auth)
├── data/                  # Placeholder data & Lottie animations
├── hooks/                 # Custom React hooks
├── lib/                   # Supabase client & API functions
└── styles/                # Global styles & CSS variables
```

## 🗄️ Database Schema

Key tables:
- `profiles` - User profiles (auto-created on auth)
- `courses` & `enrollments` - Course management
- `assignments` - Assignment tracking
- `events` & `event_attendees` - Event management
- `posts` & `post_replies` - Community forum
- `faqs` - FAQ database
- `transactions` & `financial_summary` - Financial data
- `study_rooms` & `room_bookings` - Study space management
- `jobs` & `job_applications` - Career services
- `notifications` - User notifications
- `achievements` & `user_stats` - Gamification

See `supabase-schema.sql` for complete schema with RLS policies.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: CSS Modules with CSS Variables
- **Animations**: Framer Motion + Lottie
- **Icons**: Lucide React
- **Language**: TypeScript

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Secure authentication with Supabase Auth
- Private data protected per-user
- Safe client-side API keys (anon keys only)

## 📱 Design

- Blue & white professional theme
- Mobile-first responsive design
- Smooth animations and transitions
- Accessible UI components

## License

MIT
