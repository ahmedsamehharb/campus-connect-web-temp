'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './callback.module.css';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from URL (Supabase PKCE flow)
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        const type = searchParams.get('type'); // email_confirmation, recovery, etc.

        console.log('Auth callback params:', { code: !!code, error, errorDescription, type });
        console.log('Full URL:', window.location.href);

        if (error) {
          setStatus('error');
          setMessage(errorDescription || 'An error occurred during verification');
          return;
        }

        if (code) {
          // Exchange the code for a session
          console.log('Exchanging code for session...');
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          console.log('Exchange result:', { 
            hasData: !!data, 
            hasSession: !!data?.session,
            error: exchangeError?.message 
          });
          
          if (exchangeError) {
            // Check if it's an expired or already used code
            if (exchangeError.message.includes('expired') || exchangeError.message.includes('invalid')) {
              setStatus('error');
              setMessage('This verification link has expired or already been used. Please try logging in or request a new link.');
            } else {
              setStatus('error');
              setMessage(exchangeError.message || 'Failed to verify email');
            }
            return;
          }

          if (data?.session) {
            setStatus('success');
            setMessage('Email verified successfully! Redirecting...');
            
            // Redirect to dashboard
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1500);
          } else {
            // Session exchange succeeded but no session returned - try getting current session
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              setStatus('success');
              setMessage('Email verified successfully! Redirecting...');
              setTimeout(() => {
                window.location.href = '/dashboard';
              }, 1500);
            } else {
              setStatus('error');
              setMessage('Verification completed but session not created. Please try logging in.');
            }
          }
        } else {
          // No code present, check for hash-based tokens (older flow)
          const hash = window.location.hash;
          console.log('No code, checking hash:', hash ? 'has hash' : 'no hash');
          
          if (hash && hash.includes('access_token')) {
            // Handle hash-based auth (magic link, OAuth)
            const { data, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
              setStatus('error');
              setMessage(sessionError.message || 'Failed to verify session');
              return;
            }
            
            if (data.session) {
              setStatus('success');
              setMessage('Email verified successfully! Redirecting...');
              setTimeout(() => {
                window.location.href = '/dashboard';
              }, 1500);
              return;
            }
          }
          
          // Check if user is already authenticated
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            setStatus('success');
            setMessage('Already authenticated! Redirecting...');
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1500);
          } else {
            setStatus('error');
            setMessage('Invalid or expired verification link. Please try logging in or request a new verification email.');
          }
        }
      } catch (err: any) {
        console.error('Callback error:', err);
        setStatus('error');
        setMessage(err.message || 'An unexpected error occurred');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className={styles.card}>
      {status === 'loading' && (
        <>
          <div className={styles.spinner} />
          <h1 className={styles.title}>Verifying</h1>
          <p className={styles.message}>{message}</p>
        </>
      )}
      
      {status === 'success' && (
        <>
          <div className={styles.iconSuccess}>✓</div>
          <h1 className={styles.title}>Success!</h1>
          <p className={styles.message}>{message}</p>
        </>
      )}
      
      {status === 'error' && (
        <>
          <div className={styles.iconError}>✕</div>
          <h1 className={styles.title}>Verification Failed</h1>
          <p className={styles.message}>{message}</p>
          <button 
            className={styles.button}
            onClick={() => router.push('/')}
          >
            Return to Login
          </button>
        </>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className={styles.card}>
      <div className={styles.spinner} />
      <h1 className={styles.title}>Loading</h1>
      <p className={styles.message}>Please wait...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className={styles.container}>
      <Suspense fallback={<LoadingFallback />}>
        <CallbackContent />
      </Suspense>
    </div>
  );
}
