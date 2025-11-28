-- =============================================
-- CAMPUS CONNECT - SUPABASE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS & PROFILES
-- =============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  student_id TEXT UNIQUE,
  major TEXT,
  minor TEXT,
  year TEXT CHECK (year IN ('Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate')),
  enrollment_date DATE,
  expected_graduation DATE,
  gpa DECIMAL(3,2) DEFAULT 0.00,
  total_credits INTEGER DEFAULT 0,
  advisor TEXT,
  phone TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- COURSES
-- =============================================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  professor TEXT NOT NULL,
  professor_rating DECIMAL(2,1) DEFAULT 0.0,
  credits INTEGER NOT NULL,
  description TEXT,
  prerequisites TEXT[],
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
  capacity INTEGER DEFAULT 30,
  semester TEXT NOT NULL,
  category TEXT CHECK (category IN ('core', 'elective', 'general', 'major')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE course_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL
);

CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('enrolled', 'completed', 'waitlist', 'dropped')) DEFAULT 'enrolled',
  grade TEXT,
  grade_points DECIMAL(3,2),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- =============================================
-- ASSIGNMENTS
-- =============================================
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  due_time TIME DEFAULT '23:59:00',
  max_grade INTEGER DEFAULT 100,
  weight INTEGER DEFAULT 10,
  type TEXT CHECK (type IN ('homework', 'quiz', 'exam', 'project', 'essay', 'lab')),
  estimated_time INTEGER, -- in hours
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assignment_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'submitted', 'graded', 'late')) DEFAULT 'pending',
  grade INTEGER,
  submitted_at TIMESTAMPTZ,
  UNIQUE(assignment_id, user_id)
);

-- =============================================
-- EVENTS
-- =============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('academic', 'social', 'sports', 'career', 'workshop')),
  max_attendees INTEGER DEFAULT 100,
  organizer TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- =============================================
-- COMMUNITY POSTS
-- =============================================
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT CHECK (category IN ('question', 'help', 'discussion', 'announcement')),
  tags TEXT[],
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE post_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- =============================================
-- FAQ
-- =============================================
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT CHECK (category IN ('academic', 'campus', 'housing', 'financial', 'technology', 'general')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FINANCIAL
-- =============================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('tuition', 'dining', 'parking', 'bookstore', 'event', 'printing', 'refund', 'scholarship')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('completed', 'pending', 'failed')) DEFAULT 'completed',
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE financial_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  tuition_balance DECIMAL(10,2) DEFAULT 0,
  tuition_due DATE,
  meal_plan_balance DECIMAL(10,2) DEFAULT 0,
  printing_credits DECIMAL(10,2) DEFAULT 0,
  campus_card_balance DECIMAL(10,2) DEFAULT 0,
  scholarships DECIMAL(10,2) DEFAULT 0,
  financial_aid DECIMAL(10,2) DEFAULT 0,
  monthly_budget DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DINING
-- =============================================
CREATE TABLE dining_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('cafeteria', 'cafe', 'food-court', 'vending')),
  hours TEXT,
  accepts_meal_plan BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES dining_locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(6,2) NOT NULL,
  calories INTEGER,
  allergens TEXT[],
  dietary TEXT[],
  rating DECIMAL(2,1) DEFAULT 0.0,
  available BOOLEAN DEFAULT true,
  sustainable BOOLEAN DEFAULT false
);

-- =============================================
-- STUDY ROOMS
-- =============================================
CREATE TABLE study_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  building TEXT NOT NULL,
  floor INTEGER,
  capacity INTEGER DEFAULT 6,
  noise_level TEXT CHECK (noise_level IN ('silent', 'quiet', 'moderate', 'collaborative')),
  equipment TEXT[],
  amenities TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE room_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES study_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TRANSPORTATION
-- =============================================
CREATE TABLE bus_routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color TEXT,
  frequency INTEGER, -- minutes
  status TEXT CHECK (status IN ('on-time', 'delayed', 'out-of-service')) DEFAULT 'on-time',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bus_stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id UUID REFERENCES bus_routes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  arrival_time TEXT,
  stop_order INTEGER
);

CREATE TABLE parking_lots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  total_spots INTEGER,
  available_spots INTEGER,
  type TEXT CHECK (type IN ('student', 'faculty', 'visitor', 'accessible')),
  rate TEXT,
  distance TEXT
);

-- =============================================
-- JOBS
-- =============================================
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  type TEXT CHECK (type IN ('internship', 'part-time', 'full-time', 'campus', 'research')),
  location TEXT,
  salary TEXT,
  description TEXT,
  requirements TEXT[],
  posted_date DATE DEFAULT CURRENT_DATE,
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('applied', 'reviewing', 'interview', 'offered', 'rejected')) DEFAULT 'applied',
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, user_id)
);

CREATE TABLE saved_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, user_id)
);

-- =============================================
-- MESSAGES
-- =============================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT CHECK (type IN ('direct', 'group', 'course')),
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- WELLNESS
-- =============================================
CREATE TABLE mood_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mood INTEGER CHECK (mood BETWEEN 1 AND 5),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sleep_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  hours DECIMAL(3,1),
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- GAMIFICATION
-- =============================================
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  points INTEGER DEFAULT 0,
  max_progress INTEGER
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  unlocked BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMPTZ,
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  last_activity DATE DEFAULT CURRENT_DATE
);

