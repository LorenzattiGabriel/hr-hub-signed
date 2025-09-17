import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TrainingStats {
  completedTrainings: number;
  pendingTrainings: number;
  inProgressTrainings: number;
  totalTrainings: number;
  completionRate: number;
}

export const useTraining = () => {
  const [stats, setStats] = useState<TrainingStats>({
    completedTrainings: 0,
    pendingTrainings: 0,
    inProgressTrainings: 0,
    totalTrainings: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchTrainingStats = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('trainings')
        .select('estado');

      if (error) throw error;

      const completed = (data || []).filter((t: any) => t.estado === 'completado').length;
      const pending = (data || []).filter((t: any) => t.estado === 'pendiente').length;
      const inProgress = (data || []).filter((t: any) => t.estado === 'en_progreso').length;
      const total = (data || []).length;
      const rate = total > 0 ? (completed / total) * 100 : 0;

      setStats({
        completedTrainings: completed,
        pendingTrainings: pending,
        inProgressTrainings: inProgress,
        totalTrainings: total,
        completionRate: Math.round(rate)
      });
    } catch (error) {
      console.error('Error fetching training stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingStats();

    // Set up real-time subscription
    const channel = (supabase as any)
      .channel('training-stats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trainings'
        },
        () => {
          fetchTrainingStats();
        }
      )
      .subscribe();

    return () => {
      (supabase as any).removeChannel(channel);
    };
  }, []);

  return {
    stats,
    loading,
    refetch: fetchTrainingStats
  };
};