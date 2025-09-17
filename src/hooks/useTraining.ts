import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TrainingStats {
  completedTrainings: number;
  pendingTrainings: number;
  totalTrainings: number;
  completionRate: number;
}

export const useTraining = () => {
  const [stats, setStats] = useState<TrainingStats>({
    completedTrainings: 0,
    pendingTrainings: 0,
    totalTrainings: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchTrainingStats = async () => {
    try {
      // Since training table might not exist yet, we'll simulate data
      // In a real implementation, you would query the training/courses table
      
      // Simulate data for now
      const completed = 25;
      const pending = 8;
      const total = completed + pending;
      const rate = total > 0 ? (completed / total) * 100 : 0;

      setStats({
        completedTrainings: completed,
        pendingTrainings: pending,
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
  }, []);

  return {
    stats,
    loading,
    refetch: fetchTrainingStats
  };
};