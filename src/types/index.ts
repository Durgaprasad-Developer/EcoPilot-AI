export type Category = 'transport' | 'food' | 'energy' | 'shopping' | 'other';

export interface Activity {
  id: string;
  userId: string;
  description: string;
  category: Category;
  carbonAmount: number; // in kg CO2e
  date: string; // ISO string
  aiInsight?: string;
  isReduction?: boolean;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  goals: string[];
}

export interface DailyFootprint {
  date: string;
  totalCarbon: number;
  breakdown: Record<Category, number>;
}
