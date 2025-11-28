// ============================================
// CAMPUS CONNECT - COMPREHENSIVE DATA MODELS
// Ready for Supabase Integration
// ============================================

// Re-export existing data
export * from './events';
export * from './community';
export * from './faq';

// ============================================
// USER & PROFILE
// ============================================
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  studentId: string;
  major: string;
  minor?: string;
  year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate';
  enrollmentDate: string;
  expectedGraduation: string;
  gpa: number;
  totalCredits: number;
  advisor: string;
  phone?: string;
  emergencyContact?: string;
}

export const currentUser: User = {
  id: '1',
  email: 'habiba@university.edu',
  name: 'Habiba Ahmed',
  studentId: 'STU2024001',
  major: 'Computer Science',
  minor: 'Data Science',
  year: 'Junior',
  enrollmentDate: '2022-09-01',
  expectedGraduation: '2026-05-15',
  gpa: 3.75,
  totalCredits: 78,
  advisor: 'Dr. Sarah Mitchell',
  phone: '+1 555-0123',
};

// ============================================
// ACADEMIC - COURSES
// ============================================
export interface Course {
  id: string;
  code: string;
  name: string;
  professor: string;
  professorRating: number;
  credits: number;
  schedule: { day: string; time: string; location: string }[];
  description: string;
  prerequisites: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  enrolled: number;
  capacity: number;
  status: 'enrolled' | 'completed' | 'available' | 'waitlist';
  grade?: string;
  gradePoints?: number;
  semester: string;
  category: 'core' | 'elective' | 'general' | 'major';
}

export const courses: Course[] = [
  {
    id: '1',
    code: 'CS301',
    name: 'Data Structures & Algorithms',
    professor: 'Dr. James Chen',
    professorRating: 4.8,
    credits: 4,
    schedule: [
      { day: 'Monday', time: '10:00 AM', location: 'Engineering 201' },
      { day: 'Wednesday', time: '10:00 AM', location: 'Engineering 201' },
      { day: 'Friday', time: '2:00 PM', location: 'Lab 105' },
    ],
    description: 'Advanced data structures including trees, graphs, and hash tables. Algorithm analysis and design.',
    prerequisites: ['CS201', 'MATH201'],
    difficulty: 4,
    enrolled: 45,
    capacity: 50,
    status: 'enrolled',
    semester: 'Fall 2024',
    category: 'core',
  },
  {
    id: '2',
    code: 'CS350',
    name: 'Machine Learning Fundamentals',
    professor: 'Dr. Emily Watson',
    professorRating: 4.9,
    credits: 3,
    schedule: [
      { day: 'Tuesday', time: '1:00 PM', location: 'CS Building 302' },
      { day: 'Thursday', time: '1:00 PM', location: 'CS Building 302' },
    ],
    description: 'Introduction to machine learning algorithms, neural networks, and practical applications.',
    prerequisites: ['CS301', 'MATH301', 'STAT201'],
    difficulty: 5,
    enrolled: 38,
    capacity: 40,
    status: 'enrolled',
    semester: 'Fall 2024',
    category: 'major',
  },
  {
    id: '3',
    code: 'MATH301',
    name: 'Linear Algebra',
    professor: 'Dr. Michael Brown',
    professorRating: 4.2,
    credits: 3,
    schedule: [
      { day: 'Monday', time: '2:00 PM', location: 'Math Building 101' },
      { day: 'Wednesday', time: '2:00 PM', location: 'Math Building 101' },
    ],
    description: 'Vector spaces, linear transformations, matrices, and eigenvalues.',
    prerequisites: ['MATH201'],
    difficulty: 4,
    enrolled: 55,
    capacity: 60,
    status: 'enrolled',
    semester: 'Fall 2024',
    category: 'core',
  },
  {
    id: '4',
    code: 'ENG201',
    name: 'Technical Writing',
    professor: 'Prof. Lisa Anderson',
    professorRating: 4.5,
    credits: 3,
    schedule: [
      { day: 'Tuesday', time: '9:00 AM', location: 'Humanities 205' },
      { day: 'Thursday', time: '9:00 AM', location: 'Humanities 205' },
    ],
    description: 'Professional writing skills for technical and scientific communication.',
    prerequisites: ['ENG101'],
    difficulty: 2,
    enrolled: 28,
    capacity: 30,
    status: 'enrolled',
    semester: 'Fall 2024',
    category: 'general',
  },
  {
    id: '5',
    code: 'CS401',
    name: 'Distributed Systems',
    professor: 'Dr. Robert Kim',
    professorRating: 4.6,
    credits: 4,
    schedule: [
      { day: 'Monday', time: '4:00 PM', location: 'Engineering 305' },
      { day: 'Wednesday', time: '4:00 PM', location: 'Engineering 305' },
    ],
    description: 'Design and implementation of distributed computing systems.',
    prerequisites: ['CS301', 'CS310'],
    difficulty: 5,
    enrolled: 32,
    capacity: 35,
    status: 'available',
    semester: 'Spring 2025',
    category: 'major',
  },
];

