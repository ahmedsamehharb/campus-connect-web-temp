'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Filter,
  Building,
  GraduationCap,
} from 'lucide-react';
import { jobs } from '@/data';
import styles from './career.module.css';

type JobFilter = 'all' | 'internship' | 'part-time' | 'campus' | 'research';

export default function CareerPage() {
  const [filter, setFilter] = useState<JobFilter>('all');
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set(jobs.filter(j => j.saved).map(j => j.id)));

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(j => j.type === filter);

  const toggleSave = (jobId: string) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const getDaysLeft = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Career & Jobs</h1>
        <p>Find opportunities that match your skills</p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <Briefcase size={20} />
          <span className={styles.statValue}>{jobs.length}</span>
          <span className={styles.statLabel}>Open Positions</span>
        </div>
        <div className={styles.statCard}>
          <BookmarkCheck size={20} />
          <span className={styles.statValue}>{savedJobs.size}</span>
          <span className={styles.statLabel}>Saved Jobs</span>
        </div>
        <div className={styles.statCard}>
          <GraduationCap size={20} />
          <span className={styles.statValue}>{jobs.filter(j => j.applied).length}</span>
          <span className={styles.statLabel}>Applied</span>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {(['all', 'internship', 'part-time', 'campus', 'research'] as JobFilter[]).map(f => (
          <motion.button
            key={f}
            whileTap={{ scale: 0.95 }}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Job List */}
      <div className={styles.jobList}>
        {filteredJobs.map((job) => {
          const daysLeft = getDaysLeft(job.deadline);
          const isUrgent = daysLeft <= 7;
          const isSaved = savedJobs.has(job.id);
          
          return (
            <motion.div
              key={job.id}
              className={styles.jobCard}
              whileTap={{ scale: 0.98 }}
            >
              <div className={styles.jobHeader}>
                <div className={styles.companyLogo}>
                  <Building size={20} />
                </div>
                <div className={styles.jobTitleSection}>
                  <h3>{job.title}</h3>
                  <span className={styles.company}>{job.company}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className={`${styles.saveBtn} ${isSaved ? styles.saved : ''}`}
                  onClick={(e) => { e.stopPropagation(); toggleSave(job.id); }}
                >
                  {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                </motion.button>
              </div>

              <div className={styles.jobMeta}>
                <span><MapPin size={14} /> {job.location}</span>
                <span><Briefcase size={14} /> {job.type}</span>
                {job.salary && <span><DollarSign size={14} /> {job.salary}</span>}
              </div>

              <p className={styles.jobDesc}>{job.description}</p>

              <div className={styles.requirements}>
                {job.requirements.slice(0, 2).map((req, i) => (
                  <span key={i} className={styles.reqTag}>{req}</span>
                ))}
                {job.requirements.length > 2 && (
                  <span className={styles.moreReqs}>+{job.requirements.length - 2}</span>
                )}
              </div>

              <div className={styles.jobFooter}>
                <span className={`${styles.deadline} ${isUrgent ? styles.urgent : ''}`}>
                  <Clock size={14} />
                  {daysLeft} days left to apply
                </span>
                {job.applied ? (
                  <span className={styles.appliedBadge}>Applied ✓</span>
                ) : (
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className={styles.applyBtn}
                  >
                    Apply <ExternalLink size={14} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Career Resources */}
      <div className={styles.section}>
        <h2>Career Resources</h2>
        <div className={styles.resourceGrid}>
          <motion.div whileTap={{ scale: 0.98 }} className={styles.resourceCard}>
            <span className={styles.resourceIcon}>📝</span>
            <span>Resume Builder</span>
          </motion.div>
          <motion.div whileTap={{ scale: 0.98 }} className={styles.resourceCard}>
            <span className={styles.resourceIcon}>🎯</span>
            <span>Mock Interviews</span>
          </motion.div>
          <motion.div whileTap={{ scale: 0.98 }} className={styles.resourceCard}>
            <span className={styles.resourceIcon}>👥</span>
            <span>Mentorship</span>
          </motion.div>
          <motion.div whileTap={{ scale: 0.98 }} className={styles.resourceCard}>
            <span className={styles.resourceIcon}>📅</span>
            <span>Career Events</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

