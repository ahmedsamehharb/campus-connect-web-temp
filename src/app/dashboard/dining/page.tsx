'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Users,
  Star,
  Leaf,
  AlertTriangle,
  ChevronRight,
  Coffee,
  UtensilsCrossed,
} from 'lucide-react';
import { diningLocations, financialSummary } from '@/data';
import styles from './dining.module.css';

export default function DiningPage() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#FF6B6B';
      default: return '#666';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Campus Dining</h1>
        <p>Find food and check wait times</p>
      </div>

      {/* Meal Plan Balance */}
      <motion.div 
        className={styles.balanceCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.balanceInfo}>
          <Coffee size={24} />
          <div>
            <span className={styles.balanceLabel}>Meal Plan Balance</span>
            <span className={styles.balanceValue}>${financialSummary.mealPlanBalance.toFixed(2)}</span>
          </div>
        </div>
        <div className={styles.balanceProgress}>
          <div 
            className={styles.balanceFill}
            style={{ width: `${(financialSummary.mealPlanBalance / 1000) * 100}%` }}
          />
        </div>
      </motion.div>

      {/* Dining Locations */}
      <div className={styles.section}>
        <h2>Dining Locations</h2>
        <div className={styles.locationList}>
          {diningLocations.map((location) => (
            <motion.div
              key={location.id}
              className={`${styles.locationCard} ${selectedLocation === location.id ? styles.selected : ''}`}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedLocation(selectedLocation === location.id ? null : location.id)}
            >
              <div className={styles.locationHeader}>
                <div className={styles.locationInfo}>
                  <h3>{location.name}</h3>
                  <span className={styles.locationHours}>
                    <Clock size={12} /> {location.hours}
                  </span>
                </div>
                <div className={styles.crowdIndicator} style={{ background: `${getCrowdColor(location.crowdLevel)}20`, color: getCrowdColor(location.crowdLevel) }}>
                  <Users size={14} />
                  <span>{location.crowdLevel}</span>
                </div>
              </div>

              <div className={styles.locationMeta}>
                <span className={styles.waitTime}>
                  ~{location.currentWaitTime} min wait
                </span>
                {location.acceptsMealPlan && (
                  <span className={styles.mealPlanBadge}>Meal Plan</span>
                )}
              </div>

              {/* Menu Items */}
              {selectedLocation === location.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={styles.menuSection}
                >
                  <h4>Today&apos;s Menu</h4>
                  <div className={styles.menuList}>
                    {location.menu.map((item) => (
                      <div key={item.id} className={styles.menuItem}>
                        <div className={styles.menuItemInfo}>
                          <div className={styles.menuItemHeader}>
                            <span className={styles.menuItemName}>{item.name}</span>
                            <span className={styles.menuItemPrice}>${item.price.toFixed(2)}</span>
                          </div>
                          <p className={styles.menuItemDesc}>{item.description}</p>
                          <div className={styles.menuItemMeta}>
                            <span>{item.calories} cal</span>
                            <span className={styles.rating}>
                              <Star size={12} /> {item.rating}
                            </span>
                            {item.sustainable && (
                              <span className={styles.sustainable}>
                                <Leaf size={12} /> Eco
                              </span>
                            )}
                          </div>
                          {item.allergens.length > 0 && (
                            <div className={styles.allergens}>
                              <AlertTriangle size={12} />
                              {item.allergens.join(', ')}
                            </div>
                          )}
                          <div className={styles.dietary}>
                            {item.dietary.map((d) => (
                              <span key={d} className={styles.dietaryBadge}>{d}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <ChevronRight 
                className={`${styles.chevron} ${selectedLocation === location.id ? styles.rotated : ''}`} 
                size={18} 
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Peak Hours */}
      <div className={styles.section}>
        <h2>Peak Hours Today</h2>
        <div className={styles.peakHours}>
          <div className={styles.peakChart}>
            {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((hour) => {
              const isBusy = hour >= 11 && hour <= 13 || hour >= 17 && hour <= 19;
              const isPeak = hour === 12 || hour === 18;
              return (
                <div key={hour} className={styles.peakBar}>
                  <div 
                    className={styles.peakFill}
                    style={{ 
                      height: isPeak ? '100%' : isBusy ? '70%' : '30%',
                      background: isPeak ? 'var(--color-accent)' : isBusy ? 'var(--color-primary)' : 'var(--color-surface-elevated)'
                    }}
                  />
                  <span>{hour > 12 ? hour - 12 : hour}{hour >= 12 ? 'p' : 'a'}</span>
                </div>
              );
            })}
          </div>
          <div className={styles.peakLegend}>
            <span><span className={styles.legendDot} style={{ background: 'var(--color-accent)' }} /> Peak</span>
            <span><span className={styles.legendDot} style={{ background: 'var(--color-primary)' }} /> Busy</span>
            <span><span className={styles.legendDot} style={{ background: 'var(--color-surface-elevated)' }} /> Quiet</span>
          </div>
        </div>
      </div>
    </div>
  );
}

