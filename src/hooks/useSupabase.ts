'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

// Generic hook for fetching data
export function useQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const refetch = async () => {
    setLoading(true);
    const { data, error } = await queryFn();
    setData(data);
    setError(error);
    setLoading(false);
  };

  useEffect(() => {
    refetch();
  }, deps);

  return { data, loading, error, refetch };
}

// Specific hooks for each data type
export function useProfile() {
  const { user } = useAuth();
  return useQuery(
    () => api.getProfile(user?.id || ''),
    [user?.id]
  );
}

export function useCourses() {
  return useQuery(() => api.getCourses(), []);
}

export function useEnrollments() {
  const { user } = useAuth();
  return useQuery(
    () => api.getEnrollments(user?.id || ''),
    [user?.id]
  );
}

export function useAssignments() {
  const { user } = useAuth();
  return useQuery(
    () => api.getAssignments(user?.id || ''),
    [user?.id]
  );
}

export function useEvents() {
  const { user } = useAuth();
  return useQuery(
    () => api.getEvents(user?.id),
    [user?.id]
  );
}

export function useEvent(eventId: string) {
  const { user } = useAuth();
  return useQuery(
    () => api.getEventById(eventId, user?.id),
    [eventId, user?.id]
  );
}

export function usePosts() {
  const { user } = useAuth();
  return useQuery(
    () => api.getPosts(user?.id),
    [user?.id]
  );
}

export function useFAQs() {
  return useQuery(() => api.getFAQs(), []);
}

export function useFinancialSummary() {
  const { user } = useAuth();
  return useQuery(
    () => api.getFinancialSummary(user?.id || ''),
    [user?.id]
  );
}

export function useTransactions(limit = 20) {
  const { user } = useAuth();
  return useQuery(
    () => api.getTransactions(user?.id || '', limit),
    [user?.id, limit]
  );
}

export function useStudyRooms() {
  return useQuery(() => api.getStudyRooms(), []);
}

export function useJobs() {
  const { user } = useAuth();
  return useQuery(
    () => api.getJobs(user?.id),
    [user?.id]
  );
}

export function useNotifications() {
  const { user } = useAuth();
  return useQuery(
    () => api.getNotifications(user?.id || ''),
    [user?.id]
  );
}

export function useUserStats() {
  const { user } = useAuth();
  return useQuery(
    () => api.getUserStats(user?.id || ''),
    [user?.id]
  );
}

export function useAchievements() {
  const { user } = useAuth();
  return useQuery(
    () => api.getAchievements(user?.id || ''),
    [user?.id]
  );
}

export function useWellnessData(days = 7) {
  const { user } = useAuth();
  const [data, setData] = useState<{ moods: any[]; sleep: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (user?.id) {
        const result = await api.getWellnessData(user.id, days);
        setData({
          moods: result.moods || [],
          sleep: result.sleep || []
        });
      }
      setLoading(false);
    };
    fetch();
  }, [user?.id, days]);

  return { data, loading };
}

// Mutation hooks
export function useMutation<T, Args extends any[]>(
  mutationFn: (...args: Args) => Promise<{ data?: T; error: any }>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutate = async (...args: Args) => {
    setLoading(true);
    setError(null);
    const { data, error } = await mutationFn(...args);
    setLoading(false);
    if (error) {
      setError(error);
      return { success: false, error };
    }
    return { success: true, data };
  };

  return { mutate, loading, error };
}

