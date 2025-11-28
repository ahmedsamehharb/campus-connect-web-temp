// Event data - Ready for Supabase integration
// Replace this with Supabase query: supabase.from('events').select('*')

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'academic' | 'social' | 'sports' | 'career' | 'workshop';
  attendees: number;
  maxAttendees: number;
  imageUrl?: string;
  organizer: string;
}

export const events: Event[] = [
  {
    id: '1',
    title: 'Tech Career Fair 2024',
    date: '2024-01-15',
    time: '10:00 AM - 4:00 PM',
    location: 'Main Campus Hall',
    description: 'Connect with top tech companies recruiting for internships and full-time positions. Bring your resume and dress professionally! Companies attending include Google, Microsoft, Amazon, and many startups.',
    category: 'career',
    attendees: 234,
    maxAttendees: 500,
    organizer: 'Career Services'
  },
  {
    id: '2',
    title: 'Hackathon: Build for Good',
    date: '2024-01-20',
    time: '9:00 AM - 9:00 PM',
    location: 'Engineering Building',
    description: '24-hour coding marathon to build solutions for social good. Form teams, learn new technologies, and win prizes! Food and drinks provided. Open to all skill levels.',
    category: 'workshop',
    attendees: 87,
    maxAttendees: 150,
    organizer: 'CS Club'
  },
  {
    id: '3',
    title: 'Campus Basketball Championship',
    date: '2024-01-25',
    time: '6:00 PM - 9:00 PM',
    location: 'Sports Arena',
    description: 'Cheer on our team in the finals! Face paint stations, halftime show, and post-game celebration. Free entry for all students with valid ID.',
    category: 'sports',
    attendees: 450,
    maxAttendees: 800,
    organizer: 'Athletics Department'
  },
  {
    id: '4',
    title: 'Study Group: Finals Prep',
    date: '2024-01-28',
    time: '2:00 PM - 6:00 PM',
    location: 'Library Room 302',
    description: 'Collaborative study session for finals week. Tutors available for Math, Physics, and Chemistry. Snacks provided. Drop in anytime!',
    category: 'academic',
    attendees: 45,
    maxAttendees: 60,
    organizer: 'Student Success Center'
  },
  {
    id: '5',
    title: 'International Food Festival',
    date: '2024-02-01',
    time: '11:00 AM - 3:00 PM',
    location: 'Student Union Plaza',
    description: 'Celebrate diversity with cuisines from around the world! Cultural performances, cooking demos, and free food samples. Organized by international student associations.',
    category: 'social',
    attendees: 312,
    maxAttendees: 500,
    organizer: 'International Student Union'
  },
  {
    id: '6',
    title: 'Resume Workshop',
    date: '2024-02-05',
    time: '3:00 PM - 5:00 PM',
    location: 'Career Center',
    description: 'Learn how to craft a standout resume that gets noticed. One-on-one feedback sessions available. Bring your laptop and current resume.',
    category: 'career',
    attendees: 28,
    maxAttendees: 40,
    organizer: 'Career Services'
  }
];

// Helper function to get event by ID
export const getEventById = (id: string): Event | undefined => {
  return events.find(event => event.id === id);
};

// Helper function to get events by category
export const getEventsByCategory = (category: Event['category']): Event[] => {
  return events.filter(event => event.category === category);
};

