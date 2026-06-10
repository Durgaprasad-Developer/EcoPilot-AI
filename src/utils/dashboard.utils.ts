import { isSameDay, subDays, format } from 'date-fns';
import type { Activity } from '../types';
import { DAYS_IN_WEEK } from '../constants';

/**
 * Calculates net carbon footprint for the current day (emissions minus offsets).
 * @param activities List of tracked user activities.
 * @returns The net carbon footprint amount for today.
 */
export function calculateTotalToday(activities: Activity[]): number {
  const today = new Date();
  return activities
    .filter(a => isSameDay(new Date(a.date), today))
    .reduce((sum, a) => sum + (a.isReduction ? -a.carbonAmount : a.carbonAmount), 0);
}

/**
 * Calculates cumulative carbon savings from logged offset reductions.
 * @param activities List of tracked user activities.
 * @returns The sum total of all carbon saved.
 */
export function calculateTotalSaved(activities: Activity[]): number {
  return activities
    .filter(a => a.isReduction)
    .reduce((sum, a) => sum + a.carbonAmount, 0);
}

/**
 * Aggregates net daily footprints for the last 7 days.
 * @param activities List of tracked user activities.
 * @returns 7-day chronological data points for rendering charts.
 */
export function calculateWeeklyData(activities: Activity[]): Array<{ name: string; amount: number }> {
  const today = new Date();
  return Array.from({ length: DAYS_IN_WEEK }).map((_, i) => {
    const d = subDays(today, (DAYS_IN_WEEK - 1) - i);
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
 * @param activities List of tracked user activities.
 * @returns Array of grouped category values sorted by descending footprint value.
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
