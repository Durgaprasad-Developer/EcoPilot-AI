'use client';

import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

/**
 * Onboarding component collects the user's name and goals to tailor their carbon tracking experience.
 */
export const Onboarding: React.FC = () => {
  const { completeOnboarding } = useAppContext();
  const [name, setName] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  
  const goalOptions = [
    "Reduce meat consumption",
    "Use public transport more often",
    "Lower home energy usage",
    "Buy sustainable products",
    "Walk or bike for short trips"
  ];

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length > 0) {
      completeOnboarding(name, selectedGoals);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg border border-gray-100" role="main">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to EcoPilot AI</h1>
      <p className="text-gray-600 mb-6">Let&apos;s set up your personalized profile to understand, track, and reduce your carbon footprint.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name-input" className="block text-sm font-medium text-gray-700 mb-1">
            How should I call you?
          </label>
          <input 
            type="text" 
            id="name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-gray-800"
            placeholder="e.g. Alex"
            required
            aria-required="true"
          />
        </div>
        
        <div>
          <fieldset className="border-none p-0 m-0">
            <legend className="block text-sm font-medium text-gray-700 mb-2">
              Select your goals (optional):
            </legend>
            <div className="space-y-2">
              {goalOptions.map((goal, idx) => {
                const goalId = `goal-checkbox-${idx}`;
                const isChecked = selectedGoals.includes(goal);
                return (
                  <label 
                    key={goal} 
                    htmlFor={goalId}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 focus-within:ring-2 focus-within:ring-teal-500 ${
                      isChecked ? 'border-teal-300 bg-teal-50/10' : 'border-gray-200'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      id={goalId}
                      checked={isChecked}
                      onChange={() => toggleGoal(goal)}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="ml-3 text-sm text-gray-700 font-medium">{goal}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
        
        <button 
          type="submit" 
          disabled={!name.trim()}
          className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 outline-none"
        >
          Start tracking & reducing emissions
        </button>
      </form>
    </div>
  );
};
