'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Users,
  BookOpen,
  Search,
  Plus,
  X,
  Check,
  CheckCheck,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api, Conversation } from '@/lib/supabase';
import styles from './messages.module.css';

interface UserSearchResult {
  id: string;
  name: string;
  avatar_url?: string;
  major?: string;
  year?: string;
}

const typeIcons: Record<string, any> = {
  direct: MessageCircle,
  group: Users,
  course: BookOpen,
};

export default function MessagesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'groups' | 'direct'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      
      setLoading(true);
      const { data } = await api.getConversations(user.id);
      if (data) {
        setConversations(data);
      }
      setLoading(false);
    };

    fetchConversations();
  }, [user]);

  // Search users for new chat
  useEffect(() => {
    const searchUsers = async () => {
      if (!userSearchQuery.trim() || !user) {
        setSearchResults([]);
        return;
      }

      setSearchingUsers(true);
      const { data } = await api.searchUsers(userSearchQuery, user.id);
      if (data) {
        setSearchResults(data);
      }
      setSearchingUsers(false);
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [userSearchQuery, user]);

  // Start new conversation
  const startConversation = async (otherUser: UserSearchResult) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    console.log('Starting conversation with:', otherUser.name, otherUser.id);
    
    try {
      const result = await api.createDirectConversation(user.id, otherUser.id);
      console.log('Create conversation result:', result);
      
      if (result.error) {
        console.error('Error creating conversation:', result.error);
        // Provide helpful message for RLS policy errors
        const errorMsg = result.error.message || 'Unknown error';
        const errorCode = (result.error as any).code;
        if (errorMsg.includes('policy') || errorMsg.includes('permission') || errorCode === '42501') {
          alert('Permission denied. Please make sure you have run the messaging SQL policies in Supabase.');
        } else {
          alert('Failed to create conversation: ' + errorMsg);
        }
        return;
      }
      
      if (result.data) {
        console.log('Conversation created/found:', result.data.id);
        setShowNewChat(false);
        setUserSearchQuery('');
        setSearchResults([]);
        // Use window.location for more reliable navigation
        window.location.href = `/dashboard/messages/${result.data.id}`;
      }
    } catch (error) {
      console.error('Exception creating conversation:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    // Apply type filter
    if (filter === 'unread' && (conv.unreadCount || 0) === 0) return false;
    if (filter === 'groups' && conv.type !== 'group') return false;
    if (filter === 'direct' && conv.type !== 'direct') return false;

    // Apply search filter
    if (searchQuery.trim()) {
      const name = conv.type === 'direct'
        ? conv.participants?.find(p => p.id !== user?.id)?.name || ''
        : conv.name || '';
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return true;
  });

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getConversationName = (conv: Conversation) => {
    if (conv.type === 'direct') {
      const otherUser = conv.participants?.find(p => p.id !== user?.id);
      return otherUser?.name || 'Unknown User';
    }
    return conv.name || 'Group Chat';
  };

  const getConversationAvatar = (conv: Conversation) => {
    if (conv.type === 'direct') {
      const otherUser = conv.participants?.find(p => p.id !== user?.id);
      return otherUser?.name?.charAt(0) || '?';
    }
    return conv.name?.charAt(0) || 'G';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Messages</h1>
          <p>{totalUnread} unread message{totalUnread !== 1 ? 's' : ''}</p>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }} 
          className={styles.newBtn}
          onClick={() => setShowNewChat(true)}
        >
          <Plus size={20} />
        </motion.button>
      </div>

      {/* Search */}
      <div className={styles.searchBox}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search conversations..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {(['all', 'unread', 'groups', 'direct'] as const).map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Conversation List */}
      <div className={styles.conversationList}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className={styles.emptyState}>
            <MessageCircle size={48} />
            <h3>No conversations yet</h3>
            <p>Start a new chat to connect with others</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={styles.startChatBtn}
              onClick={() => setShowNewChat(true)}
            >
              <UserPlus size={18} />
              Start a conversation
            </motion.button>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const TypeIcon = typeIcons[conversation.type];
            const hasUnread = (conversation.unreadCount || 0) > 0;
            
            return (
              <motion.div
                key={conversation.id}
                className={`${styles.conversationCard} ${hasUnread ? styles.unread : ''}`}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/dashboard/messages/${conversation.id}`)}
              >
                <div className={styles.avatar}>
                  {conversation.type === 'direct' ? (
                    getConversationAvatar(conversation)
                  ) : (
                    <TypeIcon size={20} />
                  )}
                </div>
                
                <div className={styles.conversationInfo}>
                  <div className={styles.conversationHeader}>
                    <span className={styles.conversationName}>
                      {getConversationName(conversation)}
                    </span>
                    {conversation.lastMessage && (
                      <span className={styles.conversationTime}>
                        {formatTime(conversation.lastMessage.created_at)}
                      </span>
                    )}
                  </div>
                  {conversation.lastMessage && (
                    <div className={styles.lastMessage}>
                      {conversation.type !== 'direct' && conversation.lastMessage.sender && (
                        <span className={styles.senderName}>
                          {conversation.lastMessage.sender_id === user?.id 
                            ? 'You' 
                            : conversation.lastMessage.sender.name}:
                        </span>
                      )}
                      <span className={styles.messagePreview}>
                        {conversation.lastMessage.content}
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.conversationMeta}>
                  {hasUnread ? (
                    <span className={styles.unreadBadge}>{conversation.unreadCount}</span>
                  ) : conversation.lastMessage?.sender_id === user?.id ? (
                    <CheckCheck size={16} className={styles.readIcon} />
                  ) : null}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChat && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewChat(false)}
          >
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2>New Message</h2>
                <button 
                  className={styles.closeBtn}
                  onClick={() => setShowNewChat(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className={styles.modalSearch}>
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search for a user..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>

              <div className={styles.searchResultsList}>
                {searchingUsers ? (
                  <div className={styles.searchLoading}>
                    <div className={styles.spinner} />
                  </div>
                ) : searchResults.length === 0 && userSearchQuery.trim() ? (
                  <div className={styles.noResults}>
                    <p>No users found</p>
                  </div>
                ) : (
                  searchResults.map((profile) => (
                    <motion.button
                      key={profile.id}
                      className={styles.userResult}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => startConversation(profile)}
                    >
                      <div className={styles.userAvatar}>
                        {profile.name?.charAt(0) || '?'}
                      </div>
                      <div className={styles.userInfo}>
                        <span className={styles.userName}>{profile.name}</span>
                        {profile.major && (
                          <span className={styles.userMajor}>
                            {profile.major} {profile.year && `• ${profile.year}`}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
