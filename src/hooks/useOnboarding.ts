import { useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';

export const GOAL_OPTIONS = [
  "Reduce meat consumption",
  "Use public transport more often",
  "Lower home energy usage",
  "Buy sustainable products",
  "Walk or bike for short trips"
];

/**
 * Custom hook managing onboarding state and form submission.
 * @returns Object containing form state, toggles, submit handler, and goals configuration.
 */
export function useOnboarding() {
  const { completeOnboarding } = useAppContext();
  const [name, setName] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = useCallback((goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length > 0) {
      completeOnboarding(name, selectedGoals);
    }
  }, [name, selectedGoals, completeOnboarding]);

  return {
    name,
    setName,
    selectedGoals,
    toggleGoal,
    handleSubmit,
    goalOptions: GOAL_OPTIONS
  };
}
