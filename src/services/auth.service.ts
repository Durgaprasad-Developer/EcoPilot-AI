import type { UserProfile } from '../types';

/**
 * LocalStorage Mock implementation for Auth Service
 */
const AUTH_KEY = 'ecopilot_current_user';

export const authService = {
  /**
   * Retrieves the current authenticated user profile from persistent storage.
   * @returns The active UserProfile object, or null if no session exists.
   */
  getCurrentUser: (): UserProfile | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },
  
  /**
   * Performs an anonymous session login by generating a temporary guest profile.
   * @returns The newly created guest UserProfile.
   */
  loginAnonymously: (): UserProfile => {
    const mockUser: UserProfile = {
      uid: 'guest_' + Math.random().toString(36).substring(2, 9),
      name: 'Guest User',
      email: 'guest@example.com',
      goals: []
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
    }
    return mockUser;
  },
  
  /**
   * Terminates the current session by removing user profiles from persistent storage.
   */
  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEY);
    }
  }
};
