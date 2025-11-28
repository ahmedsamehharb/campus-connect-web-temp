'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  BookOpen,
  Wallet,
  Calendar,
  MessageCircle,
  AlertCircle,
  Clock,
  Check,
  CheckCheck,
} from 'lucide-react';
import { notifications, Notification } from '@/data';
import styles from './notifications.module.css';

const typeIcons: Record<Notification['type'], any> = {
  academic: BookOpen,
  financial: Wallet,
  event: Calendar,
  social: MessageCircle,
  urgent: AlertCircle,
  reminder: Clock,
};

const typeColors: Record<Notification['type'], string> = {
  academic: '#4CAF50',
  financial: '#FF9800',
  event: '#2196F3',
  social: '#9C27B0',
  urgent: '#FF6B6B',
  reminder: '#6C63FF',
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(notifications);
  
  const unreadCount = notifs.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Notifications</h1>
          <p>{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className={styles.markAllBtn}
            onClick={markAllRead}
          >
            <CheckCheck size={16} />
            Mark all read
          </motion.button>
        )}
      </div>

      {/* Notification List */}
      <div className={styles.notificationList}>
        {notifs.map((notification, index) => {
          const Icon = typeIcons[notification.type];
          const color = typeColors[notification.type];
          
          return (
            <motion.div
              key={notification.id}
              className={`${styles.notificationCard} ${!notification.read ? styles.unread : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => markAsRead(notification.id)}
            >
              <div 
                className={styles.notificationIcon}
                style={{ background: `${color}20`, color }}
              >
                <Icon size={18} />
              </div>
              
              <div className={styles.notificationContent}>
                <div className={styles.notificationHeader}>
                  <span className={styles.notificationTitle}>{notification.title}</span>
                  {notification.priority === 'urgent' && (
                    <span className={styles.urgentBadge}>Urgent</span>
                  )}
                </div>
                <p className={styles.notificationMessage}>{notification.message}</p>
                <span className={styles.notificationTime}>{formatTime(notification.timestamp)}</span>
              </div>

              {!notification.read && <div className={styles.unreadDot} />}
            </motion.div>
          );
        })}
      </div>

      {notifs.length === 0 && (
        <div className={styles.empty}>
          <Bell size={48} />
          <p>No notifications</p>
        </div>
      )}
    </div>
  );
}

