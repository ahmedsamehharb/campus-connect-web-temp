'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Loader2 } from 'lucide-react';
import { useFAQs } from '@/hooks/useSupabase';
import { FAQ } from '@/lib/supabase';
import { StaggerContainer, StaggerItem } from '@/components/PageTransition';
import styles from './FAQTab.module.css';

const categoryIcons: Record<string, string> = {
  academic: '📚',
  campus: '🏫',
  housing: '🏠',
  financial: '💰',
  technology: '💻',
  general: '📋',
};

export default function FAQTab() {
  const { data: faqs, loading, error } = useFAQs();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredFAQs = (faqs || []).filter(
    (faq: FAQ) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} size={32} />
        <p>Loading FAQs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Failed to load FAQs</p>
        <p className={styles.errorHint}>Please check your connection and try again</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>FAQ</h2>
        <p className={styles.subtitle}>Find answers to common questions</p>
      </div>

      {/* Search */}
      <div className={styles.searchContainer}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* FAQ List */}
      <StaggerContainer className={styles.faqList}>
        {filteredFAQs.map((faq: FAQ) => (
          <StaggerItem key={faq.id}>
            <motion.div
              className={`${styles.faqCard} ${expandedId === faq.id ? styles.expanded : ''}`}
            >
              <motion.button
                whileTap={{ scale: 0.99 }}
                className={styles.questionButton}
                onClick={() => toggleExpand(faq.id)}
              >
                <span className={styles.categoryIcon}>
                  {categoryIcons[faq.category] || '📋'}
                </span>
                <span className={styles.question}>{faq.question}</span>
                <motion.div
                  animate={{ rotate: expandedId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={styles.chevronContainer}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {expandedId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className={styles.answerContainer}
                  >
                    <div className={styles.answer}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {filteredFAQs.length === 0 && (
        <div className={styles.noResults}>
          <p>No matching questions found.</p>
          <p className={styles.noResultsHint}>Try a different search term</p>
        </div>
      )}
    </div>
  );
}
