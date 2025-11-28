'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  User,
  Check,
  Share2,
  Loader2
} from 'lucide-react';
import { useEvent } from '@/hooks/useSupabase';
import { useAuth } from '@/context/AuthContext';
import { api, Event } from '@/lib/supabase';
import Button from '@/components/Button';
import PageTransition from '@/components/PageTransition';
import styles from './page.module.css';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import animationData from '@/data/lottie-animation.json';

const categoryColors: Record<string, string> = {
  academic: '#4CAF50',
  social: '#FF9800',
  sports: '#2196F3',
  career: '#9C27B0',
  workshop: '#FF6B6B',
};

const categoryLabels: Record<string, string> = {
  academic: '📚 Academic',
  social: '🎉 Social',
  sports: '⚽ Sports',
  career: '💼 Career',
  workshop: '🛠️ Workshop',
};

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default function EventPage({ params }: EventPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { data: event, loading: eventLoading, error, refetch } = useEvent(id);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event?.is_attending) {
      setJoined(true);
    }
  }, [event?.is_attending]);

  if (eventLoading) {
    return (
      <PageTransition>
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.spinner} size={32} />
          <p>Loading event...</p>
        </div>
      </PageTransition>
    );
  }

  if (error || !event) {
    return (
      <PageTransition>
        <div className={styles.notFound}>
          <h1>Event not found</h1>
          <p>This event may have been removed or doesn&apos;t exist.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </PageTransition>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleJoin = async () => {
    if (!user) {
      router.push('/');
      return;
    }

    setLoading(true);
    try {
      if (joined) {
        // Leave event
        await api.leaveEvent(id, user.id);
        setJoined(false);
      } else {
        // Join event
        await api.joinEvent(id, user.id);
        setJoined(true);
      }
      refetch();
    } catch (err) {
      console.error('Failed to update attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href,
      });
    }
  };

  const attendeeCount = event.attendee_count || 0;
  const spotsLeft = event.max_attendees - attendeeCount;
  const percentFull = (attendeeCount / event.max_attendees) * 100;

  return (
    <PageTransition>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={styles.backButton}
            onClick={() => router.back()}
          >
            <ArrowLeft size={22} />
          </motion.button>
          <h1 className={styles.headerTitle}>Event Details</h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={styles.shareButton}
            onClick={handleShare}
          >
            <Share2 size={20} />
          </motion.button>
        </header>

        {/* Hero Section */}
        <div className={styles.hero}>
          <div 
            className={styles.heroGradient}
            style={{ background: `linear-gradient(135deg, ${categoryColors[event.category] || '#666'}40 0%, transparent 100%)` }}
          />
          <div className={styles.lottieContainer}>
            <Lottie
              animationData={animationData}
              loop={true}
              className={styles.lottie}
            />
          </div>
          <span 
            className={styles.category}
            style={{ 
              backgroundColor: `${categoryColors[event.category] || '#666'}30`, 
              color: categoryColors[event.category] || '#666' 
            }}
          >
            {categoryLabels[event.category] || event.category}
          </span>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <h2 className={styles.title}>{event.title}</h2>

          {/* Meta Info */}
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <div className={styles.metaIcon}>
                <Calendar size={18} />
              </div>
              <div className={styles.metaContent}>
                <span className={styles.metaLabel}>Date</span>
                <span className={styles.metaValue}>{formatDate(event.date)}</span>
              </div>
            </div>

            <div className={styles.metaItem}>
              <div className={styles.metaIcon}>
                <Clock size={18} />
              </div>
              <div className={styles.metaContent}>
                <span className={styles.metaLabel}>Time</span>
                <span className={styles.metaValue}>{event.time}</span>
              </div>
            </div>

            <div className={styles.metaItem}>
              <div className={styles.metaIcon}>
                <MapPin size={18} />
              </div>
              <div className={styles.metaContent}>
                <span className={styles.metaLabel}>Location</span>
                <span className={styles.metaValue}>{event.location}</span>
              </div>
            </div>

            {event.organizer && (
              <div className={styles.metaItem}>
                <div className={styles.metaIcon}>
                  <User size={18} />
                </div>
                <div className={styles.metaContent}>
                  <span className={styles.metaLabel}>Organizer</span>
                  <span className={styles.metaValue}>{event.organizer}</span>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>About this event</h3>
              <p className={styles.description}>{event.description}</p>
            </div>
          )}

          {/* Attendance */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Attendance</h3>
            <div className={styles.attendanceCard}>
              <div className={styles.attendanceHeader}>
                <Users size={18} />
                <span>{attendeeCount} attending</span>
                <span className={styles.spotsLeft}>
                  {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
                </span>
              </div>
              <div className={styles.progressBar}>
                <motion.div 
                  className={styles.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentFull}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ 
                    background: percentFull > 80 
                      ? 'linear-gradient(90deg, #FF6B6B, #FF8E8E)' 
                      : 'var(--gradient-primary)' 
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Action */}
        <div className={styles.bottomAction}>
          <div className={styles.bottomContent}>
            {joined ? (
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                icon={<Check size={20} />}
                onClick={handleJoin}
                loading={loading}
              >
                You&apos;re Going! 🎉
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                onClick={handleJoin}
                disabled={spotsLeft === 0}
              >
                {spotsLeft > 0 ? 'Join Event' : 'Event Full'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