// ============================================
// ACADEMIC - GRADES
// ============================================
export interface Grade {
  courseId: string;
  courseCode: string;
  courseName: string;
  credits: number;
  grade: string;
  gradePoints: number;
  semester: string;
  professor: string;
}

export const grades: Grade[] = [
  { courseId: '101', courseCode: 'CS101', courseName: 'Intro to Programming', credits: 4, grade: 'A', gradePoints: 4.0, semester: 'Fall 2022', professor: 'Dr. Smith' },
  { courseId: '102', courseCode: 'MATH101', courseName: 'Calculus I', credits: 4, grade: 'A-', gradePoints: 3.7, semester: 'Fall 2022', professor: 'Dr. Johnson' },
  { courseId: '103', courseCode: 'ENG101', courseName: 'English Composition', credits: 3, grade: 'B+', gradePoints: 3.3, semester: 'Fall 2022', professor: 'Prof. Williams' },
  { courseId: '104', courseCode: 'PHYS101', courseName: 'Physics I', credits: 4, grade: 'A', gradePoints: 4.0, semester: 'Fall 2022', professor: 'Dr. Davis' },
  { courseId: '201', courseCode: 'CS201', courseName: 'Object-Oriented Programming', credits: 4, grade: 'A', gradePoints: 4.0, semester: 'Spring 2023', professor: 'Dr. Chen' },
  { courseId: '202', courseCode: 'MATH201', courseName: 'Calculus II', credits: 4, grade: 'B+', gradePoints: 3.3, semester: 'Spring 2023', professor: 'Dr. Brown' },
  { courseId: '203', courseCode: 'STAT201', courseName: 'Statistics', credits: 3, grade: 'A-', gradePoints: 3.7, semester: 'Spring 2023', professor: 'Dr. Lee' },
  { courseId: '204', courseCode: 'CS210', courseName: 'Computer Architecture', credits: 3, grade: 'B', gradePoints: 3.0, semester: 'Spring 2023', professor: 'Dr. Wilson' },
  { courseId: '301', courseCode: 'CS250', courseName: 'Database Systems', credits: 3, grade: 'A', gradePoints: 4.0, semester: 'Fall 2023', professor: 'Dr. Garcia' },
  { courseId: '302', courseCode: 'CS260', courseName: 'Web Development', credits: 3, grade: 'A', gradePoints: 4.0, semester: 'Fall 2023', professor: 'Prof. Martinez' },
  { courseId: '303', courseCode: 'MATH250', courseName: 'Discrete Mathematics', credits: 3, grade: 'A-', gradePoints: 3.7, semester: 'Fall 2023', professor: 'Dr. Taylor' },
  { courseId: '304', courseCode: 'CS310', courseName: 'Operating Systems', credits: 4, grade: 'B+', gradePoints: 3.3, semester: 'Spring 2024', professor: 'Dr. Anderson' },
  { courseId: '305', courseCode: 'CS320', courseName: 'Software Engineering', credits: 3, grade: 'A', gradePoints: 4.0, semester: 'Spring 2024', professor: 'Dr. Thomas' },
];

