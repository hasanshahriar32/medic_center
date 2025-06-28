import { db } from "./db";
import { users, sensorData, alerts, type User, type NewUser, type SensorData, type NewSensorData, type Alert, type NewAlert } from "./db/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";

// User management functions
export async function createUser(userData: NewUser) {
  const result = await db.insert(users).values(userData).returning();
  return result[0];
}

export async function getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid)).limit(1);
  return result[0];
}

export async function getAllUsers(): Promise<User[]> {
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function updateUser(firebaseUid: string, updates: Partial<NewUser>): Promise<User> {
  const result = await db
    .update(users)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(users.firebaseUid, firebaseUid))
    .returning();
  return result[0];
}

// Sensor data functions
export async function insertSensorData(data: NewSensorData): Promise<SensorData> {
  const result = await db.insert(sensorData).values(data).returning();
  return result[0];
}

export async function getLatestSensorData(userId: string, dataType?: string): Promise<SensorData[]> {
  if (dataType) {
    return await db
      .select()
      .from(sensorData)
      .where(and(eq(sensorData.userId, userId), eq(sensorData.dataType, dataType)))
      .orderBy(desc(sensorData.timestamp))
      .limit(1);
  }

  // Get latest data for each data type
  return await db
    .select()
    .from(sensorData)
    .where(eq(sensorData.userId, userId))
    .orderBy(desc(sensorData.timestamp));
}

export async function getSensorDataHistory(userId: string, hours = 24): Promise<SensorData[]> {
  const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  return await db
    .select()
    .from(sensorData)
    .where(and(
      eq(sensorData.userId, userId),
      gte(sensorData.timestamp, cutoffTime)
    ))
    .orderBy(desc(sensorData.timestamp));
}

// Alert functions
export async function createAlert(alertData: NewAlert): Promise<Alert> {
  const result = await db.insert(alerts).values(alertData).returning();
  return result[0];
}

export async function getActiveAlerts() {
  return await db
    .select({
      id: alerts.id,
      userId: alerts.userId,
      type: alerts.type,
      title: alerts.title,
      description: alerts.description,
      status: alerts.status,
      createdAt: alerts.createdAt,
      resolvedAt: alerts.resolvedAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(alerts)
    .innerJoin(users, eq(alerts.userId, users.id))
    .where(eq(alerts.status, "active"))
    .orderBy(desc(alerts.createdAt));
}

export async function updateAlertStatus(alertId: string, status: "active" | "acknowledged" | "resolved"): Promise<Alert> {
  const result = await db
    .update(alerts)
    .set({
      status,
      resolvedAt: status === "resolved" ? new Date() : undefined,
    })
    .where(eq(alerts.id, alertId))
    .returning();
  return result[0];
}

// Export types for use in other files
export type { User, NewUser, SensorData, NewSensorData, Alert, NewAlert };
