'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MessageCircle, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api, Post } from '@/lib/supabase';
import styles from './community.module.css';

// Category configuration - matches database schema
type PostCategory = 'all' | 'question' | 'help' | 'discussion' | 'announcement';

const categories: { id: PostCategory; label: string; color: string }[] = [
  { id: 'all', label: 'All', color: '#1E3A8A' },
  { id: 'question', label: 'Question', color: '#2196F3' },
  { id: 'help', label: 'Help', color: '#FF9800' },
  { id: 'discussion', label: 'Discussion', color: '#4CAF50' },
  { id: 'announcement', label: 'Announcement', color: '#9C27B0' },
];

export default function CommunityPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // State
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<PostCategory>('all');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'question' as PostCategory });
  const [submitting, setSubmitting] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  // Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await api.getPosts(user?.id);
        if (error) {
          console.error('Error fetching posts:', error);
        } else {
          setPosts(data || []);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user?.id]);

  // Filter posts based on search and category
  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get category color
  const getCategoryColor = (category: string) => {
    return categories.find(c => c.id === category)?.color || '#64748B';
  };

  // Get category label
  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.id === category)?.label || category;
  };

  // Handle reply - start a conversation with the post author
  const handleReply = async (post: Post) => {
    if (!user) {
      alert('Please sign in to reply');
      return;
    }

    if (!post.author?.id) {
      alert('Cannot find post author');
      return;
    }

    // Don't allow replying to your own post
    if (post.user_id === user.id) {
      alert('You cannot reply to your own post');
      return;
    }

    setReplyingToId(post.id);

    try {
      // Create or get existing conversation with the post author
      const result = await api.createDirectConversation(user.id, post.author.id);
      
      if (result.error) {
        console.error('Error creating conversation:', result.error);
        alert('Failed to start conversation. Please try again.');
        setReplyingToId(null);
        return;
      }

      if (result.data) {
        // Navigate to the conversation
        router.push(`/dashboard/messages/${result.data.id}`);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Failed to start conversation. Please try again.');
      setReplyingToId(null);
    }
  };

  // Handle new post creation
  const handleCreatePost = async () => {
    if (!user) {
      alert('Please sign in to create a post');
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await api.createPost(user.id, {
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        category: newPost.category,
      });

      if (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post. Please try again.');
        return;
      }

      // Refresh posts
      const { data: updatedPosts } = await api.getPosts(user.id);
      if (updatedPosts) {
        setPosts(updatedPosts);
      }

      setShowNewPost(false);
      setNewPost({ title: '', content: '', category: 'question' });
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle opening new post modal
  const handleOpenNewPost = () => {
    if (!user) {
      alert('Please sign in to create a post');
      return;
    }
    setShowNewPost(true);
  };

  return (
    <div className={styles.container}>
      {/* Header with Create Post Button */}
      <div className={styles.header}>
        <h1>Community Help Board</h1>
        {user && (
          <motion.button
            className={styles.createBtn}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenNewPost}
          >
            <Plus size={18} />
            <span>New Post</span>
          </motion.button>
        )}
      </div>

      {/* Search Bar */}
      <div className={styles.searchBox}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search requests..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Filters */}
      <div className={styles.categories}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.categoryBtn} ${activeCategory === category.id ? styles.active : ''}`}
            onClick={() => setActiveCategory(category.id)}
            style={{
              backgroundColor: activeCategory === category.id ? category.color : 'transparent',
              color: activeCategory === category.id ? 'white' : '#64748B',
              borderColor: activeCategory === category.id ? category.color : '#E2E8F0',
            }}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className={styles.loadingState}>
          <Loader2 size={32} className={styles.spinner} />
          <p>Loading posts...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        /* Empty State */
        <div className={styles.emptyState}>
          <MessageCircle size={48} />
          <h3>{posts.length === 0 ? 'No posts yet' : 'No posts found'}</h3>
          <p>
            {posts.length === 0 
              ? 'Be the first to share something with the community!' 
              : 'Try adjusting your search or filters'}
          </p>
          {user && posts.length === 0 && (
            <motion.button
              className={styles.createFirstBtn}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenNewPost}
            >
              <Plus size={18} />
              Create first post
            </motion.button>
          )}
        </div>
      ) : (
        /* Posts Grid */
        <div className={styles.postsGrid}>
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              className={styles.postCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Post Header */}
              <div className={styles.postHeader}>
                <div className={styles.authorInfo}>
                  <div className={styles.avatar}>
                    {post.author?.name?.charAt(0) || '?'}
                  </div>
                  <span className={styles.authorName}>{post.author?.name || 'Unknown User'}</span>
                </div>
                <span 
                  className={styles.categoryTag}
                  style={{ 
                    backgroundColor: `${getCategoryColor(post.category)}20`,
                    color: getCategoryColor(post.category),
                    borderColor: getCategoryColor(post.category),
                  }}
                >
                  {getCategoryLabel(post.category)}
                </span>
              </div>

              {/* Post Content */}
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.postContent}>{post.content}</p>

              {/* Reply Button */}
              {user && post.user_id !== user.id && (
                <motion.button
                  className={styles.replyBtn}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleReply(post)}
                  disabled={replyingToId === post.id}
                >
                  {replyingToId === post.id ? (
                    <>
                      <Loader2 size={16} className={styles.spinner} />
                      <span>Starting chat...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle size={16} />
                      <span>Reply</span>
                    </>
                  )}
                </motion.button>
              )}

              {/* Show "Your post" indicator for own posts */}
              {user && post.user_id === user.id && (
                <div className={styles.ownPostIndicator}>
                  Your post
                </div>
              )}

              {/* Sign in prompt for non-authenticated users */}
              {!user && (
                <motion.button
                  className={styles.replyBtn}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/')}
                >
                  <MessageCircle size={16} />
                  <span>Sign in to reply</span>
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !submitting && setShowNewPost(false)}
          >
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2>Create New Post</h2>
                <button 
                  className={styles.closeBtn}
                  onClick={() => !submitting && setShowNewPost(false)}
                  disabled={submitting}
                >
                  <X size={20} />
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value as PostCategory })}
                    className={styles.select}
                    disabled={submitting}
                  >
                    {categories.filter(c => c.id !== 'all').map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="What do you need help with?"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className={styles.input}
                    disabled={submitting}
                    maxLength={100}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea
                    placeholder="Provide more details..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className={styles.textarea}
                    rows={4}
                    disabled={submitting}
                    maxLength={500}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button 
                  className={styles.cancelBtn}
                  onClick={() => setShowNewPost(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  className={styles.submitBtn}
                  onClick={handleCreatePost}
                  disabled={submitting || !newPost.title.trim() || !newPost.content.trim()}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className={styles.spinner} />
                      Posting...
                    </>
                  ) : (
                    'Post'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
