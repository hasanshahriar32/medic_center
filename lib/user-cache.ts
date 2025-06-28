import { User, createUser, getUserByFirebaseUid } from "@/lib/database-drizzle";

// In-memory cache for users
const userCache = new Map<string, User>();

// Cache expiry time (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;
const userCacheTimestamps = new Map<string, number>();

export async function getCachedUser(firebaseUid: string): Promise<User | null> {
  // Check if user is in cache and not expired
  const cachedUser = userCache.get(firebaseUid);
  const cacheTimestamp = userCacheTimestamps.get(firebaseUid);
  
  if (cachedUser && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_EXPIRY)) {
    return cachedUser;
  }

  try {
    // Try to get user from database
    let user = await getUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      // If user doesn't exist, create a default user
      console.log(`Creating new user for Firebase UID: ${firebaseUid}`);
      user = await createUser({
        firebaseUid,
        email: `user_${firebaseUid.slice(0, 8)}@medic.center`,
        name: `User ${firebaseUid.slice(0, 8)}`,
      });
    }

    // Cache the user
    userCache.set(firebaseUid, user);
    userCacheTimestamps.set(firebaseUid, Date.now());
    
    return user;
  } catch (error) {
    console.error(`Error getting/creating user for ${firebaseUid}:`, error);
    return null;
  }
}

// Function to manually cache a user (useful for user registration)
export function cacheUser(user: User): void {
  userCache.set(user.firebaseUid, user);
  userCacheTimestamps.set(user.firebaseUid, Date.now());
}

// Function to clear cache (useful for testing or user updates)
export function clearUserCache(firebaseUid?: string): void {
  if (firebaseUid) {
    userCache.delete(firebaseUid);
    userCacheTimestamps.delete(firebaseUid);
  } else {
    userCache.clear();
    userCacheTimestamps.clear();
  }
}

// Function to get cache stats (useful for debugging)
export function getCacheStats() {
  return {
    size: userCache.size,
    users: Array.from(userCache.keys()),
  };
}
