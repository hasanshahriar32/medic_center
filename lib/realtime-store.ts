// In-memory store for real-time IoT data streaming
interface RealTimeData {
  userId: string;
  dataType: string;
  bpm?: number;
  hp?: number;
  threshold?: number;
  baselineHR?: number;
  rmssd?: number;
  hrTrend?: number;
  ecgSignal?: number;
  signal?: number;
  timestamp: string;
  deviceId?: string;
}

// Store latest data for each user - optimized for high-frequency updates
const realTimeStore = new Map<string, Record<string, RealTimeData>>();

// Store data history for recent samples (last 10 readings per data type)
const dataHistory = new Map<string, Map<string, RealTimeData[]>>();

// Maximum history size per data type
const MAX_HISTORY_SIZE = 10;

export function updateRealTimeData(data: RealTimeData) {
  const userId = data.userId;
  const dataType = data.dataType;
  
  console.log(`Updating real-time store for user ${userId}, type ${dataType}:`, data);
  
  // Update latest data
  if (!realTimeStore.has(userId)) {
    realTimeStore.set(userId, {});
  }
  
  const userStore = realTimeStore.get(userId)!;
  userStore[dataType] = data;
  
  console.log(`Real-time store updated. User ${userId} now has:`, Object.keys(userStore));
  
  // Update history
  if (!dataHistory.has(userId)) {
    dataHistory.set(userId, new Map());
  }
  
  const userHistory = dataHistory.get(userId)!;
  if (!userHistory.has(dataType)) {
    userHistory.set(dataType, []);
  }
  
  const typeHistory = userHistory.get(dataType)!;
  typeHistory.push(data);
  
  // Keep only recent history
  if (typeHistory.length > MAX_HISTORY_SIZE) {
    typeHistory.shift(); // Remove oldest entry
  }
}

export function getRealTimeData(userId?: string) {
  if (userId) {
    return realTimeStore.get(userId) || {};
  }
  
  // Return all users' data
  const allData: Record<string, Record<string, RealTimeData>> = {};
  realTimeStore.forEach((data, userId) => {
    allData[userId] = data;
  });
  return allData;
}

export function getDataHistory(userId: string, dataType?: string) {
  const userHistory = dataHistory.get(userId);
  if (!userHistory) return {};
  
  if (dataType) {
    return { [dataType]: userHistory.get(dataType) || [] };
  }
  
  const allHistory: Record<string, RealTimeData[]> = {};
  userHistory.forEach((history, type) => {
    allHistory[type] = history;
  });
  return allHistory;
}

export function clearOldData(maxAgeMinutes: number = 30) {
  const cutoffTime = new Date(Date.now() - maxAgeMinutes * 60 * 1000);
  
  // Clean up real-time store
  realTimeStore.forEach((userStore, userId) => {
    Object.keys(userStore).forEach(dataType => {
      const data = userStore[dataType];
      if (new Date(data.timestamp) < cutoffTime) {
        delete userStore[dataType];
      }
    });
    
    // Remove user if no recent data
    if (Object.keys(userStore).length === 0) {
      realTimeStore.delete(userId);
    }
  });
  
  // Clean up history
  dataHistory.forEach((userHistory, userId) => {
    userHistory.forEach((typeHistory, dataType) => {
      const filteredHistory = typeHistory.filter(
        data => new Date(data.timestamp) >= cutoffTime
      );
      
      if (filteredHistory.length === 0) {
        userHistory.delete(dataType);
      } else {
        userHistory.set(dataType, filteredHistory);
      }
    });
    
    if (userHistory.size === 0) {
      dataHistory.delete(userId);
    }
  });
}

export function getStoreStats() {
  return {
    totalUsers: realTimeStore.size,
    totalDataTypes: Array.from(realTimeStore.values()).reduce(
      (sum, userStore) => sum + Object.keys(userStore).length, 0
    ),
    totalHistoryEntries: Array.from(dataHistory.values()).reduce(
      (sum, userHistory) => sum + Array.from(userHistory.values()).reduce(
        (userSum, typeHistory) => userSum + typeHistory.length, 0
      ), 0
    ),
    lastCleanup: new Date().toISOString()
  };
}
