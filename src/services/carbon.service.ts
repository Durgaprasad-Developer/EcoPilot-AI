import type { Category } from '../types';

/**
 * Carbon Engine calculates emissions for activities.
 * Emissions are in kg CO2e.
 */

// Baseline emission factors (approximations for demonstration)
const EMISSION_FACTORS: Record<Category, number> = {
  transport: 0.2, // per km or average trip unit
  food: 2.5, // per meal average
  energy: 0.5, // per kWh or average daily home usage
  shopping: 1.5, // per item average
  other: 1.0,
};

export const carbonService = {
  calculateEmission: (category: Category, quantity: number = 1): number => {
    const factor = EMISSION_FACTORS[category] || EMISSION_FACTORS.other;
    return Number((factor * quantity).toFixed(2));
  },
  
  // Gets a qualitative assessment of a daily total
  getDailyAssessment: (totalCarbon: number): { label: string; color: string } => {
    if (totalCarbon < 10) return { label: 'Excellent', color: 'text-green-500' };
    if (totalCarbon < 25) return { label: 'Good', color: 'text-teal-500' };
    if (totalCarbon < 50) return { label: 'Average', color: 'text-yellow-500' };
    return { label: 'High', color: 'text-red-500' };
  }
};
