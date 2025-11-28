'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Coffee,
  BookOpen,
  Car,
  Ticket,
  Printer,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  Receipt,
} from 'lucide-react';
import { transactions, financialSummary } from '@/data';
import styles from './financial.module.css';

type Tab = 'wallet' | 'transactions' | 'tuition';

const iconMap: Record<string, any> = {
  tuition: BookOpen,
  dining: Coffee,
  parking: Car,
  bookstore: BookOpen,
  event: Ticket,
  printing: Printer,
  refund: ArrowDownLeft,
  scholarship: PiggyBank,
};

export default function FinancialPage() {
  const [activeTab, setActiveTab] = useState<Tab>('wallet');

  const totalBalance = financialSummary.campusCardBalance + financialSummary.mealPlanBalance;
  
  const income = transactions
    .filter(t => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Wallet & Payments</h1>
        <p>Manage your campus finances</p>
      </div>

      {/* Balance Card */}
      <motion.div 
        className={styles.balanceCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.balanceHeader}>
          <span>Total Balance</span>
          <Wallet size={24} />
        </div>
        <div className={styles.balanceAmount}>
          ${totalBalance.toFixed(2)}
        </div>
        <div className={styles.balanceActions}>
          <motion.button whileTap={{ scale: 0.95 }} className={styles.actionBtn}>
            <Plus size={18} />
            Add Funds
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} className={styles.actionBtn}>
            <CreditCard size={18} />
            Pay
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(76, 175, 80, 0.15)' }}>
            <TrendingUp size={20} color="#4CAF50" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>+${income.toFixed(0)}</span>
            <span className={styles.statLabel}>Income</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(255, 107, 107, 0.15)' }}>
            <TrendingDown size={20} color="#FF6B6B" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>-${expenses.toFixed(0)}</span>
            <span className={styles.statLabel}>Expenses</span>
          </div>
        </div>
      </div>

      {/* Balance Breakdown */}
      <div className={styles.section}>
        <h2>Balance Breakdown</h2>
        <div className={styles.breakdownList}>
          <div className={styles.breakdownItem}>
            <div className={styles.breakdownLeft}>
              <Coffee size={20} />
              <span>Meal Plan</span>
            </div>
            <span className={styles.breakdownValue}>${financialSummary.mealPlanBalance.toFixed(2)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <div className={styles.breakdownLeft}>
              <CreditCard size={20} />
              <span>Campus Card</span>
            </div>
            <span className={styles.breakdownValue}>${financialSummary.campusCardBalance.toFixed(2)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <div className={styles.breakdownLeft}>
              <Printer size={20} />
              <span>Print Credits</span>
            </div>
            <span className={styles.breakdownValue}>${financialSummary.printingCredits.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Tuition Status */}
      <div className={styles.section}>
        <h2>Tuition Status</h2>
        <div className={styles.tuitionCard}>
          <div className={styles.tuitionHeader}>
            <span>Outstanding Balance</span>
            <span className={styles.tuitionDue}>Due: {financialSummary.tuitionDue}</span>
          </div>
          <div className={styles.tuitionAmount}>${financialSummary.tuitionBalance.toFixed(2)}</div>
          <div className={styles.tuitionMeta}>
            <span>Scholarships: ${financialSummary.scholarships.toLocaleString()}</span>
            <span>Aid: ${financialSummary.financialAid.toLocaleString()}</span>
          </div>
          <motion.button whileTap={{ scale: 0.98 }} className={styles.payBtn}>
            Pay Now
          </motion.button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Recent Transactions</h2>
          <button>View All</button>
        </div>
        <div className={styles.transactionList}>
          {transactions.slice(0, 6).map(transaction => {
            const Icon = iconMap[transaction.type] || Receipt;
            const isPositive = transaction.amount > 0;
            
            return (
              <motion.div
                key={transaction.id}
                className={styles.transactionCard}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`${styles.transactionIcon} ${isPositive ? styles.positive : styles.negative}`}>
                  <Icon size={18} />
                </div>
                <div className={styles.transactionInfo}>
                  <span className={styles.transactionTitle}>{transaction.description}</span>
                  <span className={styles.transactionDate}>{transaction.date}</span>
                </div>
                <span className={`${styles.transactionAmount} ${isPositive ? styles.positive : styles.negative}`}>
                  {isPositive ? '+' : ''}{transaction.amount.toFixed(2)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Budget Tracker */}
      <div className={styles.section}>
        <h2>Monthly Budget</h2>
        <div className={styles.budgetCard}>
          <div className={styles.budgetHeader}>
            <span>${financialSummary.monthlySpent.toFixed(0)} spent</span>
            <span>of ${financialSummary.monthlyBudget}</span>
          </div>
          <div className={styles.budgetBar}>
            <div 
              className={styles.budgetFill}
              style={{ 
                width: `${(financialSummary.monthlySpent / financialSummary.monthlyBudget) * 100}%`,
                background: financialSummary.monthlySpent > financialSummary.monthlyBudget * 0.8 
                  ? 'linear-gradient(90deg, #FF6B6B, #FF8E8E)' 
                  : 'var(--gradient-primary)'
              }}
            />
          </div>
          <span className={styles.budgetRemaining}>
            ${(financialSummary.monthlyBudget - financialSummary.monthlySpent).toFixed(0)} remaining this month
          </span>
        </div>
      </div>
    </div>
  );
}

