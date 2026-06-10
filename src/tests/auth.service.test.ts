import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from '../services/auth.service';

describe('Auth Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return null if no user is logged in', () => {
    expect(authService.getCurrentUser()).toBeNull();
  });

  it('should successfully login anonymously and persist user profile', () => {
    const user = authService.loginAnonymously();
    expect(user).toBeDefined();
    expect(user.name).toBe('Guest User');
    expect(user.uid).toContain('guest_');

    const currentUser = authService.getCurrentUser();
    expect(currentUser).toEqual(user);
  });

  it('should remove user profile from storage on logout', () => {
    authService.loginAnonymously();
    expect(authService.getCurrentUser()).not.toBeNull();

    authService.logout();
    expect(authService.getCurrentUser()).toBeNull();
  });

  it('should return null and not crash if storage contains corrupted JSON', () => {
    localStorage.setItem('ecopilot_current_user', 'invalid-json{');
    expect(authService.getCurrentUser()).toBeNull();
  });
});
