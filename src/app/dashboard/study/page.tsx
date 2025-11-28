'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  Volume2,
  VolumeX,
  Wifi,
  Monitor,
  Clock,
  MapPin,
  Check,
  Calendar,
} from 'lucide-react';
import { studyRooms } from '@/data';
import styles from './study.module.css';

const noiseIcons: Record<string, any> = {
  silent: VolumeX,
  quiet: Volume2,
  moderate: Volume2,
  collaborative: Users,
};

const noiseColors: Record<string, string> = {
  silent: '#4CAF50',
  quiet: '#8BC34A',
  moderate: '#FF9800',
  collaborative: '#2196F3',
};

export default function StudyPage() {
  const [filter, setFilter] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const filteredRooms = filter === 'all' 
    ? studyRooms 
    : filter === 'available'
    ? studyRooms.filter(r => r.available)
    : studyRooms.filter(r => r.noiseLevel === filter);

  const availableCount = studyRooms.filter(r => r.available).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Study Spaces</h1>
        <p>{availableCount} rooms available now</p>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {['all', 'available', 'silent', 'quiet', 'collaborative'].map((f) => (
          <motion.button
            key={f}
            whileTap={{ scale: 0.95 }}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Room List */}
      <div className={styles.roomList}>
        {filteredRooms.map((room) => {
          const NoiseIcon = noiseIcons[room.noiseLevel];
          const occupancyPercent = (room.currentOccupancy / room.capacity) * 100;
          
          return (
            <motion.div
              key={room.id}
              className={`${styles.roomCard} ${!room.available ? styles.unavailable : ''} ${selectedRoom === room.id ? styles.selected : ''}`}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
            >
              <div className={styles.roomHeader}>
                <div className={styles.roomInfo}>
                  <h3>{room.name}</h3>
                  <span className={styles.roomLocation}>
                    <MapPin size={12} /> {room.building}, Floor {room.floor}
                  </span>
                </div>
                <div 
                  className={styles.noiseBadge}
                  style={{ 
                    background: `${noiseColors[room.noiseLevel]}20`,
                    color: noiseColors[room.noiseLevel]
                  }}
                >
                  <NoiseIcon size={14} />
                  <span>{room.noiseLevel}</span>
                </div>
              </div>

              <div className={styles.roomStats}>
                <div className={styles.statItem}>
                  <Users size={16} />
                  <span>{room.currentOccupancy}/{room.capacity}</span>
                </div>
                <div className={styles.occupancyBar}>
                  <div 
                    className={styles.occupancyFill}
                    style={{ 
                      width: `${occupancyPercent}%`,
                      background: occupancyPercent > 80 ? '#FF6B6B' : 'var(--gradient-primary)'
                    }}
                  />
                </div>
              </div>

              {!room.available && room.nextAvailable && (
                <div className={styles.nextAvailable}>
                  <Clock size={14} />
                  <span>Available at {room.nextAvailable}</span>
                </div>
              )}

              {/* Equipment & Amenities */}
              {selectedRoom === room.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={styles.roomDetails}
                >
                  {room.equipment.length > 0 && (
                    <div className={styles.detailSection}>
                      <span className={styles.detailLabel}>Equipment</span>
                      <div className={styles.tags}>
                        {room.equipment.map((eq) => (
                          <span key={eq} className={styles.tag}>
                            <Monitor size={12} /> {eq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className={styles.detailSection}>
                    <span className={styles.detailLabel}>Amenities</span>
                    <div className={styles.tags}>
                      {room.amenities.map((am) => (
                        <span key={am} className={styles.tag}>
                          {am === 'wifi' ? <Wifi size={12} /> : <Check size={12} />}
                          {am}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {room.available && (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className={styles.bookBtn}
                    >
                      <Calendar size={18} />
                      Book This Room
                    </motion.button>
                  )}
                </motion.div>
              )}

              {room.available && (
                <span className={styles.availableBadge}>
                  <Check size={14} /> Available
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Library Seats Info */}
      <div className={styles.section}>
        <h2>Library Overview</h2>
        <div className={styles.libraryStats}>
          <div className={styles.libraryStat}>
            <span className={styles.libraryValue}>142</span>
            <span className={styles.libraryLabel}>Open Seats</span>
          </div>
          <div className={styles.libraryStat}>
            <span className={styles.libraryValue}>Low</span>
            <span className={styles.libraryLabel}>Noise Level</span>
          </div>
          <div className={styles.libraryStat}>
            <span className={styles.libraryValue}>Good</span>
            <span className={styles.libraryLabel}>Air Quality</span>
          </div>
        </div>
      </div>
    </div>
  );
}

