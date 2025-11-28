'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  BookOpen,
  TrendingUp,
  Wallet,
  Utensils,
  Bell,
  Trophy,
  Target,
  Flame,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Coffee,
} from 'lucide-react';
import { currentUser, assignments, financialSummary, courses, userStats, notifications } from '@/data';
import styles from './home.module.css';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardHome() {
  const router = useRouter();
  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 18 ? 'Good afternoon' : 'Good evening';
  
  const upcomingAssignments = assignments
    .filter(a => a.status === 'pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const todayClasses = courses.filter(c => c.status === 'enrolled').slice(0, 3);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      className={styles.container}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Greeting Section */}
      <motion.div variants={item} className={styles.greeting}>
        <div className={styles.greetingText}>
          <h1>{greeting}, {currentUser.name.split(' ')[0]}! 👋</h1>
          <p>Here&apos;s what&apos;s happening today</p>
        </div>
        <div className={styles.streakBadge}>
          <Flame size={18} />
          <span>{userStats.streak} day streak</span>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={item} className={styles.quickStats}>
        <div className={styles.statCard} onClick={() => router.push('/dashboard/academics')}>
          <div className={styles.statIcon} style={{ background: 'rgba(108, 99, 255, 0.15)' }}>
            <TrendingUp size={20} color="#6C63FF" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{currentUser.gpa}</span>
            <span className={styles.statLabel}>GPA</span>
          </div>
        </div>
        <div className={styles.statCard} onClick={() => router.push('/dashboard/academics')}>
          <div className={styles.statIcon} style={{ background: 'rgba(76, 175, 80, 0.15)' }}>
            <BookOpen size={20} color="#4CAF50" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{currentUser.totalCredits}</span>
            <span className={styles.statLabel}>Credits</span>
          </div>
        </div>
        <div className={styles.statCard} onClick={() => router.push('/dashboard/financial')}>
          <div className={styles.statIcon} style={{ background: 'rgba(255, 152, 0, 0.15)' }}>
            <Wallet size={20} color="#FF9800" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>${financialSummary.campusCardBalance.toFixed(0)}</span>
            <span className={styles.statLabel}>Balance</span>
          </div>
        </div>
        <div className={styles.statCard} onClick={() => router.push('/dashboard/achievements')}>
          <div className={styles.statIcon} style={{ background: 'rgba(255, 107, 107, 0.15)' }}>
            <Trophy size={20} color="#FF6B6B" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{userStats.totalPoints}</span>
            <span className={styles.statLabel}>Points</span>
          </div>
        </div>
      </motion.div>

      {/* Alerts Section */}
      {unreadNotifications > 0 && (
        <motion.div 
          variants={item} 
          className={styles.alertCard}
          onClick={() => router.push('/dashboard/notifications')}
        >
          <div className={styles.alertIcon}>
            <Bell size={20} />
          </div>
          <div className={styles.alertContent}>
            <span className={styles.alertTitle}>You have {unreadNotifications} new notifications</span>
            <span className={styles.alertSubtitle}>Tap to view all</span>
          </div>
          <ChevronRight size={20} className={styles.alertChevron} />
        </motion.div>
      )}

      {/* Today's Schedule */}
      <motion.div variants={item} className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2><Calendar size={18} /> Today&apos;s Classes</h2>
          <button onClick={() => router.push('/dashboard/academics')}>View All</button>
        </div>
        <div className={styles.scheduleList}>
          {todayClasses.map((course, index) => (
            <motion.div
              key={course.id}
              className={styles.scheduleCard}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/dashboard/academics/course/${course.id}`)}
            >
              <div 
                className={styles.scheduleTime}
                style={{ background: index === 0 ? 'var(--gradient-primary)' : 'var(--color-surface-elevated)' }}
              >
                <Clock size={14} />
                <span>{course.schedule[0]?.time || '10:00 AM'}</span>
              </div>
              <div className={styles.scheduleInfo}>
                <span className={styles.scheduleName}>{course.code}</span>
                <span className={styles.scheduleDetails}>{course.name}</span>
                <span className={styles.scheduleLocation}>{course.schedule[0]?.location}</span>
              </div>
              {index === 0 && <span className={styles.nowBadge}>Now</span>}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Upcoming Deadlines */}
      <motion.div variants={item} className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2><Target size={18} /> Upcoming Deadlines</h2>
          <button onClick={() => router.push('/dashboard/academics')}>View All</button>
        </div>
        <div className={styles.deadlineList}>
          {upcomingAssignments.map((assignment) => {
            const dueDate = new Date(assignment.dueDate);
            const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const isUrgent = daysLeft <= 2;
            
            return (
              <motion.div
                key={assignment.id}
                className={`${styles.deadlineCard} ${isUrgent ? styles.urgent : ''}`}
                whileTap={{ scale: 0.98 }}
              >
                <div className={styles.deadlineIcon}>
                  {isUrgent ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                </div>
                <div className={styles.deadlineInfo}>
                  <span className={styles.deadlineTitle}>{assignment.title}</span>
                  <span className={styles.deadlineCourse}>{assignment.courseCode}</span>
                </div>
                <div className={styles.deadlineDate}>
                  <span className={isUrgent ? styles.urgentText : ''}>
                    {daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft} days`}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item} className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Quick Actions</h2>
        </div>
        <div className={styles.quickActions}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={styles.actionBtn}
            onClick={() => router.push('/dashboard/study')}
          >
            <BookOpen size={24} />
            <span>Book Room</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={styles.actionBtn}
            onClick={() => router.push('/dashboard/dining')}
          >
            <Coffee size={24} />
            <span>Dining</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={styles.actionBtn}
            onClick={() => router.push('/dashboard/transport')}
          >
            <Clock size={24} />
            <span>Bus Times</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={styles.actionBtn}
            onClick={() => router.push('/dashboard/ai')}
          >
            <Target size={24} />
            <span>AI Help</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Meal Plan Widget */}
      <motion.div 
        variants={item} 
        className={styles.mealWidget}
        onClick={() => router.push('/dashboard/dining')}
      >
        <div className={styles.mealInfo}>
          <Utensils size={20} />
          <div>
            <span className={styles.mealLabel}>Meal Plan Balance</span>
            <span className={styles.mealValue}>${financialSummary.mealPlanBalance.toFixed(2)}</span>
          </div>
        </div>
        <div className={styles.mealProgress}>
          <div 
            className={styles.mealProgressBar}
            style={{ width: `${(financialSummary.mealPlanBalance / 1000) * 100}%` }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
