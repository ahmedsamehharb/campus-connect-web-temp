'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Sparkles, AlertCircle } from 'lucide-react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, loading: authLoading, user } = useAuth();

  // Check for password reset token in hash and redirect to reset page
  // This must run FIRST before the authenticated user redirect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      // Check if this is a password reset link (has recovery token in hash)
      if (hash && (hash.includes('type=recovery') || hash.includes('access_token'))) {
        // Redirect to reset password page with the hash
        window.location.href = `/auth/reset-password${hash}`;
        return;
      }
    }
  }, []);

  // Redirect authenticated users to dashboard
  // BUT NOT if they have a password reset token in the URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      // Don't redirect if there's a recovery token (password reset flow)
      if (hash && (hash.includes('type=recovery') || hash.includes('access_token'))) {
        return;
      }
    }
    
    if (!authLoading && user) {
      window.location.href = '/dashboard';
    }
  }, [authLoading, user]);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setAuthError(null);
    
    try {
      if (isLogin) {
        // Sign in with Supabase
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setAuthError(error.message || 'Invalid email or password');
        }
        // signIn handles redirect to /dashboard on success
      } else {
        // Sign up with Supabase
        const { error } = await signUp(formData.email, formData.password, formData.name);
        if (error) {
          setAuthError(error.message || 'Failed to create account');
        } else {
          // Show success message and switch to login
          setAuthError(null);
          setIsLogin(true);
          alert('Account created! Please check your email to confirm, then sign in.');
        }
      }
    } catch (err) {
      setAuthError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (authError) {
      setAuthError(null);
    }
  };

  return (
    <PageTransition>
      <div className={styles.container}>
        {/* Background decoration */}
        <div className={styles.bgDecoration}>
          <div className={styles.circle1} />
          <div className={styles.circle2} />
          <div className={styles.circle3} />
        </div>

        <div className={styles.content}>
          {/* Logo & Header */}
          <motion.div 
            className={styles.header}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className={styles.logoContainer}>
              <Sparkles className={styles.logoIcon} />
            </div>
            <h1 className={styles.title}>Campus Connect</h1>
            <p className={styles.subtitle}>
              {isLogin 
                ? 'Welcome back! Sign in to continue' 
                : 'Join your campus community today'}
            </p>
          </motion.div>

          {/* Auth Error Message */}
          <AnimatePresence>
            {authError && (
              <motion.div
                className={styles.errorBanner}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AlertCircle size={18} />
                <span>{authError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Auth Form */}
          <motion.form 
            className={styles.form}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    name="name"
                    type="text"
                    label="Full Name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={errors.name}
                    icon={<User size={18} />}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              icon={<Mail size={18} />}
            />

            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              icon={<Lock size={18} />}
            />

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="confirmPassword"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={errors.confirmPassword}
                    icon={<Lock size={18} />}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {isLogin && (
              <button type="button" className={styles.forgotPassword}>
                Forgot password?
              </button>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </motion.form>

          {/* Toggle Auth Mode */}
          <motion.div 
            className={styles.toggleContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className={styles.toggleText}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <button
              type="button"
              className={styles.toggleButton}
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setAuthError(null);
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
