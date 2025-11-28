// Community categories configuration
// Categories must match database schema: 'question', 'help', 'discussion', 'announcement'

export type PostCategory = 'all' | 'question' | 'help' | 'discussion' | 'announcement';

export const categories: { id: PostCategory; label: string; color: string }[] = [
  { id: 'all', label: 'All', color: '#1E3A8A' },
  { id: 'question', label: 'Question', color: '#2196F3' },
  { id: 'help', label: 'Help', color: '#FF9800' },
  { id: 'discussion', label: 'Discussion', color: '#4CAF50' },
  { id: 'announcement', label: 'Announcement', color: '#9C27B0' },
];

// Helper function to get category by ID
export const getCategoryById = (id: string) => {
  return categories.find(c => c.id === id);
};

// Helper function to get category color
export const getCategoryColor = (category: string) => {
  return categories.find(c => c.id === category)?.color || '#64748B';
};

// Helper function to get category label
export const getCategoryLabel = (category: string) => {
  return categories.find(c => c.id === category)?.label || category;
};
