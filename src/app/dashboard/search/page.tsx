'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  BookOpen,
  User,
  Building,
  Calendar,
  Briefcase,
  HelpCircle,
  Clock,
  X,
  ArrowRight,
} from 'lucide-react';
import { courses, jobs } from '@/data';
import { faqs } from '@/data/faq';
import { events } from '@/data/events';
import styles from './search.module.css';

interface SearchResult {
  id: string;
  type: 'course' | 'event' | 'job' | 'faq' | 'building';
  title: string;
  subtitle: string;
  icon: any;
}

const typeIcons: Record<string, any> = {
  course: BookOpen,
  event: Calendar,
  job: Briefcase,
  faq: HelpCircle,
  building: Building,
};

const recentSearches = ['Machine Learning', 'Career Fair', 'Study Room', 'Tuition'];

const quickLinks = [
  { label: 'Grades', icon: BookOpen, href: '/dashboard/academics' },
  { label: 'Events', icon: Calendar, href: '/dashboard/events' },
  { label: 'Jobs', icon: Briefcase, href: '/dashboard/career' },
  { label: 'FAQ', icon: HelpCircle, href: '/dashboard/faq' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const q = searchQuery.toLowerCase();
      const searchResults: SearchResult[] = [];

      // Search courses
      courses.forEach(course => {
        if (course.name.toLowerCase().includes(q) || course.code.toLowerCase().includes(q)) {
          searchResults.push({
            id: `course-${course.id}`,
            type: 'course',
            title: `${course.code} - ${course.name}`,
            subtitle: `${course.professor} • ${course.credits} credits`,
            icon: BookOpen,
          });
        }
      });

      // Search events
      events.forEach(event => {
        if (event.title.toLowerCase().includes(q)) {
          searchResults.push({
            id: `event-${event.id}`,
            type: 'event',
            title: event.title,
            subtitle: `${event.date} • ${event.location}`,
            icon: Calendar,
          });
        }
      });

      // Search jobs
      jobs.forEach(job => {
        if (job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q)) {
          searchResults.push({
            id: `job-${job.id}`,
            type: 'job',
            title: job.title,
            subtitle: `${job.company} • ${job.type}`,
            icon: Briefcase,
          });
        }
      });

      // Search FAQs
      faqs.forEach(faq => {
        if (faq.question.toLowerCase().includes(q)) {
          searchResults.push({
            id: `faq-${faq.id}`,
            type: 'faq',
            title: faq.question,
            subtitle: faq.category,
            icon: HelpCircle,
          });
        }
      });

      setResults(searchResults.slice(0, 10));
      setIsSearching(false);
    }, 200);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Search</h1>
        <p>Find anything on campus</p>
      </div>

      {/* Search Input */}
      <div className={styles.searchBox}>
        <Search size={20} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search courses, events, jobs, FAQ..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className={styles.searchInput}
          autoFocus
        />
        {query && (
          <button 
            className={styles.clearBtn}
            onClick={() => { setQuery(''); setResults([]); }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Results */}
      {query.length >= 2 && (
        <div className={styles.results}>
          {isSearching ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <span>Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <>
              <span className={styles.resultCount}>{results.length} results</span>
              <div className={styles.resultList}>
                {results.map((result) => {
                  const Icon = result.icon;
                  return (
                    <motion.div
                      key={result.id}
                      className={styles.resultCard}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className={`${styles.resultIcon} ${styles[result.type]}`}>
                        <Icon size={18} />
                      </div>
                      <div className={styles.resultInfo}>
                        <span className={styles.resultTitle}>{result.title}</span>
                        <span className={styles.resultSubtitle}>{result.subtitle}</span>
                      </div>
                      <ArrowRight size={16} className={styles.resultArrow} />
                    </motion.div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className={styles.noResults}>
              <Search size={40} />
              <span>No results found for &quot;{query}&quot;</span>
              <p>Try different keywords or check the spelling</p>
            </div>
          )}
        </div>
      )}

      {/* Empty State - Recent & Quick Links */}
      {query.length < 2 && (
        <>
          {/* Recent Searches */}
          <div className={styles.section}>
            <h2><Clock size={16} /> Recent Searches</h2>
            <div className={styles.recentList}>
              {recentSearches.map((search) => (
                <motion.button
                  key={search}
                  className={styles.recentItem}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSearch(search)}
                >
                  <Clock size={14} />
                  {search}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.section}>
            <h2>Quick Access</h2>
            <div className={styles.quickGrid}>
              {quickLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className={styles.quickLink}
                  whileTap={{ scale: 0.95 }}
                >
                  <link.icon size={24} />
                  <span>{link.label}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Search Tips */}
          <div className={styles.tips}>
            <h3>Search Tips</h3>
            <ul>
              <li>Search for course codes like &quot;CS301&quot;</li>
              <li>Find professors by name</li>
              <li>Look up campus buildings</li>
              <li>Search events and activities</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

