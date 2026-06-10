import { isSameDay, subDays, format } from 'date-fns';
import type { Activity } from '../types';

/**
 * Calculates net carbon footprint for the current day (emissions minus offsets).
 */
export function calculateTotalToday(activities: Activity[]): number {
  const today = new Date();
  return activities
    .filter(a => isSameDay(new Date(a.date), today))
    .reduce((sum, a) => sum + (a.isReduction ? -a.carbonAmount : a.carbonAmount), 0);
}

/**
 * Calculates cumulative carbon savings from logged offset reductions.
 */
export function calculateTotalSaved(activities: Activity[]): number {
  return activities
    .filter(a => a.isReduction)
    .reduce((sum, a) => sum + a.carbonAmount, 0);
}

/**
 * Aggregates net daily footprints for the last 7 days.
 */
export function calculateWeeklyData(activities: Activity[]): Array<{ name: string; amount: number }> {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(today, 6 - i);
    const dayTotal = activities
      .filter(a => isSameDay(new Date(a.date), d))
      .reduce((sum, a) => sum + (a.isReduction ? -a.carbonAmount : a.carbonAmount), 0);
    return {
      name: format(d, 'EEE'),
      amount: Number(dayTotal.toFixed(1))
    };
  });
}

/**
 * Groups carbon amounts by category for emissions analysis.
 */
export function calculateCategoryData(activities: Activity[]): Array<{ name: string; value: number }> {
  const categoryTotals = activities.reduce((acc, a) => {
    const amount = a.isReduction ? -a.carbonAmount : a.carbonAmount;
    acc[a.category] = (acc[a.category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value: Number(value.toFixed(1))
    }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);
}