// ============================================
// ACADEMIC - ASSIGNMENTS
// ============================================
export interface Assignment {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  status: 'pending' | 'submitted' | 'graded' | 'late' | 'overdue';
  grade?: number;
  maxGrade: number;
  weight: number;
  type: 'homework' | 'quiz' | 'exam' | 'project' | 'essay' | 'lab';
  estimatedTime: number; // in hours
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export const assignments: Assignment[] = [
  {
    id: '1',
    courseId: '1',
    courseCode: 'CS301',
    title: 'Binary Tree Implementation',
    description: 'Implement a balanced binary search tree with insert, delete, and search operations.',
    dueDate: '2024-01-20',
    dueTime: '11:59 PM',
    status: 'pending',
    maxGrade: 100,
    weight: 15,
    type: 'homework',
    estimatedTime: 8,
    priority: 'high',
  },
  {
    id: '2',
    courseId: '2',
    courseCode: 'CS350',
    title: 'Neural Network from Scratch',
    description: 'Build a simple neural network without using ML libraries.',
    dueDate: '2024-01-25',
    dueTime: '11:59 PM',
    status: 'pending',
    maxGrade: 100,
    weight: 20,
    type: 'project',
    estimatedTime: 15,
    priority: 'urgent',
  },
  {
    id: '3',
    courseId: '3',
    courseCode: 'MATH301',
    title: 'Problem Set 5',
    description: 'Eigenvalues and eigenvectors practice problems.',
    dueDate: '2024-01-18',
    dueTime: '5:00 PM',
    status: 'pending',
    maxGrade: 50,
    weight: 5,
    type: 'homework',
    estimatedTime: 3,
    priority: 'medium',
  },
  {
    id: '4',
    courseId: '4',
    courseCode: 'ENG201',
    title: 'Technical Report Draft',
    description: 'First draft of your technical report on chosen topic.',
    dueDate: '2024-01-22',
    dueTime: '11:59 PM',
    status: 'pending',
    maxGrade: 100,
    weight: 25,
    type: 'essay',
    estimatedTime: 10,
    priority: 'high',
  },
  {
    id: '5',
    courseId: '1',
    courseCode: 'CS301',
    title: 'Midterm Exam',
    description: 'Covers chapters 1-6: Arrays, Linked Lists, Trees, Graphs.',
    dueDate: '2024-01-28',
    dueTime: '10:00 AM',
    status: 'pending',
    maxGrade: 100,
    weight: 25,
    type: 'exam',
    estimatedTime: 2,
    priority: 'urgent',
  },
];

// ============================================
// FINANCIAL
// ============================================
export interface Transaction {
  id: string;
  type: 'tuition' | 'dining' | 'parking' | 'bookstore' | 'event' | 'printing' | 'refund' | 'scholarship';
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  category: string;
}

export const transactions: Transaction[] = [
  { id: '1', type: 'tuition', amount: -4500, date: '2024-01-05', description: 'Spring 2024 Tuition Payment', status: 'completed', category: 'Academic' },
  { id: '2', type: 'scholarship', amount: 2000, date: '2024-01-03', description: 'Merit Scholarship Award', status: 'completed', category: 'Financial Aid' },
  { id: '3', type: 'dining', amount: -12.50, date: '2024-01-15', description: 'Main Cafeteria - Lunch', status: 'completed', category: 'Food' },
  { id: '4', type: 'bookstore', amount: -89.99, date: '2024-01-10', description: 'CS301 Textbook', status: 'completed', category: 'Books' },
  { id: '5', type: 'printing', amount: -5.25, date: '2024-01-14', description: 'Library Printing - 21 pages', status: 'completed', category: 'Services' },
  { id: '6', type: 'parking', amount: -150, date: '2024-01-02', description: 'Monthly Parking Pass', status: 'completed', category: 'Transportation' },
  { id: '7', type: 'event', amount: -15, date: '2024-01-12', description: 'Tech Career Fair Registration', status: 'completed', category: 'Events' },
  { id: '8', type: 'dining', amount: -8.75, date: '2024-01-14', description: 'Campus Cafe - Coffee & Snack', status: 'completed', category: 'Food' },
];

export interface FinancialSummary {
  tuitionBalance: number;
  tuitionDue: string;
  mealPlanBalance: number;
  printingCredits: number;
  campusCardBalance: number;
  scholarships: number;
  financialAid: number;
  monthlyBudget: number;
  monthlySpent: number;
}

export const financialSummary: FinancialSummary = {
  tuitionBalance: 2500,
  tuitionDue: '2024-02-15',
  mealPlanBalance: 485.50,
  printingCredits: 24.75,
  campusCardBalance: 156.30,
  scholarships: 8000,
  financialAid: 5500,
  monthlyBudget: 800,
  monthlySpent: 523.49,
};

// ============================================
// DINING
// ============================================
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  allergens: string[];
  dietary: ('vegetarian' | 'vegan' | 'gluten-free' | 'halal' | 'kosher')[];
  rating: number;
  image?: string;
  available: boolean;
  sustainable: boolean;
}

