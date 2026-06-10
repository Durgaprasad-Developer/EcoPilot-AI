import { useMemo, useState, useCallback } from 'react';
import { isSameDay, subDays, format } from 'date-fns';
import { useAppContext } from '../context/AppContext';
import { carbonService, type SimpleAction } from '../services/carbon.service';

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

  // Aggregate stats: today's net footprint, cumulative saved, weekly trends, and categories
  const stats = useMemo(() => {
    const today = new Date();
    
    // Net daily carbon amount (adding emissions, subtracting offset reductions)
    const totalToday = activities
      .filter(a => isSameDay(new Date(a.date), today))
      .reduce((sum, a) => sum + (a.isReduction ? -a.carbonAmount : a.carbonAmount), 0);

    // Cumulative carbon saved through reductions
    const totalSaved = activities
      .filter(a => a.isReduction)
      .reduce((sum, a) => sum + a.carbonAmount, 0);

    // Data for the 7-day trend visualization
    const weeklyData = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(today, 6 - i);
      const dayTotal = activities
        .filter(a => isSameDay(new Date(a.date), d))
        .reduce((sum, a) => sum + (a.isReduction ? -a.carbonAmount : a.carbonAmount), 0);
      return {
        name: format(d, 'EEE'),
        amount: Number(dayTotal.toFixed(1))
      };
    });

    // Carbon emissions grouped by category
    const categoryTotals = activities.reduce((acc, a) => {
      const amount = a.isReduction ? -a.carbonAmount : a.carbonAmount;
      acc[a.category] = (acc[a.category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);
    
    const categoryData = Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value: Number(value.toFixed(1))
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);

    return { totalToday, totalSaved, weeklyData, categoryData };
  }, [activities]);

  // Daily eco-standing classification
  const assessment = useMemo(() => {
    return carbonService.getDailyAssessment(stats.totalToday);
  }, [stats.totalToday]);

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
    totalToday: stats.totalToday,
    totalSaved: stats.totalSaved,
    weeklyData: stats.weeklyData,
    categoryData: stats.categoryData,
    assessment,
    activeLoggingId,
    handleLogReduction
  };
}
