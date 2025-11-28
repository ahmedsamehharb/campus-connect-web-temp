'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  X,
  MessageCircle,
  List,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api, Event, Profile } from '@/lib/supabase';
import styles from './events.module.css';

// Category configuration
const categoryColors: Record<string, string> = {
  academic: '#4CAF50',
  social: '#FF9800',
  sports: '#2196F3',
  career: '#9C27B0',
  workshop: '#FF6B6B',
};

const categoryLabels: Record<string, string> = {
  academic: 'Academic',
  social: 'Social',
  sports: 'Sports',
  career: 'Career',
  workshop: 'Workshop',
};

interface EventAttendee {
  id: string;
  name: string;
  major?: string;
  avatar_url?: string;
}

interface EventWithAttendees extends Event {
  attendees?: EventAttendee[];
  organizer_profile?: Profile;
}

export default function EventsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // State
  const [events, setEvents] = useState<EventWithAttendees[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedEvent, setSelectedEvent] = useState<EventWithAttendees | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joiningEventId, setJoiningEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'social',
    location: '',
    date: '',
    time: '',
    max_attendees: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const [eventAttendees, setEventAttendees] = useState<Record<string, EventAttendee[]>>({});
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data, error } = await api.getEvents(user?.id);
        if (error) {
          console.error('Error fetching events:', error);
          setEvents([]);
        } else {
          setEvents(data || []);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user?.id]);

  // Fetch attendees when an event is selected
  useEffect(() => {
    const fetchAttendees = async () => {
      if (!selectedEvent) return;
      
      setLoadingAttendees(true);
      try {
        const { data, error } = await api.getEventAttendees(selectedEvent.id);
        if (error) {
          console.error('Error fetching attendees:', error);
        } else if (data) {
          const attendees = data.map((a: { profile: { id: string; name: string; avatar_url?: string; major?: string }[] | { id: string; name: string; avatar_url?: string; major?: string }; user_id: string }) => {
            // Handle both array and object profile responses from Supabase
            const profile = Array.isArray(a.profile) ? a.profile[0] : a.profile;
            return {
              id: profile?.id || a.user_id,
              name: profile?.name || 'Anonymous',
              major: profile?.major,
              avatar_url: profile?.avatar_url,
            };
          });
          setEventAttendees(prev => ({ ...prev, [selectedEvent.id]: attendees }));
        }
      } catch (err) {
        console.error('Error fetching attendees:', err);
      } finally {
        setLoadingAttendees(false);
      }
    };

    fetchAttendees();
  }, [selectedEvent?.id]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate(),
      full: date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }),
    };
  };

  // Handle join/leave event
  const handleJoinEvent = async (event: EventWithAttendees, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      alert('Please sign in to join events');
      return;
    }

    setJoiningEventId(event.id);

    try {
      if (event.is_attending) {
        // Leave event
        const { error } = await api.leaveEvent(event.id, user.id);
        if (error) {
          console.error('Error leaving event:', error);
          alert('Failed to leave event');
        } else {
          // Update local state
          setEvents(prev => prev.map(e => 
            e.id === event.id 
              ? { ...e, is_attending: false, attendee_count: (e.attendee_count || 1) - 1 }
              : e
          ));
          if (selectedEvent?.id === event.id) {
            setSelectedEvent(prev => prev ? { ...prev, is_attending: false, attendee_count: (prev.attendee_count || 1) - 1 } : null);
          }
        }
      } else {
        // Join event
        const { error } = await api.joinEvent(event.id, user.id);
        if (error) {
          console.error('Error joining event:', error);
          alert('Failed to join event');
        } else {
          // Update local state
          setEvents(prev => prev.map(e => 
            e.id === event.id 
              ? { ...e, is_attending: true, attendee_count: (e.attendee_count || 0) + 1 }
              : e
          ));
          if (selectedEvent?.id === event.id) {
            setSelectedEvent(prev => prev ? { ...prev, is_attending: true, attendee_count: (prev.attendee_count || 0) + 1 } : null);
          }
        }
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred');
    } finally {
      setJoiningEventId(null);
    }
  };

  // Handle message user
  const handleMessageUser = async (userId: string, userName: string) => {
    if (!user) {
      alert('Please sign in to message users');
      return;
    }

    if (userId === user.id) {
      alert('You cannot message yourself');
      return;
    }

    try {
      const result = await api.createDirectConversation(user.id, userId);
      if (result.error) {
        console.error('Error creating conversation:', result.error);
        alert('Failed to start conversation');
        return;
      }
      if (result.data) {
        router.push(`/dashboard/messages/${result.data.id}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to start conversation');
    }
  };

  // Handle create event
  const handleCreateEvent = async () => {
    if (!user) {
      alert('Please sign in to create an event');
      return;
    }

    if (!newEvent.title || !newEvent.location || !newEvent.date || !newEvent.category) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      // Parse the datetime-local value
      const dateTime = new Date(newEvent.date);
      const dateStr = dateTime.toISOString().split('T')[0];
      const timeStr = dateTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });

      const eventData = {
        title: newEvent.title,
        date: dateStr,
        time: timeStr,
        location: newEvent.location,
        description: newEvent.description || undefined,
        category: newEvent.category,
        max_attendees: newEvent.max_attendees ? parseInt(newEvent.max_attendees) : 100,
        organizer: user.email?.split('@')[0] || 'Anonymous',
      };

      const { data, error } = await api.createEvent(eventData);
      
      if (error) {
        console.error('Error creating event:', error);
        alert('Failed to create event. Please try again.');
        return;
      }

      // Add the new event to the list
      if (data) {
        setEvents(prev => [{ ...data, attendee_count: 0, is_attending: false }, ...prev]);
      }

      setShowCreateModal(false);
      setNewEvent({
        title: '',
        category: 'social',
        location: '',
        date: '',
        time: '',
        max_attendees: '',
        description: '',
      });
      alert('Event created successfully!');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  // Open event modal
  const openEventModal = (event: EventWithAttendees) => {
    setSelectedEvent(event);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Events Calendar</h1>
        <div className={styles.headerActions}>
          {user && (
            <button 
              className={styles.createBtn}
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={18} />
              Create Event
            </button>
          )}
          <div className={styles.viewToggle}>
            <button
              className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
              List
            </button>
            <button
              className={`${styles.toggleBtn} ${viewMode === 'calendar' ? styles.active : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              <Calendar size={16} />
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className={styles.loadingState}>
          <Loader2 size={32} className={styles.spinner} />
          <p>Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        /* Empty State */
        <div className={styles.emptyState}>
          <Calendar size={48} />
          <h3>No upcoming events</h3>
          <p>Be the first to create an event!</p>
          {user && (
            <motion.button
              className={styles.createFirstBtn}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={18} />
              Create Event
            </motion.button>
          )}
        </div>
      ) : (
        /* Events Grid */
        <div className={styles.eventsGrid}>
          {events.map((event, index) => {
            const dateInfo = formatDate(event.date);
            return (
              <motion.div
                key={event.id}
                className={styles.eventCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => openEventModal(event)}
              >
                {/* Date Badge */}
                <div className={styles.dateBadge}>
                  <span className={styles.dateMonth}>{dateInfo.month}</span>
                  <span className={styles.dateDay}>{dateInfo.day}</span>
                </div>

                {/* Event Icon */}
                <div className={styles.eventIcon}>
                  <Calendar size={32} />
                </div>

                {/* Event Info */}
                <div className={styles.eventInfo}>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <div className={styles.eventLocation}>
                    <MapPin size={14} />
                    <span>{event.location}</span>
                  </div>

                  {/* Attendees Avatars */}
                  <div className={styles.attendeesPreview}>
                    {[...Array(Math.max(0, Math.min(Number(event.attendee_count) || 0, 3)))].map((_, i) => (
                      <div key={i} className={styles.attendeeAvatar}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>

                  {/* Join Button */}
                  <div className={styles.eventActions}>
                    <motion.button
                      className={`${styles.joinBtn} ${event.is_attending ? styles.joined : ''}`}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleJoinEvent(event, e)}
                      disabled={joiningEventId === event.id}
                    >
                      {joiningEventId === event.id ? (
                        <Loader2 size={16} className={styles.spinner} />
                      ) : event.is_attending ? (
                        'Joined ✓'
                      ) : (
                        'Join Event'
                      )}
                    </motion.button>
                    <button className={styles.attendeesBtn} onClick={(e) => { e.stopPropagation(); openEventModal(event); }}>
                      <Users size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeBtn} onClick={() => setSelectedEvent(null)}>
                <X size={20} />
              </button>

              <h2 className={styles.modalTitle}>{selectedEvent.title}</h2>
              <p className={styles.modalDescription}>{selectedEvent.description || 'Join this event and meet fellow students!'}</p>

              <div className={styles.modalMeta}>
                <div className={styles.metaItem}>
                  <Calendar size={16} />
                  <span>{formatDate(selectedEvent.date).full} at {selectedEvent.time}</span>
                </div>
                <div className={styles.metaItem}>
                  <MapPin size={16} />
                  <span>{selectedEvent.location}</span>
                </div>
                <div className={styles.metaItem}>
                  <Users size={16} />
                  <span>{selectedEvent.attendee_count || 0} attendees</span>
                </div>
                <span 
                  className={styles.categoryBadge}
                  style={{ 
                    backgroundColor: `${categoryColors[selectedEvent.category] || '#64748B'}20`,
                    color: categoryColors[selectedEvent.category] || '#64748B',
                  }}
                >
                  {categoryLabels[selectedEvent.category] || selectedEvent.category}
                </span>
              </div>

              {/* Organizer */}
              <div className={styles.organizerSection}>
                <h4>Organized by</h4>
                <div className={styles.organizerCard}>
                  <div className={styles.organizerAvatar}>
                    {selectedEvent.organizer?.charAt(0) || 'O'}
                  </div>
                  <div className={styles.organizerInfo}>
                    <span className={styles.organizerName}>{selectedEvent.organizer || 'Event Organizer'}</span>
                    <span className={styles.organizerBio}>Event organizer</span>
                  </div>
                </div>
              </div>

              {/* Attendees */}
              <div className={styles.attendeesSection}>
                <h4>Attendees ({selectedEvent.attendee_count || 0})</h4>
                <div className={styles.attendeesList}>
                  {loadingAttendees ? (
                    <div className={styles.attendeesLoading}>
                      <Loader2 size={20} className={styles.spinner} />
                      <span>Loading attendees...</span>
                    </div>
                  ) : eventAttendees[selectedEvent.id]?.length > 0 ? (
                    // Attendees from database
                    eventAttendees[selectedEvent.id].map((attendee) => (
                      <div key={attendee.id} className={styles.attendeeItem}>
                        <div className={styles.attendeeAvatar}>
                          {attendee.avatar_url ? (
                            <img src={attendee.avatar_url} alt={attendee.name} />
                          ) : (
                            attendee.name?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        <div className={styles.attendeeInfo}>
                          <span className={styles.attendeeName}>{attendee.name}</span>
                          <span className={styles.attendeeMajor}>{attendee.major || 'Student'}</span>
                        </div>
                        <span className={styles.attendeeStatus}>going</span>
                        {user && attendee.id !== user.id && (
                          <button 
                            className={styles.attendeeMessageBtn}
                            onClick={() => handleMessageUser(attendee.id, attendee.name)}
                          >
                            <MessageCircle size={16} />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className={styles.noAttendees}>
                      <Users size={24} />
                      <span>No attendees yet. Be the first to join!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                className={`${styles.modalJoinBtn} ${selectedEvent.is_attending ? styles.joined : ''}`}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => handleJoinEvent(selectedEvent, e)}
                disabled={joiningEventId === selectedEvent.id}
              >
                {joiningEventId === selectedEvent.id ? (
                  <>
                    <Loader2 size={18} className={styles.spinner} />
                    Processing...
                  </>
                ) : selectedEvent.is_attending ? (
                  'Leave Event'
                ) : (
                  'Join Event'
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !submitting && setShowCreateModal(false)}
          >
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className={styles.closeBtn} 
                onClick={() => !submitting && setShowCreateModal(false)}
                disabled={submitting}
              >
                <X size={20} />
              </button>

              <h2 className={styles.modalTitle}>Create Event</h2>

              <div className={styles.formGroup}>
                <label>Event Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Sunday Cooking Club"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className={styles.input}
                  disabled={submitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Category *</label>
                <select
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                  className={styles.select}
                  disabled={submitting}
                >
                  <option value="">Select a category</option>
                  <option value="academic">Academic</option>
                  <option value="social">Social</option>
                  <option value="sports">Sports</option>
                  <option value="career">Career</option>
                  <option value="workshop">Workshop</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Location *</label>
                <input
                  type="text"
                  placeholder="e.g. Dorm Common Room"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className={styles.input}
                  disabled={submitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Date & Time *</label>
                <input
                  type="datetime-local"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className={styles.input}
                  disabled={submitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Max Attendees (optional)</label>
                <input
                  type="number"
                  placeholder="Leave empty for unlimited"
                  value={newEvent.max_attendees}
                  onChange={(e) => setNewEvent({ ...newEvent, max_attendees: e.target.value })}
                  className={styles.input}
                  disabled={submitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description (optional)</label>
                <textarea
                  placeholder="Tell people what the event is about..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className={styles.textarea}
                  rows={3}
                  disabled={submitting}
                />
              </div>

              <motion.button
                className={styles.createEventBtn}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateEvent}
                disabled={submitting || !newEvent.title || !newEvent.location || !newEvent.date}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className={styles.spinner} />
                    Creating...
                  </>
                ) : user ? (
                  'Create Event'
                ) : (
                  'Sign in to create'
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