export interface DiningLocation {
  id: string;
  name: string;
  type: 'cafeteria' | 'cafe' | 'food-court' | 'vending';
  hours: string;
  currentWaitTime: number;
  crowdLevel: 'low' | 'medium' | 'high';
  acceptsMealPlan: boolean;
  menu: MenuItem[];
}

export const diningLocations: DiningLocation[] = [
  {
    id: '1',
    name: 'Main Cafeteria',
    type: 'cafeteria',
    hours: '7:00 AM - 9:00 PM',
    currentWaitTime: 5,
    crowdLevel: 'medium',
    acceptsMealPlan: true,
    menu: [
      { id: 'm1', name: 'Grilled Chicken Bowl', description: 'Rice, grilled chicken, vegetables, teriyaki sauce', price: 8.99, calories: 650, allergens: ['soy'], dietary: ['gluten-free'], rating: 4.5, available: true, sustainable: true },
      { id: 'm2', name: 'Veggie Burger', description: 'Plant-based patty with lettuce, tomato, special sauce', price: 7.99, calories: 520, allergens: ['gluten'], dietary: ['vegetarian', 'vegan'], rating: 4.2, available: true, sustainable: true },
      { id: 'm3', name: 'Caesar Salad', description: 'Romaine lettuce, parmesan, croutons, caesar dressing', price: 6.99, calories: 380, allergens: ['dairy', 'gluten'], dietary: ['vegetarian'], rating: 4.0, available: true, sustainable: true },
      { id: 'm4', name: 'Pasta Primavera', description: 'Penne with seasonal vegetables in marinara', price: 7.49, calories: 580, allergens: ['gluten'], dietary: ['vegetarian', 'vegan'], rating: 4.3, available: true, sustainable: false },
    ],
  },
  {
    id: '2',
    name: 'Engineering Cafe',
    type: 'cafe',
    hours: '8:00 AM - 6:00 PM',
    currentWaitTime: 2,
    crowdLevel: 'low',
    acceptsMealPlan: true,
    menu: [
      { id: 'm5', name: 'Espresso', description: 'Double shot espresso', price: 2.99, calories: 5, allergens: [], dietary: ['vegan', 'gluten-free'], rating: 4.7, available: true, sustainable: true },
      { id: 'm6', name: 'Avocado Toast', description: 'Sourdough with smashed avocado, everything seasoning', price: 5.99, calories: 320, allergens: ['gluten'], dietary: ['vegetarian', 'vegan'], rating: 4.4, available: true, sustainable: true },
      { id: 'm7', name: 'Breakfast Burrito', description: 'Eggs, cheese, peppers, salsa in flour tortilla', price: 6.49, calories: 480, allergens: ['dairy', 'gluten', 'eggs'], dietary: ['vegetarian'], rating: 4.6, available: true, sustainable: false },
    ],
  },
  {
    id: '3',
    name: 'Library Coffee Corner',
    type: 'cafe',
    hours: '7:30 AM - 10:00 PM',
    currentWaitTime: 8,
    crowdLevel: 'high',
    acceptsMealPlan: false,
    menu: [
      { id: 'm8', name: 'Latte', description: 'Espresso with steamed milk', price: 4.49, calories: 190, allergens: ['dairy'], dietary: ['vegetarian', 'gluten-free'], rating: 4.5, available: true, sustainable: true },
      { id: 'm9', name: 'Muffin', description: 'Blueberry or chocolate chip', price: 2.99, calories: 380, allergens: ['gluten', 'dairy', 'eggs'], dietary: ['vegetarian'], rating: 4.0, available: true, sustainable: false },
    ],
  },
];

