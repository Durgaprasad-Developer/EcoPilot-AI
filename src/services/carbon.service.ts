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

/**
 * Interface representing a simple reduction action that a user can take.
 */
export interface SimpleAction {
  id: string;
  name: string;
  reductionAmount: number; // in kg CO2e
  category: Category;
  goalReference: string; // matches goal string from Onboarding.tsx
}

// Map of goals to actions with pre-calculated carbon reductions (negative carbon impact)
export const SIMPLE_REDUCTION_ACTIONS: SimpleAction[] = [
  {
    id: 'act_veg_meal',
    name: 'Ate a fully plant-based meal today',
    reductionAmount: 1.5,
    category: 'food',
    goalReference: 'Reduce meat consumption'
  },
  {
    id: 'act_transit',
    name: 'Took public transit instead of driving',
    reductionAmount: 2.5,
    category: 'transport',
    goalReference: 'Use public transport more often'
  },
  {
    id: 'act_energy_standby',
    name: 'Turned off standby devices & optimized home heating/cooling',
    reductionAmount: 0.8,
    category: 'energy',
    goalReference: 'Lower home energy usage'
  },
  {
    id: 'act_local_shop',
    name: 'Bought local organic food or sustainable goods',
    reductionAmount: 0.5,
    category: 'shopping',
    goalReference: 'Buy sustainable products'
  },
  {
    id: 'act_walk_bike',
    name: 'Walked or cycled for a short trip (<5km)',
    reductionAmount: 1.2,
    category: 'transport',
    goalReference: 'Walk or bike for short trips'
  }
];

export const carbonService = {
  /**
   * Calculates carbon footprint emissions.
   */
  calculateEmission: (category: Category, quantity: number = 1): number => {
    const factor = EMISSION_FACTORS[category] || EMISSION_FACTORS.other;
    return Number((factor * quantity).toFixed(2));
  },
  
  /**
   * Gets simple actions available based on user's sustainability goals.
   */
  getActionsForGoals: (goals: string[]): SimpleAction[] => {
    if (!goals || goals.length === 0) {
      // If no goals selected, return all default simple actions
      return SIMPLE_REDUCTION_ACTIONS;
    }
    return SIMPLE_REDUCTION_ACTIONS.filter(action => goals.includes(action.goalReference));
  },

  /**
   * Qualitative assessment of a daily total carbon footprint.
   */
  getDailyAssessment: (totalCarbon: number): { label: string; color: string } => {
    if (totalCarbon < 0) return { label: 'Net Positive (Eco-Hero!)', color: 'text-emerald-500' };
    if (totalCarbon < 10) return { label: 'Excellent', color: 'text-green-500' };
    if (totalCarbon < 25) return { label: 'Good', color: 'text-teal-500' };
    if (totalCarbon < 50) return { label: 'Average', color: 'text-yellow-500' };
    return { label: 'High', color: 'text-red-500' };
  }
};

