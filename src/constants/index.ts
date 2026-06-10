/**
 * Global application constants to eliminate magic numbers and strings.
 */

export const CATEGORIES = {
  TRANSPORT: 'transport',
  FOOD: 'food',
  ENERGY: 'energy',
  SHOPPING: 'shopping',
  OTHER: 'other'
} as const;

export const DAYS_IN_WEEK = 7;
export const MAX_CACHE_SIZE = 100;
export const MAX_INPUT_LENGTH = 1000;
export const DEFAULT_TEMPERATURE = 0.2;
