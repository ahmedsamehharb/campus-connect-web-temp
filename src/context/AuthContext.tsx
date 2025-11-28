'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, auth, api, Profile } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await api.getProfile(userId);
      if (error) {
        console.warn('Profile fetch error (this is normal for new users):', error.message);
      }
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session with timeout
    const initAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Add a timeout to prevent infinite loading (5 seconds)
        const timeoutPromise = new Promise<null>((resolve) => 
          setTimeout(() => {
            console.log('Auth timeout - proceeding without session');
            resolve(null);
          }, 5000)
        );
        
        const sessionPromise = auth.getSession();
        
        const session = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (!mounted) return;
        
        console.log('Session retrieved:', session ? 'exists' : 'null');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Don't wait for profile - fetch in background
          fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          console.log('Auth initialized, loading set to false');
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, session ? 'has session' : 'no session');
      
      // Check if we're in password reset mode - don't set user if we are
      const isPasswordReset = typeof window !== 'undefined' && (
        sessionStorage.getItem('isPasswordReset') === 'true' ||
        window.location.pathname === '/auth/reset-password' ||
        (window.location.hash && (window.location.hash.includes('type=recovery') || window.location.hash.includes('access_token')))
      );
      
      // If this is a password recovery event, set the flag
      if (event === 'PASSWORD_RECOVERY' || (session && isPasswordReset)) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('isPasswordReset', 'true');
        }
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        // Don't wait for profile - fetch in background
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - only run once on mount

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Signing up...');
      const { data, error } = await auth.signUp(email, password, name);
      console.log('SignUp result:', error ? error.message : 'success');
      return { error };
    } catch (error: any) {
      console.error('SignUp error:', error);
      return { error: { message: 'Network error. Please try again.' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in...');
      const { data, error } = await auth.signIn(email, password);
      console.log('SignIn result:', error ? error.message : 'success');
      
      if (!error && data?.session) {
        console.log('Sign in successful, redirecting to dashboard...');
        // Use window.location for more reliable navigation
        window.location.href = '/dashboard';
      }
      return { error };
    } catch (error: any) {
      console.error('SignIn error:', error);
      return { error: { message: 'Network error. Please try again.' } };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      const { error } = await auth.signOut();
      
      if (error) {
        console.error('SignOut error from Supabase:', error);
      }
      
      // Clear local state regardless of Supabase response
      setUser(null);
      setProfile(null);
      setSession(null);
      
      console.log('Sign out successful, redirecting to home...');
      // Use window.location for a full page reload to clear all state
      window.location.href = '/';
    } catch (error) {
      console.error('SignOut error:', error);
      // Still clear local state and redirect even if there's an error
      setUser(null);
      setProfile(null);
      setSession(null);
      window.location.href = '/';
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

