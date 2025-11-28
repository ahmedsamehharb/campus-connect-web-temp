// FAQ data - Ready for Supabase integration
// Replace this with Supabase query: supabase.from('faqs').select('*')

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'academic' | 'campus' | 'housing' | 'financial' | 'technology' | 'general';
}

export const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I register for classes?',
    answer: 'Log into the Student Portal and navigate to "Course Registration." Select your desired term, search for courses by department or keyword, and add them to your cart. Make sure to check for prerequisites and time conflicts before submitting. Registration opens based on credit hours - seniors register first.',
    category: 'academic'
  },
  {
    id: '2',
    question: 'Where can I get my student ID card?',
    answer: 'Visit the Campus Card Office in the Student Services Building (Room 101). Bring a government-issued photo ID. First cards are free; replacements cost $25. The office is open Monday-Friday, 8 AM - 5 PM. You can also upload your photo online before visiting to speed up the process.',
    category: 'campus'
  },
  {
    id: '3',
    question: 'How do I apply for on-campus housing?',
    answer: 'Submit your housing application through the Housing Portal by March 1st for fall semester or October 1st for spring. You\'ll need to pay a $200 deposit and complete a roommate questionnaire. Assignments are based on application date, so apply early! Current residents have priority for room selection.',
    category: 'housing'
  },
  {
    id: '4',
    question: 'What meal plan options are available?',
    answer: 'We offer three meal plans: Unlimited (all-you-can-eat at dining halls), 14 meals/week + $200 flex dollars, or 10 meals/week + $400 flex dollars. All plans include access to our main dining hall and food court. Flex dollars can be used at campus cafes and convenience stores.',
    category: 'campus'
  },
  {
    id: '5',
    question: 'How do I connect to campus WiFi?',
    answer: 'Connect to "CampusSecure" network using your student email and password. For first-time setup, you may need to install a security certificate - follow the prompts. Guest access is available on "CampusGuest" for up to 4 hours. IT Help Desk can assist with connection issues.',
    category: 'technology'
  },
  {
    id: '6',
    question: 'When are tuition payments due?',
    answer: 'Tuition is due on the first day of each semester. Payment plans are available - you can split into 4 monthly installments with a $50 enrollment fee. Late payments incur a 1.5% monthly fee. Set up automatic payments in the Billing Portal to avoid late fees.',
    category: 'financial'
  },
  {
    id: '7',
    question: 'How do I access the gym and fitness center?',
    answer: 'The Recreation Center is free for all students! Just swipe your student ID at the entrance. Hours are 6 AM - 11 PM weekdays, 8 AM - 9 PM weekends. Group fitness classes require sign-up through the Rec Portal. Personal training and locker rentals available for additional fees.',
    category: 'campus'
  },
  {
    id: '8',
    question: 'Where can I find tutoring services?',
    answer: 'The Learning Center (Library, 2nd floor) offers free tutoring in writing, math, and sciences. Drop-in hours are 9 AM - 8 PM weekdays. You can also book appointments online. Supplemental Instruction (SI) sessions are available for high-enrollment courses - check the schedule on the LC website.',
    category: 'academic'
  },
  {
    id: '9',
    question: 'How do I change my major?',
    answer: 'Schedule an appointment with your academic advisor to discuss the change. You\'ll need to complete a Change of Major form and may need approval from the new department. Some majors have GPA requirements or prerequisite courses. Changes are processed within 2-3 business days.',
    category: 'academic'
  },
  {
    id: '10',
    question: 'Is there campus shuttle service?',
    answer: 'Yes! Free shuttles run every 15 minutes between campus buildings, off-campus apartments, and downtown. Download the "Campus Transit" app for real-time tracking. Night shuttles run until 2 AM. SafeRide escorts are available after hours - call Campus Security.',
    category: 'campus'
  }
];

// Helper function to get FAQ by ID
export const getFAQById = (id: string): FAQ | undefined => {
  return faqs.find(faq => faq.id === id);
};

// Helper function to get FAQs by category
export const getFAQsByCategory = (category: FAQ['category']): FAQ[] => {
  return faqs.filter(faq => faq.category === category);
};

