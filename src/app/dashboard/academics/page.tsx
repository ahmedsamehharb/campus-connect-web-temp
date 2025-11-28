'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  BookOpen,
  Calendar,
  Clock,
  Award,
  Target,
  ChevronRight,
  AlertCircle,
  Star,
} from 'lucide-react';
import { courses, grades, assignments, currentUser } from '@/data';
import styles from './academics.module.css';

type Tab = 'overview' | 'courses' | 'grades' | 'assignments';

export default function AcademicsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    grades.forEach(g => {
      totalPoints += g.gradePoints * g.credits;
      totalCredits += g.credits;
    });
    return (totalPoints / totalCredits).toFixed(2);
  };

  const semesterGPA = () => {
    const currentSemester = grades.filter(g => g.semester === 'Spring 2024');
    let totalPoints = 0;
    let totalCredits = 0;
    currentSemester.forEach(g => {
      totalPoints += g.gradePoints * g.credits;
      totalCredits += g.credits;
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const enrolledCourses = courses.filter(c => c.status === 'enrolled');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Academics</h1>
        <p>{currentUser.major} • {currentUser.year}</p>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {(['overview', 'courses', 'grades', 'assignments'] as Tab[]).map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.content}
        >
          {/* GPA Cards */}
          <div className={styles.gpaGrid}>
            <div className={styles.gpaCard}>
              <div className={styles.gpaIcon}>
                <TrendingUp size={24} />
              </div>
              <div className={styles.gpaInfo}>
                <span className={styles.gpaValue}>{calculateGPA()}</span>
                <span className={styles.gpaLabel}>Cumulative GPA</span>
              </div>
            </div>
            <div className={styles.gpaCard}>
              <div className={styles.gpaIcon} style={{ background: 'rgba(76, 175, 80, 0.15)' }}>
                <Star size={24} color="#4CAF50" />
              </div>
              <div className={styles.gpaInfo}>
                <span className={styles.gpaValue}>{semesterGPA()}</span>
                <span className={styles.gpaLabel}>Semester GPA</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <BookOpen size={20} />
              <span className={styles.statNum}>{enrolledCourses.length}</span>
              <span className={styles.statText}>Courses</span>
            </div>
            <div className={styles.statItem}>
              <Award size={20} />
              <span className={styles.statNum}>{currentUser.totalCredits}</span>
              <span className={styles.statText}>Credits</span>
            </div>
            <div className={styles.statItem}>
              <Target size={20} />
              <span className={styles.statNum}>{pendingAssignments.length}</span>
              <span className={styles.statText}>Due</span>
            </div>
          </div>

          {/* Current Courses */}
          <div className={styles.section}>
            <h2>Current Courses</h2>
            <div className={styles.courseList}>
              {enrolledCourses.map(course => (
                <motion.div
                  key={course.id}
                  className={styles.courseCard}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/dashboard/academics/course/${course.id}`)}
                >
                  <div className={styles.courseHeader}>
                    <span className={styles.courseCode}>{course.code}</span>
                    <div className={styles.courseDifficulty}>
                      {Array.from({ length: course.difficulty }).map((_, i) => (
                        <span key={i} className={styles.diffDot} />
                      ))}
                    </div>
                  </div>
                  <h3 className={styles.courseName}>{course.name}</h3>
                  <p className={styles.courseProfessor}>{course.professor}</p>
                  <div className={styles.courseMeta}>
                    <span><Clock size={12} /> {course.schedule[0]?.time}</span>
                    <span>{course.credits} credits</span>
                  </div>
                  <ChevronRight className={styles.chevron} size={18} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Degree Progress */}
          <div className={styles.section}>
            <h2>Degree Progress</h2>
            <div className={styles.progressCard}>
              <div className={styles.progressHeader}>
                <span>Bachelor of Science in {currentUser.major}</span>
                <span>{Math.round((currentUser.totalCredits / 120) * 100)}%</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${(currentUser.totalCredits / 120) * 100}%` }}
                />
              </div>
              <div className={styles.progressInfo}>
                <span>{currentUser.totalCredits} / 120 credits completed</span>
                <span>Expected: {currentUser.expectedGraduation}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.content}
        >
          <div className={styles.courseList}>
            {courses.map(course => (
              <motion.div
                key={course.id}
                className={styles.courseCard}
                whileTap={{ scale: 0.98 }}
              >
                <div className={styles.courseHeader}>
                  <span className={styles.courseCode}>{course.code}</span>
                  <span className={`${styles.statusBadge} ${styles[course.status]}`}>
                    {course.status}
                  </span>
                </div>
                <h3 className={styles.courseName}>{course.name}</h3>
                <p className={styles.courseProfessor}>
                  {course.professor} 
                  <span className={styles.rating}>
                    <Star size={12} /> {course.professorRating}
                  </span>
                </p>
                <div className={styles.courseMeta}>
                  <span>{course.credits} credits</span>
                  <span>{course.enrolled}/{course.capacity} enrolled</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Grades Tab */}
      {activeTab === 'grades' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.content}
        >
          <div className={styles.gradesList}>
            {grades.slice().reverse().map((grade, index) => (
              <div key={index} className={styles.gradeCard}>
                <div className={styles.gradeLeft}>
                  <span className={styles.gradeCode}>{grade.courseCode}</span>
                  <span className={styles.gradeName}>{grade.courseName}</span>
                  <span className={styles.gradeSemester}>{grade.semester}</span>
                </div>
                <div className={styles.gradeRight}>
                  <span className={styles.gradeLetter}>{grade.grade}</span>
                  <span className={styles.gradeCredits}>{grade.credits} cr</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.content}
        >
          <div className={styles.assignmentList}>
            {assignments.map(assignment => {
              const dueDate = new Date(assignment.dueDate);
              const today = new Date();
              const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              const isUrgent = daysLeft <= 2;
              
              return (
                <div 
                  key={assignment.id} 
                  className={`${styles.assignmentCard} ${isUrgent ? styles.urgent : ''}`}
                >
                  <div className={styles.assignmentHeader}>
                    <span className={styles.assignmentCourse}>{assignment.courseCode}</span>
                    <span className={`${styles.typeBadge} ${styles[assignment.type]}`}>
                      {assignment.type}
                    </span>
                  </div>
                  <h3 className={styles.assignmentTitle}>{assignment.title}</h3>
                  <p className={styles.assignmentDesc}>{assignment.description}</p>
                  <div className={styles.assignmentMeta}>
                    <span className={isUrgent ? styles.urgentText : ''}>
                      <Calendar size={12} />
                      {daysLeft === 0 ? 'Due today' : daysLeft === 1 ? 'Due tomorrow' : `${daysLeft} days left`}
                    </span>
                    <span><Clock size={12} /> ~{assignment.estimatedTime}h</span>
                    <span>{assignment.weight}% weight</span>
                  </div>
                  {isUrgent && (
                    <div className={styles.urgentBanner}>
                      <AlertCircle size={14} /> Urgent
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

