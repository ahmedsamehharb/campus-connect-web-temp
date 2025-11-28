'use client';

import { motion } from 'framer-motion';
import {
  Trophy,
  Flame,
  Star,
  Zap,
  Medal,
  Crown,
  Target,
} from 'lucide-react';
import { userStats } from '@/data';
import styles from './achievements.module.css';

export default function AchievementsPage() {
  const unlockedCount = userStats.achievements.filter(a => a.unlocked).length;
  const totalPoints = userStats.achievements.filter(a => a.unlocked).reduce((acc, a) => acc + a.points, 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Achievements</h1>
        <p>Track your campus journey</p>
      </div>

      {/* Profile Card */}
      <motion.div 
        className={styles.profileCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.levelBadge}>
          <Crown size={24} />
          <span>Level {userStats.level}</span>
        </div>
        <div className={styles.profileStats}>
          <div className={styles.profileStat}>
            <Trophy size={20} />
            <span className={styles.profileValue}>{userStats.totalPoints}</span>
            <span className={styles.profileLabel}>Total Points</span>
          </div>
          <div className={styles.profileStat}>
            <Flame size={20} />
            <span className={styles.profileValue}>{userStats.streak}</span>
            <span className={styles.profileLabel}>Day Streak</span>
          </div>
          <div className={styles.profileStat}>
            <Medal size={20} />
            <span className={styles.profileValue}>#{userStats.rank}</span>
            <span className={styles.profileLabel}>Campus Rank</span>
          </div>
        </div>
        <div className={styles.levelProgress}>
          <div className={styles.levelBar}>
            <div 
              className={styles.levelFill}
              style={{ width: '65%' }}
            />
          </div>
          <span>650 XP to Level {userStats.level + 1}</span>
        </div>
      </motion.div>

      {/* Achievement Stats */}
      <div className={styles.achievementStats}>
        <div className={styles.achievementStat}>
          <span className={styles.achievementValue}>{unlockedCount}/{userStats.achievements.length}</span>
          <span className={styles.achievementLabel}>Unlocked</span>
        </div>
        <div className={styles.achievementStat}>
          <span className={styles.achievementValue}>{totalPoints}</span>
          <span className={styles.achievementLabel}>Points Earned</span>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className={styles.section}>
        <h2>All Achievements</h2>
        <div className={styles.achievementGrid}>
          {userStats.achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              className={`${styles.achievementCard} ${achievement.unlocked ? styles.unlocked : styles.locked}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className={styles.achievementIcon}>
                {achievement.icon}
              </div>
              <div className={styles.achievementInfo}>
                <h3>{achievement.name}</h3>
                <p>{achievement.description}</p>
                {achievement.progress !== undefined && !achievement.unlocked && (
                  <div className={styles.progressSection}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${(achievement.progress / (achievement.maxProgress || 1)) * 100}%` }}
                      />
                    </div>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                )}
              </div>
              <div className={styles.achievementPoints}>
                <Zap size={14} />
                <span>{achievement.points}</span>
              </div>
              {achievement.unlocked && (
                <div className={styles.unlockedBadge}>
                  <Star size={12} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div className={styles.section}>
        <h2>Campus Leaderboard</h2>
        <div className={styles.leaderboard}>
          {[
            { rank: 1, name: 'Alex C.', points: 3420, avatar: 'A' },
            { rank: 2, name: 'Sarah K.', points: 3180, avatar: 'S' },
            { rank: 3, name: 'Mike R.', points: 2890, avatar: 'M' },
          ].map((user) => (
            <div key={user.rank} className={styles.leaderboardItem}>
              <span className={`${styles.rank} ${styles[`rank${user.rank}`]}`}>
                {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
              </span>
              <div className={styles.leaderboardAvatar}>{user.avatar}</div>
              <span className={styles.leaderboardName}>{user.name}</span>
              <span className={styles.leaderboardPoints}>{user.points} pts</span>
            </div>
          ))}
          <div className={`${styles.leaderboardItem} ${styles.currentUser}`}>
            <span className={styles.rank}>#{userStats.rank}</span>
            <div className={styles.leaderboardAvatar}>H</div>
            <span className={styles.leaderboardName}>You</span>
            <span className={styles.leaderboardPoints}>{userStats.totalPoints} pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}

