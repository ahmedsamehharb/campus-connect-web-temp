'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Send,
  MoreVertical,
  Phone,
  Video,
  Info,
  Check,
  CheckCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api, Message, Profile } from '@/lib/supabase';
import styles from './conversation.module.css';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationInfo, setConversationInfo] = useState<{
    name: string;
    type: string;
    participants: Profile[];
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const conversationId = params.id as string;

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch messages and conversation info
  useEffect(() => {
    const fetchData = async () => {
      if (!conversationId || !user) return;

      setLoading(true);

      // Get messages
      const { data: messagesData } = await api.getMessages(conversationId);
      if (messagesData) {
        setMessages(messagesData);
      }

      // Get conversation info
      const { data: conversations } = await api.getConversations(user.id);
      const conv = conversations?.find((c: any) => c.id === conversationId);
      if (conv) {
        const otherParticipants = conv.participants?.filter(
          (p: Profile) => p.id !== user.id
        );
        setConversationInfo({
          name: conv.type === 'direct' 
            ? otherParticipants?.[0]?.name || 'Unknown'
            : conv.name || 'Group Chat',
          type: conv.type,
          participants: conv.participants || []
        });
      }

      // Mark messages as read
      await api.markMessagesAsRead(conversationId, user.id);

      setLoading(false);
    };

    fetchData();
  }, [conversationId, user]);

  // Subscribe to new messages
  useEffect(() => {
    if (!conversationId || !user) return;

    const subscription = api.subscribeToMessages(conversationId, (newMsg) => {
      // Check for duplicates before adding (prevents double messages for sender)
      setMessages(prev => {
        const exists = prev.some(m => m.id === newMsg.id);
        if (exists) return prev;
        return [...prev, newMsg];
      });
      // Mark as read if from someone else
      if (newMsg.sender_id !== user.id) {
        api.markMessagesAsRead(conversationId, user.id);
      }
    });

    return () => {
      api.unsubscribeFromMessages(conversationId);
    };
  }, [conversationId, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message handler
  const handleSend = async () => {
    if (!newMessage.trim() || !user || sending) {
      console.log('Send blocked:', { hasMessage: !!newMessage.trim(), hasUser: !!user, sending });
      return;
    }

    console.log('Sending message:', newMessage.trim());
    setSending(true);
    
    try {
      const { data, error } = await api.sendMessage(
        conversationId,
        user.id,
        newMessage.trim()
      );

      console.log('Send result:', { data, error });

      if (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message: ' + (error.message || 'Unknown error'));
      } else if (data) {
        setMessages(prev => [...prev, data]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Exception sending message:', err);
      alert('An error occurred while sending the message');
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  // Handle enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Format date separator
  const formatDateSeparator = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Check if we should show date separator
  const shouldShowDateSeparator = (index: number) => {
    if (index === 0) return true;
    const currentDate = new Date(messages[index].created_at).toDateString();
    const prevDate = new Date(messages[index - 1].created_at).toDateString();
    return currentDate !== prevDate;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </button>
        
        <div className={styles.headerInfo}>
          <div className={styles.avatar}>
            {conversationInfo?.name?.charAt(0) || '?'}
          </div>
          <div className={styles.headerText}>
            <h2>{conversationInfo?.name}</h2>
            <span className={styles.status}>
              {conversationInfo?.type === 'group' 
                ? `${conversationInfo.participants.length} members`
                : 'Online'}
            </span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.actionBtn}>
            <Phone size={20} />
          </button>
          <button className={styles.actionBtn}>
            <Video size={20} />
          </button>
          <button className={styles.actionBtn}>
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No messages yet</p>
            <span>Start the conversation!</span>
          </div>
        ) : (
          <div className={styles.messagesList}>
            {messages.map((message, index) => {
              const isOwnMessage = message.sender_id === user?.id;
              const showAvatar = !isOwnMessage && (
                index === messages.length - 1 || 
                messages[index + 1]?.sender_id !== message.sender_id
              );

              return (
                <div key={message.id}>
                  {shouldShowDateSeparator(index) && (
                    <div className={styles.dateSeparator}>
                      <span>{formatDateSeparator(message.created_at)}</span>
                    </div>
                  )}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${styles.messageWrapper} ${isOwnMessage ? styles.own : ''}`}
                  >
                    {!isOwnMessage && showAvatar && (
                      <div className={styles.messageAvatar}>
                        {message.sender?.name?.charAt(0) || '?'}
                      </div>
                    )}
                    {!isOwnMessage && !showAvatar && (
                      <div className={styles.avatarPlaceholder} />
                    )}
                    
                    <div className={`${styles.messageBubble} ${isOwnMessage ? styles.ownBubble : ''}`}>
                      {!isOwnMessage && conversationInfo?.type !== 'direct' && (
                        <span className={styles.senderName}>
                          {message.sender?.name}
                        </span>
                      )}
                      <p className={styles.messageContent}>{message.content}</p>
                      <div className={styles.messageFooter}>
                        <span className={styles.messageTime}>
                          {formatTime(message.created_at)}
                        </span>
                        {isOwnMessage && (
                          <span className={styles.readStatus}>
                            {message.read ? (
                              <CheckCheck size={14} />
                            ) : (
                              <Check size={14} />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className={styles.input}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={`${styles.sendBtn} ${newMessage.trim() ? styles.active : ''}`}
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

