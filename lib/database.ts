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
  data_type: "eeg" | "ecg" | "heartRate" | "bloodPressure" | "temperature"
  value: number
  signal_quality?: number
  timestamp: Date
  metadata?: any
}

export interface Alert {
  id: string
  user_id: string
  type: "critical" | "warning" | "info"
  title: string
  description: string
  status: "active" | "acknowledged" | "resolved"
  created_at: Date
  resolved_at?: Date
}

// User management functions
export async function createUser(userData: {
  firebase_uid: string
  email: string
  name: string
  age?: number
  medical_condition?: string
}) {
  const result = await sql`
    INSERT INTO users (firebase_uid, email, name, age, medical_condition, created_at, updated_at)
    VALUES (${userData.firebase_uid}, ${userData.email}, ${userData.name}, ${userData.age || null}, ${userData.medical_condition || null}, NOW(), NOW())
    RETURNING *
  `
  return result[0] as User
}

export async function getUserByFirebaseUid(firebase_uid: string) {
  const result = await sql`
    SELECT * FROM users WHERE firebase_uid = ${firebase_uid} LIMIT 1
  `
  return result[0] as User | undefined
}

export async function getAllUsers() {
  const result = await sql`
    SELECT * FROM users ORDER BY created_at DESC
  `
  return result as User[]
}

export async function updateUser(firebase_uid: string, updates: Partial<User>) {
  const result = await sql`
    UPDATE users 
    SET name = COALESCE(${updates.name}, name),
        age = COALESCE(${updates.age}, age),
        medical_condition = COALESCE(${updates.medical_condition}, medical_condition),
        updated_at = NOW()
    WHERE firebase_uid = ${firebase_uid}
    RETURNING *
  `
  return result[0] as User
}

// Sensor data functions
export async function insertSensorData(data: {
  user_id: string
  data_type: string
  value: number
  signal_quality?: number
  metadata?: any
}) {
  const result = await sql`
    INSERT INTO sensor_data (user_id, data_type, value, signal_quality, metadata, timestamp)
    VALUES (${data.user_id}, ${data.data_type}, ${data.value}, ${data.signal_quality || null}, ${JSON.stringify(data.metadata || {})}, NOW())
    RETURNING *
  `
  return result[0] as SensorData
}

export async function getLatestSensorData(user_id: string, data_type?: string) {
  const result = data_type
    ? await sql`
        SELECT * FROM sensor_data 
        WHERE user_id = ${user_id} AND data_type = ${data_type}
        ORDER BY timestamp DESC 
        LIMIT 1
      `
    : await sql`
        SELECT DISTINCT ON (data_type) *
        FROM sensor_data 
        WHERE user_id = ${user_id}
        ORDER BY data_type, timestamp DESC
      `
  return result as SensorData[]
}

export async function getSensorDataHistory(user_id: string, hours = 24) {
  const result = await sql`
    SELECT * FROM sensor_data 
    WHERE user_id = ${user_id} 
    AND timestamp > NOW() - INTERVAL '${hours} hours'
    ORDER BY timestamp DESC
  `
  return result as SensorData[]
}

// Alert functions
export async function createAlert(alertData: {
  user_id: string
  type: string
  title: string
  description: string
}) {
  const result = await sql`
    INSERT INTO alerts (user_id, type, title, description, status, created_at)
    VALUES (${alertData.user_id}, ${alertData.type}, ${alertData.title}, ${alertData.description}, 'active', NOW())
    RETURNING *
  `
  return result[0] as Alert
}

export async function getActiveAlerts() {
  const result = await sql`
    SELECT a.*, u.name as user_name, u.email as user_email
    FROM alerts a
    JOIN users u ON a.user_id = u.id
    WHERE a.status = 'active'
    ORDER BY a.created_at DESC
  `
  return result
}

export async function updateAlertStatus(alert_id: string, status: string) {
  const result = await sql`
    UPDATE alerts 
    SET status = ${status}, 
        resolved_at = CASE WHEN ${status} = 'resolved' THEN NOW() ELSE resolved_at END
    WHERE id = ${alert_id}
    RETURNING *
  `
  return result[0] as Alert
}