// ============================================
// STUDY ROOMS & LIBRARY
// ============================================
export interface StudyRoom {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  currentOccupancy: number;
  noiseLevel: 'silent' | 'quiet' | 'moderate' | 'collaborative';
  equipment: string[];
  available: boolean;
  nextAvailable?: string;
  amenities: string[];
}

export const studyRooms: StudyRoom[] = [
  { id: '1', name: 'Study Room A', building: 'Library', floor: 2, capacity: 6, currentOccupancy: 4, noiseLevel: 'quiet', equipment: ['whiteboard', 'monitor', 'hdmi'], available: false, nextAvailable: '3:00 PM', amenities: ['power-outlets', 'wifi'] },
  { id: '2', name: 'Study Room B', building: 'Library', floor: 2, capacity: 4, currentOccupancy: 0, noiseLevel: 'silent', equipment: ['whiteboard'], available: true, amenities: ['power-outlets', 'wifi'] },
  { id: '3', name: 'Collaboration Hub', building: 'Student Center', floor: 1, capacity: 12, currentOccupancy: 7, noiseLevel: 'collaborative', equipment: ['projector', 'whiteboard', 'monitor', 'webcam'], available: true, amenities: ['power-outlets', 'wifi', 'coffee-machine'] },
  { id: '4', name: 'Quiet Study Area', building: 'Library', floor: 3, capacity: 30, currentOccupancy: 18, noiseLevel: 'silent', equipment: [], available: true, amenities: ['power-outlets', 'wifi', 'desk-lamps'] },
  { id: '5', name: 'Group Room 101', building: 'Engineering', floor: 1, capacity: 8, currentOccupancy: 8, noiseLevel: 'moderate', equipment: ['whiteboard', 'tv'], available: false, nextAvailable: '5:30 PM', amenities: ['power-outlets', 'wifi'] },
  { id: '6', name: 'Innovation Lab', building: 'CS Building', floor: 2, capacity: 10, currentOccupancy: 3, noiseLevel: 'collaborative', equipment: ['3d-printer', 'monitors', 'whiteboard', 'vr-headset'], available: true, amenities: ['power-outlets', 'wifi', 'standing-desks'] },
];

// ============================================
// TRANSPORTATION
// ============================================
export interface BusRoute {
  id: string;
  name: string;
  color: string;
  stops: { name: string; arrivalTime: string }[];
  frequency: number; // minutes
  currentLocation?: string;
  nextArrival: string;
  status: 'on-time' | 'delayed' | 'out-of-service';
  delay?: number;
}

export const busRoutes: BusRoute[] = [
  {
    id: '1',
    name: 'Campus Loop',
    color: '#6C63FF',
    stops: [
      { name: 'Main Gate', arrivalTime: '8:00 AM' },
      { name: 'Engineering', arrivalTime: '8:05 AM' },
      { name: 'Library', arrivalTime: '8:10 AM' },
      { name: 'Student Center', arrivalTime: '8:15 AM' },
      { name: 'Dorms', arrivalTime: '8:20 AM' },
    ],
    frequency: 10,
    currentLocation: 'Engineering',
    nextArrival: '3 min',
    status: 'on-time',
  },
  {
    id: '2',
    name: 'Downtown Express',
    color: '#FF6B6B',
    stops: [
      { name: 'Campus Main', arrivalTime: '8:00 AM' },
      { name: 'Metro Station', arrivalTime: '8:15 AM' },
      { name: 'City Center', arrivalTime: '8:25 AM' },
    ],
    frequency: 20,
    currentLocation: 'Metro Station',
    nextArrival: '12 min',
    status: 'delayed',
    delay: 5,
  },
  {
    id: '3',
    name: 'Night Shuttle',
    color: '#4CAF50',
    stops: [
      { name: 'Library', arrivalTime: '10:00 PM' },
      { name: 'Parking Lot A', arrivalTime: '10:05 PM' },
      { name: 'Off-Campus Apts', arrivalTime: '10:15 PM' },
    ],
    frequency: 15,
    nextArrival: '8 min',
    status: 'on-time',
  },
];