-- =============================================
-- NOTIFICATIONS
-- =============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('academic', 'financial', 'event', 'social', 'urgent', 'reminder')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Enrollments: Users can only see their own
CREATE POLICY "Users can view own enrollments" ON enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own enrollments" ON enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions: Users can only see their own
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);

-- Notifications: Users can only see their own
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Posts: Everyone can read, users can create/update their own
CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for reference tables
CREATE POLICY "Courses viewable by everyone" ON courses FOR SELECT USING (true);
CREATE POLICY "Events viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "FAQs viewable by everyone" ON faqs FOR SELECT USING (true);
CREATE POLICY "Dining locations viewable by everyone" ON dining_locations FOR SELECT USING (true);
CREATE POLICY "Menu items viewable by everyone" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Study rooms viewable by everyone" ON study_rooms FOR SELECT USING (true);
CREATE POLICY "Bus routes viewable by everyone" ON bus_routes FOR SELECT USING (true);
CREATE POLICY "Parking lots viewable by everyone" ON parking_lots FOR SELECT USING (true);
CREATE POLICY "Jobs viewable by everyone" ON jobs FOR SELECT USING (true);
CREATE POLICY "Achievements viewable by everyone" ON achievements FOR SELECT USING (true);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  
  INSERT INTO public.financial_summary (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Insert sample FAQs
INSERT INTO faqs (question, answer, category) VALUES
('How do I register for classes?', 'Log into the Student Portal and navigate to "Course Registration." Select your desired term, search for courses, and add them to your cart.', 'academic'),
('Where can I get my student ID card?', 'Visit the Campus Card Office in the Student Services Building (Room 101). Bring a government-issued photo ID.', 'campus'),
('How do I apply for on-campus housing?', 'Submit your housing application through the Housing Portal by March 1st for fall semester.', 'housing'),
('How do I connect to campus WiFi?', 'Connect to "CampusSecure" network using your student email and password.', 'technology'),
('When are tuition payments due?', 'Tuition is due on the first day of each semester. Payment plans are available.', 'financial');

-- Insert sample achievements
INSERT INTO achievements (name, description, icon, points, max_progress) VALUES
('First Steps', 'Complete your first assignment', '🎯', 50, 1),
('Bookworm', 'Visit the library 20 times', '📚', 100, 20),
('Study Streak', 'Study for 7 days in a row', '🔥', 150, 7),
('Social Butterfly', 'Attend 10 campus events', '🦋', 100, 10),
('Dean''s List', 'Achieve a semester GPA of 3.8+', '⭐', 500, 1);

-- Insert sample courses
INSERT INTO courses (code, name, professor, professor_rating, credits, description, difficulty, capacity, semester, category) VALUES
('CS301', 'Data Structures & Algorithms', 'Dr. James Chen', 4.8, 4, 'Advanced data structures including trees, graphs, and hash tables.', 4, 50, 'Fall 2024', 'core'),
('CS350', 'Machine Learning Fundamentals', 'Dr. Emily Watson', 4.9, 3, 'Introduction to machine learning algorithms and neural networks.', 5, 40, 'Fall 2024', 'major'),
('MATH301', 'Linear Algebra', 'Dr. Michael Brown', 4.2, 3, 'Vector spaces, linear transformations, matrices, and eigenvalues.', 4, 60, 'Fall 2024', 'core');

-- Insert sample events
INSERT INTO events (title, date, time, location, description, category, max_attendees, organizer) VALUES
('Tech Career Fair 2024', '2024-02-15', '10:00 AM - 4:00 PM', 'Main Campus Hall', 'Connect with top tech companies recruiting for internships.', 'career', 500, 'Career Services'),
('Hackathon: Build for Good', '2024-02-20', '9:00 AM - 9:00 PM', 'Engineering Building', '24-hour coding marathon to build solutions for social good.', 'workshop', 150, 'CS Club'),
('Campus Basketball Championship', '2024-02-25', '6:00 PM - 9:00 PM', 'Sports Arena', 'Cheer on our team in the finals!', 'sports', 800, 'Athletics Department');

-- Insert sample study rooms
INSERT INTO study_rooms (name, building, floor, capacity, noise_level, equipment, amenities) VALUES
('Study Room A', 'Library', 2, 6, 'quiet', ARRAY['whiteboard', 'monitor'], ARRAY['power-outlets', 'wifi']),
('Collaboration Hub', 'Student Center', 1, 12, 'collaborative', ARRAY['projector', 'whiteboard', 'webcam'], ARRAY['power-outlets', 'wifi', 'coffee-machine']),
('Innovation Lab', 'CS Building', 2, 10, 'collaborative', ARRAY['3d-printer', 'monitors', 'vr-headset'], ARRAY['power-outlets', 'wifi', 'standing-desks']);

-- Insert sample jobs
INSERT INTO jobs (title, company, type, location, salary, description, requirements, deadline) VALUES
('Software Engineering Intern', 'Google', 'internship', 'Mountain View, CA', '$8,000/month', 'Work on cutting-edge projects in cloud computing and AI.', ARRAY['CS major', 'Python or Java', 'Problem-solving'], '2024-03-15'),
('Research Assistant - AI Lab', 'University Research', 'research', 'On Campus', '$18/hour', 'Assist with machine learning experiments and data analysis.', ARRAY['CS350 enrolled', 'Python proficiency'], '2024-02-25');

COMMIT;

