'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Moon,
  Activity,
  Brain,
  Smile,
  Meh,
  Frown,
  Calendar,
  TrendingUp,
  Zap,
  Coffee,
} from 'lucide-react';
import { wellnessData } from '@/data';
import styles from './wellness.module.css';

const moodEmojis = ['😢', '😔', '😐', '🙂', '😊'];
const moodColors = ['#FF6B6B', '#FF9800', '#FFB800', '#8BC34A', '#4CAF50'];

export default function WellnessPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const avgSleep = wellnessData.sleepHours.reduce((a, b) => a + b.hours, 0) / wellnessData.sleepHours.length;
  const avgMood = wellnessData.moodHistory.reduce((a, b) => a + b.mood, 0) / wellnessData.moodHistory.length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Wellness</h1>
        <p>Track and improve your wellbeing</p>
      </div>

      {/* Mood Check-in */}
      <motion.div 
        className={styles.moodCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>How are you feeling today?</h2>
        <div className={styles.moodSelector}>
          {moodEmojis.map((emoji, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.9 }}
              className={`${styles.moodBtn} ${selectedMood === index + 1 ? styles.selected : ''}`}
              onClick={() => setSelectedMood(index + 1)}
              style={{ 
                background: selectedMood === index + 1 ? `${moodColors[index]}30` : 'transparent',
                borderColor: selectedMood === index + 1 ? moodColors[index] : 'transparent'
              }}
            >
              <span>{emoji}</span>
            </motion.button>
          ))}
        </div>
        {selectedMood && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.moodInput}
          >
            <input type="text" placeholder="Add a note (optional)..." />
            <motion.button whileTap={{ scale: 0.95 }} className={styles.saveBtn}>
              Save
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <Moon size={24} className={styles.statIcon} />
          <span className={styles.statValue}>{avgSleep.toFixed(1)}h</span>
          <span className={styles.statLabel}>Avg Sleep</span>
        </div>
        <div className={styles.statCard}>
          <Smile size={24} className={styles.statIcon} style={{ color: moodColors[Math.round(avgMood) - 1] }} />
          <span className={styles.statValue}>{avgMood.toFixed(1)}/5</span>
          <span className={styles.statLabel}>Avg Mood</span>
        </div>
        <div className={styles.statCard}>
          <Activity size={24} className={styles.statIcon} />
          <span className={styles.statValue}>{wellnessData.exerciseMinutesThisWeek}</span>
          <span className={styles.statLabel}>Exercise Min</span>
        </div>
        <div className={styles.statCard}>
          <Zap size={24} className={styles.statIcon} style={{ color: wellnessData.stressLevel > 5 ? '#FF6B6B' : '#4CAF50' }} />
          <span className={styles.statValue}>{wellnessData.stressLevel}/10</span>
          <span className={styles.statLabel}>Stress Level</span>
        </div>
      </div>

      {/* Weekly Mood Chart */}
      <div className={styles.section}>
        <h2>Weekly Mood</h2>
        <div className={styles.moodChart}>
          {wellnessData.moodHistory.slice(0, 7).reverse().map((day, index) => (
            <div key={index} className={styles.moodBar}>
              <div 
                className={styles.moodFill}
                style={{ 
                  height: `${day.mood * 20}%`,
                  background: moodColors[day.mood - 1]
                }}
              />
              <span>{['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sleep Chart */}
      <div className={styles.section}>
        <h2>Sleep This Week</h2>
        <div className={styles.sleepChart}>
          {wellnessData.sleepHours.slice(0, 7).reverse().map((day, index) => (
            <div key={index} className={styles.sleepBar}>
              <div 
                className={styles.sleepFill}
                style={{ 
                  height: `${(day.hours / 10) * 100}%`,
                  background: day.hours >= 7 ? 'var(--gradient-primary)' : 'rgba(255, 107, 107, 0.6)'
                }}
              >
                <span>{day.hours}h</span>
              </div>
            </div>
          ))}
        </div>
        <p className={styles.sleepGoal}>Goal: 7-8 hours per night</p>
      </div>

      {/* Recommendations */}
      <div className={styles.section}>
        <h2><Brain size={18} /> Personalized Tips</h2>
        <div className={styles.tipsList}>
          {wellnessData.recommendations.map((tip, index) => (
            <motion.div 
              key={index}
              className={styles.tipCard}
              whileTap={{ scale: 0.98 }}
            >
              <span className={styles.tipIcon}>💡</span>
              <p>{tip}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <h2>Wellness Resources</h2>
        <div className={styles.resourceGrid}>
          <motion.div whileTap={{ scale: 0.95 }} className={styles.resourceCard}>
            <Calendar size={24} />
            <span>Book Counseling</span>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }} className={styles.resourceCard}>
            <Heart size={24} />
            <span>Health Clinic</span>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }} className={styles.resourceCard}>
            <Activity size={24} />
            <span>Fitness Classes</span>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }} className={styles.resourceCard}>
            <Coffee size={24} />
            <span>Meditation</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

