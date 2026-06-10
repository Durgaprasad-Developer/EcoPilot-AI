import { describe, it, expect, beforeEach } from 'vitest';
import { dbService } from '../services/db.service';
import type { Activity, UserProfile } from '../types';

describe('Database Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save and retrieve user profiles correctly', async () => {
    const mockUser: UserProfile = {
      uid: 'user123',
      name: 'Alice',
      email: 'alice@example.com',
      goals: ['Reduce meat consumption']
    };

    await dbService.saveUser(mockUser);
    const retrievedUser = await dbService.getUser('user123');
    expect(retrievedUser).toEqual(mockUser);

    const nonExistentUser = await dbService.getUser('user456');
    expect(nonExistentUser).toBeNull();
  });

  it('should save and retrieve user-specific activities', async () => {
    const act1: Activity = {
      id: 'act1',
      userId: 'user1',
      description: 'Drove 5 miles',
      category: 'transport',
      carbonAmount: 1.0,
      date: new Date('2026-06-01').toISOString()
    };

    const act2: Activity = {
      id: 'act2',
      userId: 'user2',
      description: 'Ate salad',
      category: 'food',
      carbonAmount: 0.5,
      date: new Date('2026-06-02').toISOString()
    };

    await dbService.saveActivity(act1);
    await dbService.saveActivity(act2);

    const user1Acts = await dbService.getActivities('user1');
    expect(user1Acts).toHaveLength(1);
    expect(user1Acts[0]).toEqual(act1);

    const user2Acts = await dbService.getActivities('user2');
    expect(user2Acts).toHaveLength(1);
    expect(user2Acts[0]).toEqual(act2);
  });

  it('should return activities sorted in descending chronological order', async () => {
    const actOld: Activity = {
      id: 'act_old',
      userId: 'user1',
      description: 'Activity yesterday',
      category: 'energy',
      carbonAmount: 2.0,
      date: new Date('2026-06-09T10:00:00Z').toISOString()
    };

    const actNew: Activity = {
      id: 'act_new',
      userId: 'user1',
      description: 'Activity today',
      category: 'food',
      carbonAmount: 1.0,
      date: new Date('2026-06-10T10:00:00Z').toISOString()
    };

    await dbService.saveActivity(actOld);
    await dbService.saveActivity(actNew);

    const activities = await dbService.getActivities('user1');
    expect(activities).toHaveLength(2);
    expect(activities[0].id).toBe('act_new');
    expect(activities[1].id).toBe('act_old');
  });

  it('should handle corrupted localStorage safely without throwing exceptions', async () => {
    localStorage.setItem('ecopilot_db', '{corrupted_data:');
    const user = await dbService.getUser('any');
    expect(user).toBeNull();
    const activities = await dbService.getActivities('any');
    expect(activities).toEqual([]);
  });
});
