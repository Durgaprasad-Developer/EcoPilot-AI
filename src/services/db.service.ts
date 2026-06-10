import type { UserProfile, Activity } from '../types';

/**
 * LocalStorage Mock implementation for Database Service
 */
const DB_KEY = 'ecopilot_db';

interface LocalDB {
  users: Record<string, UserProfile>;
  activities: Activity[];
}

const getDB = (): LocalDB => {
  if (typeof window === 'undefined') return { users: {}, activities: [] };
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : { users: {}, activities: [] };
};

const saveDB = (db: LocalDB) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const dbService = {
  saveActivity: async (activity: Activity): Promise<void> => {
    const db = getDB();
    db.activities.push(activity);
    saveDB(db);
  },
  
  getActivities: async (userId: string): Promise<Activity[]> => {
    const db = getDB();
    return db.activities.filter(a => a.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  
  saveUser: async (user: UserProfile): Promise<void> => {
    const db = getDB();
    db.users[user.uid] = user;
    saveDB(db);
  },
  
  getUser: async (uid: string): Promise<UserProfile | null> => {
    const db = getDB();
    return db.users[uid] || null;
  }
};
