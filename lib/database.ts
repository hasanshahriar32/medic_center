import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: string
  firebase_uid: string
  email: string
  name: string
  age?: number
  medical_condition?: string
  created_at: Date
  updated_at: Date
}

export interface SensorData {
  id: string
  user_id: string
  data_type: string
  value: number
  signal_quality?: number
  metadata?: any
  created_at: Date
}

export interface Alert {
  id: string
  user_id: string
  type: "info" | "warning" | "critical"
  title: string
  description: string
  status: "active" | "acknowledged" | "resolved"
  resolved: boolean
  created_at: Date
  resolved_at?: Date
}

// User functions
export async function createUser(userData: {
  firebase_uid: string
  email: string
  name: string
  age?: number
  medical_condition?: string
}): Promise<User> {
  console.log("👤 Creating user:", userData)

  const result = await sql`
    INSERT INTO users (firebase_uid, email, name, age, medical_condition, created_at, updated_at)
    VALUES (${userData.firebase_uid}, ${userData.email}, ${userData.name}, ${userData.age || null}, ${userData.medical_condition || null}, NOW(), NOW())
    RETURNING *
  `

  console.log("✅ User created:", result[0])
  return result[0] as User
}

export async function getUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
  console.log("🔍 Getting user by Firebase UID:", firebaseUid)

  const result = await sql`
    SELECT * FROM users WHERE firebase_uid = ${firebaseUid} LIMIT 1
  `

  if (result.length === 0) {
    console.log("❌ User not found for Firebase UID:", firebaseUid)
    return null
  }

  console.log("✅ User found:", result[0])
  return result[0] as User
}

export async function getAllUsers(): Promise<User[]> {
  console.log("👥 Getting all users...")

  const result = await sql`
    SELECT * FROM users ORDER BY created_at DESC
  `

  console.log("✅ Found users:", result.length)
  return result as User[]
}

export async function updateUser(firebase_uid: string, updates: Partial<User>): Promise<User> {
  console.log("🔄 Updating user:", { firebase_uid, updates })

  const result = await sql`
    UPDATE users 
    SET name = COALESCE(${updates.name}, name),
        age = COALESCE(${updates.age}, age),
        medical_condition = COALESCE(${updates.medical_condition}, medical_condition),
        updated_at = NOW()
    WHERE firebase_uid = ${firebase_uid}
    RETURNING *
  `

  console.log("✅ User updated:", result[0])
  return result[0] as User
}

// Sensor data functions
export async function insertSensorData(data: {
  user_id: string
  data_type: string
  value: number
  signal_quality?: number
  metadata?: any
}): Promise<SensorData> {
  console.log("📊 Inserting sensor data:", data)

  const result = await sql`
    INSERT INTO sensor_data (user_id, data_type, value, signal_quality, metadata, created_at)
    VALUES (${data.user_id}, ${data.data_type}, ${data.value}, ${data.signal_quality || null}, ${JSON.stringify(data.metadata || {})}, NOW())
    RETURNING *
  `

  console.log("✅ Sensor data inserted:", result[0])
  return result[0] as SensorData
}

export async function getLatestSensorData(userId: string): Promise<SensorData[]> {
  console.log("📊 Getting latest sensor data for user:", userId)

  const result = await sql`
    SELECT DISTINCT ON (data_type) *
    FROM sensor_data
    WHERE user_id = ${userId}
    ORDER BY data_type, created_at DESC
  `

  console.log("✅ Latest sensor data found:", result.length, "entries")
  return result as SensorData[]
}

export async function getSensorDataByType(userId: string, dataType: string, limit = 50): Promise<SensorData[]> {
  console.log("📊 Getting sensor data by type:", { userId, dataType, limit })

  const result = await sql`
    SELECT * FROM sensor_data
    WHERE user_id = ${userId} AND data_type = ${dataType}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `

  console.log("✅ Sensor data by type found:", result.length, "entries")
  return result as SensorData[]
}

export async function getSensorDataHistory(userId: string, hours = 24): Promise<SensorData[]> {
  console.log("📊 Getting sensor data history for user:", userId, "hours:", hours)

  const result = await sql`
    SELECT * FROM sensor_data 
    WHERE user_id = ${userId} 
    AND created_at > NOW() - INTERVAL '${hours} hours'
    ORDER BY created_at DESC
  `

  console.log("✅ Sensor data history found:", result.length, "entries")
  return result as SensorData[]
}

// Alert functions
export async function createAlert(alertData: {
  user_id: string
  type: "info" | "warning" | "critical"
  title: string
  description: string
}): Promise<Alert> {
  console.log("🚨 Creating alert:", alertData)

  const result = await sql`
    INSERT INTO alerts (user_id, type, title, description, status, resolved, created_at)
    VALUES (${alertData.user_id}, ${alertData.type}, ${alertData.title}, ${alertData.description}, 'active', false, NOW())
    RETURNING *
  `

  console.log("✅ Alert created:", result[0])
  return result[0] as Alert
}

export async function getAlerts(userId?: string): Promise<Alert[]> {
  console.log("🚨 Getting alerts for user:", userId || "all users")

  let result
  if (userId) {
    result = await sql`
      SELECT * FROM alerts
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `
  } else {
    result = await sql`
      SELECT a.*, u.name as user_name, u.email as user_email
      FROM alerts a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
    `
  }

  console.log("✅ Alerts found:", result.length)
  return result as Alert[]
}

export async function getActiveAlerts(): Promise<Alert[]> {
  console.log("🚨 Getting active alerts...")

  const result = await sql`
    SELECT a.*, u.name as user_name, u.email as user_email
    FROM alerts a
    JOIN users u ON a.user_id = u.id
    WHERE a.status = 'active' AND a.resolved = false
    ORDER BY a.created_at DESC
  `

  console.log("✅ Active alerts found:", result.length)
  return result as Alert[]
}

export async function updateAlertStatus(
  alertId: string,
  status: "active" | "acknowledged" | "resolved",
): Promise<Alert> {
  console.log("🔄 Updating alert status:", { alertId, status })

  const result = await sql`
    UPDATE alerts
    SET status = ${status},
        resolved = CASE WHEN ${status} = 'resolved' THEN true ELSE resolved END,
        resolved_at = CASE WHEN ${status} = 'resolved' THEN NOW() ELSE resolved_at END
    WHERE id = ${alertId}
    RETURNING *
  `

  console.log("✅ Alert status updated:", result[0])
  return result[0] as Alert
}

export async function resolveAlert(alertId: string): Promise<Alert> {
  console.log("✅ Resolving alert:", alertId)

  const result = await sql`
    UPDATE alerts
    SET status = 'resolved',
        resolved = true,
        resolved_at = NOW()
    WHERE id = ${alertId}
    RETURNING *
  `

  console.log("✅ Alert resolved:", result[0])
  return result[0] as Alert
}
