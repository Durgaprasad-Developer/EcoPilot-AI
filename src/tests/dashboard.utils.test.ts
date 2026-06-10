import { describe, it, expect } from 'vitest';
import { subDays, format } from 'date-fns';
import {
  calculateTotalToday,
  calculateTotalSaved,
  calculateWeeklyData,
  calculateCategoryData
} from '../utils/dashboard.utils';
import type { Activity } from '../types';

describe('Dashboard Utility Functions', () => {
  const todayStr = new Date().toISOString();
  const yesterdayStr = subDays(new Date(), 1).toISOString();

  const mockActivities: Activity[] = [
    {
      id: '1',
      userId: 'user-1',
      description: 'Drove gas car',
      category: 'transport',
      carbonAmount: 5.2,
      date: todayStr,
      isReduction: false
    },
    {
      id: '2',
      userId: 'user-1',
      description: 'Used solar panel',
      category: 'energy',
      carbonAmount: 2.1,
      date: todayStr,
      isReduction: true
    },
    {
      id: '3',
      userId: 'user-1',
      description: 'Bought plastic bottles',
      category: 'shopping',
      carbonAmount: 1.5,
      date: yesterdayStr,
      isReduction: false
    },
    {
      id: '4',
      userId: 'user-1',
      description: 'Planted tree',
      category: 'other',
      carbonAmount: 10.0,
      date: yesterdayStr,
      isReduction: true
    }
  ];

  describe('calculateTotalToday', () => {
    it('should calculate net carbon footprint today correctly', () => {
      // Today: 5.2 (emission) - 2.1 (reduction) = 3.1
      const total = calculateTotalToday(mockActivities);
      expect(total).toBeCloseTo(3.1);
    });

    it('should return 0 when there are no activities', () => {
      expect(calculateTotalToday([])).toBe(0);
    });
  });

  describe('calculateTotalSaved', () => {
    it('should sum all reductions correctly', () => {
      // Reductions: 2.1 + 10.0 = 12.1
      const total = calculateTotalSaved(mockActivities);
      expect(total).toBeCloseTo(12.1);
    });

    it('should return 0 when there are no reductions', () => {
      const emissionsOnly = mockActivities.filter(a => !a.isReduction);
      expect(calculateTotalSaved(emissionsOnly)).toBe(0);
    });
  });

  describe('calculateWeeklyData', () => {
    it('should build a 7-day trend array correctly', () => {
      const weekly = calculateWeeklyData(mockActivities);
      expect(weekly).toHaveLength(7);
      
      const todayLabel = format(new Date(), 'EEE');
      const yesterdayLabel = format(subDays(new Date(), 1), 'EEE');

      const todayEntry = weekly.find(w => w.name === todayLabel);
      const yesterdayEntry = weekly.find(w => w.name === yesterdayLabel);

      expect(todayEntry?.amount).toBeCloseTo(3.1);
      expect(yesterdayEntry?.amount).toBeCloseTo(-8.5); // 1.5 (emission) - 10.0 (reduction) = -8.5
    });
  });

  describe('calculateCategoryData', () => {
    it('should aggregate positive emissions categories correctly', () => {
      const categoryData = calculateCategoryData(mockActivities);
      // 'transport': 5.2 (positive)
      // 'shopping': 1.5 (positive)
      // 'energy': -2.1 (negative, filtered out)
      // 'other': -10.0 (negative, filtered out)
      expect(categoryData).toHaveLength(2);
      expect(categoryData[0].name).toBe('transport');
      expect(categoryData[0].value).toBe(5.2);
      expect(categoryData[1].name).toBe('shopping');
      expect(categoryData[1].value).toBe(1.5);
    });
  });
});