export interface ParkingLot {
  id: string;
  name: string;
  totalSpots: number;
  availableSpots: number;
  type: 'student' | 'faculty' | 'visitor' | 'accessible';
  rate: string;
  distance: string;
}

export const parkingLots: ParkingLot[] = [
  { id: '1', name: 'Lot A - Main', totalSpots: 200, availableSpots: 45, type: 'student', rate: '$3/day', distance: '2 min walk' },
  { id: '2', name: 'Lot B - Engineering', totalSpots: 150, availableSpots: 12, type: 'student', rate: '$3/day', distance: '5 min walk' },
  { id: '3', name: 'Parking Garage', totalSpots: 500, availableSpots: 234, type: 'student', rate: '$5/day', distance: '3 min walk' },
  { id: '4', name: 'Visitor Lot', totalSpots: 50, availableSpots: 28, type: 'visitor', rate: '$2/hour', distance: '1 min walk' },
];

// ============================================
// MESSAGES & SOCIAL
// ============================================
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'direct' | 'group' | 'announcement';
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'course';
  name: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  avatar?: string;
}

export const conversations: Conversation[] = [
  {
    id: '1',
    type: 'group',
    name: 'CS301 Study Group',
    participants: ['Alex', 'Sarah', 'Mike', 'You'],
    lastMessage: { id: 'm1', senderId: '2', senderName: 'Alex', content: 'Anyone want to meet at the library tomorrow for exam prep?', timestamp: '2024-01-15T14:30:00Z', read: false, type: 'group' },
    unreadCount: 3,
  },
  {
    id: '2',
    type: 'direct',
    name: 'Dr. James Chen',
    participants: ['Dr. Chen', 'You'],
    lastMessage: { id: 'm2', senderId: '3', senderName: 'Dr. Chen', content: 'Office hours confirmed for Thursday 2-4 PM.', timestamp: '2024-01-15T10:15:00Z', read: true, type: 'direct' },
    unreadCount: 0,
  },
  {
    id: '3',
    type: 'course',
    name: 'ML Fundamentals Discussion',
    participants: ['38 students'],
    lastMessage: { id: 'm3', senderId: '4', senderName: 'Emma', content: 'Has anyone started the neural network assignment?', timestamp: '2024-01-15T16:45:00Z', read: false, type: 'group' },
    unreadCount: 12,
  },
  {
    id: '4',
    type: 'direct',
    name: 'Sarah Kim',
    participants: ['Sarah', 'You'],
    lastMessage: { id: 'm4', senderId: '1', senderName: 'You', content: 'Thanks for the notes!', timestamp: '2024-01-14T20:00:00Z', read: true, type: 'direct' },
    unreadCount: 0,
  },
];

