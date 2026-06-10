import type { UserProfile, Activity } from '../types';

/**
 * LocalStorage Mock implementation for Database Service
 */
const DB_KEY = 'ecopilot_db';

interface LocalDB {
  users: Record<string, UserProfile>;
  activities: Activity[];
}

// In-memory cache of the database to prevent redundant LocalStorage reads and JSON parsing.
let cachedDB: LocalDB | null = null;

const getDB = (): LocalDB => {
  if (typeof window === 'undefined') return { users: {}, activities: [] };
  
  // Invalidate cache if localStorage has been cleared (e.g. during test cleanup)
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    cachedDB = { users: {}, activities: [] };
    return cachedDB;
  }

  if (cachedDB) return cachedDB;
  
  cachedDB = JSON.parse(data);
  return cachedDB!;
};

const saveDB = (db: LocalDB) => {
  cachedDB = db;
  if (typeof window === 'undefined') return;
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const dbService = {
  /**
   * Saves a new activity to the local database store.
   * @param activity The Activity object to persist.
   * @returns A promise that resolves when the save operation completes.
   */
  saveActivity: async (activity: Activity): Promise<void> => {
    const db = getDB();
    db.activities.push(activity);
    saveDB(db);
  },
  
  /**
   * Retrieves all activities associated with a specific user, sorted in descending chronological order.
   * @param userId The unique user identifier.
   * @returns A promise resolving to an array of matching Activity objects.
   */
  getActivities: async (userId: string): Promise<Activity[]> => {
    const db = getDB();
    return db.activities
      .filter(a => a.userId === userId)
      .sort((a, b) => b.date.localeCompare(a.date)); // Lexicographical comparison of ISO strings is faster than Date parsing
  },
  
  /**
   * Creates or updates a user profile in the database.
   * @param user The UserProfile object to persist.
   * @returns A promise that resolves when the save operation completes.
   */
  saveUser: async (user: UserProfile): Promise<void> => {
    const db = getDB();
    db.users[user.uid] = user;
    saveDB(db);
  },
  
  /**
   * Retrieves a user profile by their unique identifier.
   * @param uid The unique user identifier.
   * @returns A promise resolving to the UserProfile, or null if the user does not exist.
   */
  getUser: async (uid: string): Promise<UserProfile | null> => {
    const db = getDB();
    return db.users[uid] || null;
  }
};
