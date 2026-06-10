'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, Activity } from '../types';
import { authService } from '../services/auth.service';
import { dbService } from '../services/db.service';

interface AppState {
  user: UserProfile | null;
  activities: Activity[];
  loading: boolean;
  login: () => void;
  logout: () => void;
  addActivity: (activity: Omit<Activity, 'id' | 'userId' | 'date'>) => Promise<void>;
  completeOnboarding: (name: string, goals: string[]) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const userActivities = await dbService.getActivities(currentUser.uid);
        setActivities(userActivities);
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = () => {
    const newUser = authService.loginAnonymously();
    setUser(newUser);
    setActivities([]);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setActivities([]);
  };

  const completeOnboarding = async (name: string, goals: string[]) => {
    if (!user) return;
    const updatedUser = { ...user, name, goals };
    await dbService.saveUser(updatedUser);
    setUser(updatedUser);
    
    // Save to auth service as well since it uses localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecopilot_current_user', JSON.stringify(updatedUser));
    }
  };

  const addActivity = async (activityData: Omit<Activity, 'id' | 'userId' | 'date'>) => {
    if (!user) return;
    
    const newActivity: Activity = {
      ...activityData,
      id: Math.random().toString(36).substring(2, 9),
      userId: user.uid,
      date: new Date().toISOString()
    };
    
    await dbService.saveActivity(newActivity);
    setActivities(prev => [newActivity, ...prev]);
  };

  return (
    <AppContext.Provider value={{ user, activities, loading, login, logout, addActivity, completeOnboarding }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