// ============================================
// CAREER & JOBS
// ============================================
export interface Job {
  id: string;
  title: string;
  company: string;
  type: 'internship' | 'part-time' | 'full-time' | 'campus' | 'research';
  location: string;
  salary?: string;
  description: string;
  requirements: string[];
  postedDate: string;
  deadline: string;
  saved: boolean;
  applied: boolean;
}

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Software Engineering Intern',
    company: 'Google',
    type: 'internship',
    location: 'Mountain View, CA (Remote Option)',
    salary: '$8,000/month',
    description: 'Join our team to work on cutting-edge projects in cloud computing and AI.',
    requirements: ['Junior or Senior standing', 'CS/CE major', 'Experience with Python or Java', 'Strong problem-solving skills'],
    postedDate: '2024-01-10',
    deadline: '2024-02-15',
    saved: true,
    applied: false,
  },
  {
    id: '2',
    title: 'Research Assistant - AI Lab',
    company: 'University Research',
    type: 'research',
    location: 'On Campus',
    salary: '$18/hour',
    description: 'Assist Dr. Watson\'s research team with machine learning experiments and data analysis.',
    requirements: ['Enrolled in CS350 or equivalent', 'Python proficiency', 'Interest in ML research'],
    postedDate: '2024-01-12',
    deadline: '2024-01-25',
    saved: true,
    applied: true,
  },
  {
    id: '3',
    title: 'IT Help Desk',
    company: 'Campus IT Services',
    type: 'campus',
    location: 'Library Building',
    salary: '$15/hour',
    description: 'Provide technical support to students and faculty. Great for building customer service skills.',
    requirements: ['Basic computer troubleshooting', 'Good communication skills', 'Available 10+ hours/week'],
    postedDate: '2024-01-14',
    deadline: '2024-01-30',
    saved: false,
    applied: false,
  },
  {
    id: '4',
    title: 'Data Science Intern',
    company: 'Amazon',
    type: 'internship',
    location: 'Seattle, WA',
    salary: '$7,500/month',
    description: 'Work with our data team to build ML models for improving customer experience.',
    requirements: ['Statistics background', 'Python, SQL proficiency', 'Experience with data visualization'],
    postedDate: '2024-01-08',
    deadline: '2024-02-01',
    saved: false,
    applied: false,
  },
];

// ============================================
// WELLNESS
// ============================================
export interface WellnessData {
  moodHistory: { date: string; mood: number; note?: string }[];
  sleepHours: { date: string; hours: number }[];
  stressLevel: number;
  studyHoursThisWeek: number;
  exerciseMinutesThisWeek: number;
  counselingAppointment?: string;
  recommendations: string[];
}

export const wellnessData: WellnessData = {
  moodHistory: [
    { date: '2024-01-15', mood: 4, note: 'Good study session' },
    { date: '2024-01-14', mood: 3, note: 'Stressed about midterms' },
    { date: '2024-01-13', mood: 4 },
    { date: '2024-01-12', mood: 5, note: 'Had fun at event' },
    { date: '2024-01-11', mood: 3 },
    { date: '2024-01-10', mood: 2, note: 'Feeling overwhelmed' },
    { date: '2024-01-09', mood: 4 },
  ],
  sleepHours: [
    { date: '2024-01-15', hours: 7 },
    { date: '2024-01-14', hours: 6 },
    { date: '2024-01-13', hours: 8 },
    { date: '2024-01-12', hours: 7.5 },
    { date: '2024-01-11', hours: 5.5 },
    { date: '2024-01-10', hours: 6 },
    { date: '2024-01-09', hours: 7 },
  ],
  stressLevel: 6,
  studyHoursThisWeek: 28,
  exerciseMinutesThisWeek: 90,
  counselingAppointment: '2024-01-22T14:00:00Z',
  recommendations: [
    'Consider taking a 10-minute break every hour during study sessions',
    'Your sleep has been inconsistent - try maintaining a regular schedule',
    'Join a fitness class to boost both physical and mental wellness',
  ],
};

// ============================================
// GAMIFICATION
// ============================================
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  maxProgress?: number;
}

export interface UserStats {
  totalPoints: number;
  level: number;
  streak: number;
  rank: number;
  achievements: Achievement[];
}

