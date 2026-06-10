import { useMemo, useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { carbonService, type SimpleAction } from '../services/carbon.service';
import {
  calculateTotalToday,
  calculateTotalSaved,
  calculateWeeklyData,
  calculateCategoryData
} from '../utils/dashboard.utils';

/**
 * Custom hook encapsulating calculations, daily assessments, and handlers for the sustainability dashboard.
 */
export function useDashboardStats() {
  const { user, activities, logout, addActivity } = useAppContext();
  const [activeLoggingId, setActiveLoggingId] = useState<string | null>(null);

  // Filter actions based on the user's selected onboarding goals
  const actions = useMemo(() => {
    return carbonService.getActionsForGoals(user?.goals || []);
  }, [user?.goals]);

  // Aggregate stats using isolated, testable utility helpers
  const totalToday = useMemo(() => calculateTotalToday(activities), [activities]);
  const totalSaved = useMemo(() => calculateTotalSaved(activities), [activities]);
  const weeklyData = useMemo(() => calculateWeeklyData(activities), [activities]);
  const categoryData = useMemo(() => calculateCategoryData(activities), [activities]);

  // Daily eco-standing classification
  const assessment = useMemo(() => {
    return carbonService.getDailyAssessment(totalToday);
  }, [totalToday]);

  // Callback to log a habit reduction action
  const handleLogReduction = useCallback(async (action: SimpleAction) => {
    if (activeLoggingId) return;
    setActiveLoggingId(action.id);
    try {
      await addActivity({
        description: `${action.name}`,
        category: action.category,
        carbonAmount: action.reductionAmount,
        aiInsight: `Excellent choice! You saved ${action.reductionAmount} kg CO₂e by taking this action.`,
        isReduction: true
      });
    } finally {
      setActiveLoggingId(null);
    }
  }, [activeLoggingId, addActivity]);

  return {
    user,
    activities,
    logout,
    actions,
    totalToday,
    totalSaved,
    weeklyData,
    categoryData,
    assessment,
    activeLoggingId,
    handleLogReduction
  };
}
