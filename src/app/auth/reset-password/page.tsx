'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase, auth } from '@/lib/supabase';
import Button from '@/components/Button';
import Input from '@/components/Input';
import PageTransition from '@/components/PageTransition';
import styles from './reset-password.module.css';

// Force dynamic rendering to prevent static generation issues during build
export const dynamic = 'force-dynamic';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'form' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying reset link...');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [loading, setLoading] = useState(false);

  // Prevent any redirects while on reset password page
  useEffect(() => {
    // Set flag to prevent dashboard redirects
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('isPasswordReset', 'true');
    }
    
    // Clean up flag when component unmounts (after successful password reset)
    return () => {
      if (typeof window !== 'undefined' && status === 'success') {
        sessionStorage.removeItem('isPasswordReset');
      }
    };
  }, [status]);

  useEffect(() => {
    const verifyResetToken = async () => {
      try {
        // Ensure we're in the browser (not during SSR/build)
        if (typeof window === 'undefined') {
          return;
        }

        // Check if there's a hash in the URL (Supabase sends token in hash)
        const hash = window.location.hash;
        
        // Also check for code in query params (PKCE flow)
        const code = searchParams.get('code');
        const type = searchParams.get('type');

        console.log('Reset password params:', { hasHash: !!hash, code: !!code, type });

        // If there's a code parameter, exchange it for a session
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            setStatus('error');
            if (error.message.includes('expired') || error.message.includes('invalid')) {
              setMessage('This password reset link has expired or is invalid. Please request a new one.');
            } else {
              setMessage(error.message || 'Invalid reset link');
            }
            return;
          }

          if (data?.session) {
            // Token is valid, show password form
            setStatus('form');
            setMessage('');
            return;
          }
        }

        // Check for hash-based token (older flow)
        if (hash && (hash.includes('access_token') || hash.includes('type=recovery'))) {
          // Try to get session from hash
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error || !session) {
            setStatus('error');
            setMessage('Invalid or expired reset link. Please request a new password reset.');
            return;
          }

          // Check if this is a recovery session
          if (session.user) {
            setStatus('form');
            setMessage('');
            return;
          }
        }

        // Check if user already has a valid session
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        if (existingSession) {
          setStatus('form');
          setMessage('');
          return;
        }

        // No valid token found
        setStatus('error');
        setMessage('Invalid or expired reset link. Please request a new password reset email.');
      } catch (err: any) {
        console.error('Reset password verification error:', err);
        setStatus('error');
        // Handle build-time errors gracefully
        if (err.message?.includes('supabaseUrl') || err.message?.includes('required')) {
          setMessage('Configuration error. Please contact support.');
        } else {
          setMessage(err.message || 'An error occurred while verifying the reset link');
        }
      }
    };

    // Only run verification in browser
    if (typeof window !== 'undefined') {
      verifyResetToken();
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { data, error } = await auth.updatePassword(password);

      if (error) {
        setStatus('error');
        if (error.message.includes('expired') || error.message.includes('invalid')) {
          setMessage('This password reset link has expired. Please request a new one.');
        } else {
          setMessage(error.message || 'Failed to update password');
        }
        setLoading(false);
        return;
      }

      if (data?.user) {
        setStatus('success');
        setMessage('Your password has been successfully updated!');
        
        // Clear the password reset flag
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('isPasswordReset');
        }
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Password update error:', err);
      setStatus('error');
      setMessage(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className={styles.card}>
        <div className={styles.spinner} />
        <h1 className={styles.title}>Verifying</h1>
        <p className={styles.message}>{message}</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className={styles.card}>
        <div className={styles.iconSuccess}>
          <CheckCircle2 size={32} />
        </div>
        <h1 className={styles.title}>Password Updated!</h1>
        <p className={styles.message}>{message}</p>
        <p className={styles.redirectMessage}>Redirecting to login...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.card}>
        <div className={styles.iconError}>
          <AlertCircle size={32} />
        </div>
        <h1 className={styles.title}>Reset Failed</h1>
        <p className={styles.message}>{message}</p>
        <Button 
          onClick={() => router.push('/')}
          variant="primary"
          fullWidth
        >
          Return to Login
        </Button>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className={styles.container}>
        <div className={styles.card}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.header}>
              <div className={styles.iconWrapper}>
                <Lock size={32} />
              </div>
              <h1 className={styles.title}>Reset Your Password</h1>
              <p className={styles.subtitle}>Enter your new password below</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputWrapper}>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  label="New Password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  error={errors.password}
                  icon={<Lock size={18} />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.toggleButton}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className={styles.inputWrapper}>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirm Password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  error={errors.confirmPassword}
                  icon={<Lock size={18} />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.toggleButton}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading}
              >
                Update Password
              </Button>
            </form>

            <div className={styles.footer}>
              <button
                type="button"
                onClick={() => router.push('/')}
                className={styles.linkButton}
              >
                Back to Login
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

function LoadingFallback() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.spinner} />
        <h1 className={styles.title}>Loading</h1>
        <p className={styles.message}>Please wait...</p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