export const userStats: UserStats = {
  totalPoints: 2450,
  level: 12,
  streak: 7,
  rank: 156,
  achievements: [
    { id: '1', name: 'First Steps', description: 'Complete your first assignment', icon: '🎯', points: 50, unlocked: true, unlockedDate: '2022-09-15' },
    { id: '2', name: 'Bookworm', description: 'Visit the library 20 times', icon: '📚', points: 100, unlocked: true, unlockedDate: '2023-03-20', progress: 20, maxProgress: 20 },
    { id: '3', name: 'Study Streak', description: 'Study for 7 days in a row', icon: '🔥', points: 150, unlocked: true, unlockedDate: '2024-01-15', progress: 7, maxProgress: 7 },
    { id: '4', name: 'Social Butterfly', description: 'Attend 10 campus events', icon: '🦋', points: 100, unlocked: false, progress: 7, maxProgress: 10 },
    { id: '5', name: 'Dean\'s List', description: 'Achieve a semester GPA of 3.8+', icon: '⭐', points: 500, unlocked: true, unlockedDate: '2023-12-20' },
    { id: '6', name: 'Helping Hand', description: 'Answer 50 questions in forums', icon: '🤝', points: 200, unlocked: false, progress: 32, maxProgress: 50 },
    { id: '7', name: 'Early Bird', description: 'Attend 8 AM classes 30 times', icon: '🌅', points: 150, unlocked: false, progress: 18, maxProgress: 30 },
    { id: '8', name: 'Eco Warrior', description: 'Choose sustainable meals 50 times', icon: '🌱', points: 100, unlocked: false, progress: 23, maxProgress: 50 },
  ],
};

// ============================================
// NOTIFICATIONS
// ============================================
export interface Notification {
  id: string;
  type: 'academic' | 'financial' | 'event' | 'social' | 'urgent' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export const notifications: Notification[] = [
  { id: '1', type: 'urgent', title: 'Assignment Due Tomorrow', message: 'CS301 Binary Tree Implementation is due tomorrow at 11:59 PM', timestamp: '2024-01-15T09:00:00Z', read: false, actionUrl: '/assignments/1', priority: 'urgent' },
  { id: '2', type: 'financial', title: 'Tuition Payment Reminder', message: 'Your tuition balance of $2,500 is due on Feb 15', timestamp: '2024-01-15T08:00:00Z', read: false, actionUrl: '/financial', priority: 'high' },
  { id: '3', type: 'event', title: 'Tech Career Fair Tomorrow', message: 'Don\'t forget to bring your resume! Engineering Hall, 10 AM - 4 PM', timestamp: '2024-01-14T18:00:00Z', read: true, actionUrl: '/events/1', priority: 'medium' },
  { id: '4', type: 'academic', title: 'Grade Posted', message: 'Your grade for CS320 Final Project has been posted', timestamp: '2024-01-14T14:30:00Z', read: true, actionUrl: '/grades', priority: 'medium' },
  { id: '5', type: 'social', title: 'New Message', message: 'Alex sent a message in CS301 Study Group', timestamp: '2024-01-15T14:30:00Z', read: false, actionUrl: '/messages/1', priority: 'low' },
  { id: '6', type: 'reminder', title: 'Office Hours Today', message: 'Dr. Chen\'s office hours are today 2-4 PM', timestamp: '2024-01-15T10:00:00Z', read: false, priority: 'medium' },
];

// ============================================
// SEARCH
// ============================================
export interface SearchResult {
  id: string;
  type: 'course' | 'professor' | 'building' | 'event' | 'job' | 'faq' | 'person' | 'resource';
  title: string;
  subtitle: string;
  url: string;
  relevance: number;
}

// Helper function for search
export const searchAll = (query: string): SearchResult[] => {
  const results: SearchResult[] = [];
  const q = query.toLowerCase();
  
  // Search courses
  courses.forEach(course => {
    if (course.name.toLowerCase().includes(q) || course.code.toLowerCase().includes(q)) {
      results.push({
        id: course.id,
        type: 'course',
        title: `${course.code} - ${course.name}`,
        subtitle: `${course.professor} • ${course.credits} credits`,
        url: `/courses/${course.id}`,
        relevance: course.name.toLowerCase().startsWith(q) ? 1 : 0.5,
      });
    }
  });
  
  // Search jobs
  jobs.forEach(job => {
    if (job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q)) {
      results.push({
        id: job.id,
        type: 'job',
        title: job.title,
        subtitle: `${job.company} • ${job.type}`,
        url: `/jobs/${job.id}`,
        relevance: job.title.toLowerCase().startsWith(q) ? 1 : 0.5,
      });
    }
  });
  
  return results.sort((a, b) => b.relevance - a.relevance);
};

