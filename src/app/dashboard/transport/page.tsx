'use client';

import { motion } from 'framer-motion';
import {
  Bus,
  Car,
  Clock,
  MapPin,
  Navigation,
  AlertCircle,
  Bike,
  RefreshCw,
} from 'lucide-react';
import { busRoutes, parkingLots } from '@/data';
import styles from './transport.module.css';

export default function TransportPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Transportation</h1>
        <p>Real-time transit & parking info</p>
      </div>

      {/* Bus Routes */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2><Bus size={18} /> Campus Shuttles</h2>
          <button className={styles.refreshBtn}>
            <RefreshCw size={16} /> Live
          </button>
        </div>
        <div className={styles.routeList}>
          {busRoutes.map((route) => (
            <motion.div
              key={route.id}
              className={styles.routeCard}
              whileTap={{ scale: 0.98 }}
            >
              <div className={styles.routeHeader}>
                <div className={styles.routeInfo}>
                  <div 
                    className={styles.routeColor}
                    style={{ background: route.color }}
                  />
                  <div>
                    <h3>{route.name}</h3>
                    <span className={styles.routeFrequency}>Every {route.frequency} min</span>
                  </div>
                </div>
                <div className={`${styles.statusBadge} ${styles[route.status.replace('-', '')]}`}>
                  {route.status === 'delayed' && <AlertCircle size={12} />}
                  {route.status}
                </div>
              </div>

              <div className={styles.arrivalInfo}>
                <div className={styles.nextArrival}>
                  <Clock size={16} />
                  <span className={styles.arrivalTime}>{route.nextArrival}</span>
                  <span className={styles.arrivalLabel}>next arrival</span>
                </div>
                {route.delay && (
                  <span className={styles.delayInfo}>+{route.delay} min delay</span>
                )}
              </div>

              {route.currentLocation && (
                <div className={styles.currentLocation}>
                  <Navigation size={14} />
                  <span>Currently at: {route.currentLocation}</span>
                </div>
              )}

              <div className={styles.stopsPreview}>
                {route.stops.slice(0, 4).map((stop, index) => (
                  <div key={index} className={styles.stopDot}>
                    <div 
                      className={styles.dot}
                      style={{ 
                        background: route.currentLocation === stop.name 
                          ? route.color 
                          : 'var(--color-surface-elevated)' 
                      }}
                    />
                    <span>{stop.name}</span>
                  </div>
                ))}
                {route.stops.length > 4 && (
                  <span className={styles.moreStops}>+{route.stops.length - 4} more</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Parking */}
      <div className={styles.section}>
        <h2><Car size={18} /> Parking Availability</h2>
        <div className={styles.parkingGrid}>
          {parkingLots.map((lot) => {
            const percentFull = ((lot.totalSpots - lot.availableSpots) / lot.totalSpots) * 100;
            const isFull = lot.availableSpots < 10;
            
            return (
              <motion.div
                key={lot.id}
                className={`${styles.parkingCard} ${isFull ? styles.almostFull : ''}`}
                whileTap={{ scale: 0.98 }}
              >
                <div className={styles.parkingHeader}>
                  <h3>{lot.name}</h3>
                  <span className={`${styles.typeBadge} ${styles[lot.type]}`}>
                    {lot.type}
                  </span>
                </div>
                
                <div className={styles.spotsInfo}>
                  <span className={`${styles.spotsAvailable} ${isFull ? styles.low : ''}`}>
                    {lot.availableSpots}
                  </span>
                  <span className={styles.spotsLabel}>spots available</span>
                </div>

                <div className={styles.parkingProgress}>
                  <div 
                    className={styles.parkingFill}
                    style={{ 
                      width: `${percentFull}%`,
                      background: isFull 
                        ? 'linear-gradient(90deg, #FF6B6B, #FF8E8E)' 
                        : 'var(--gradient-primary)'
                    }}
                  />
                </div>

                <div className={styles.parkingMeta}>
                  <span><MapPin size={12} /> {lot.distance}</span>
                  <span>{lot.rate}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <h2>Quick Actions</h2>
        <div className={styles.quickActions}>
          <motion.button whileTap={{ scale: 0.95 }} className={styles.quickAction}>
            <Bike size={24} />
            <span>Bike Share</span>
            <span className={styles.actionSubtext}>12 available nearby</span>
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} className={styles.quickAction}>
            <Car size={24} />
            <span>Carpool</span>
            <span className={styles.actionSubtext}>Find a ride</span>
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} className={styles.quickAction}>
            <MapPin size={24} />
            <span>Navigate</span>
            <span className={styles.actionSubtext}>Campus map</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

