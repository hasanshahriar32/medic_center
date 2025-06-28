import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: string
  firebase_uid: string
  name: string
  email: string
  created_at: string
}

export interface SensorData {
  id: string
  user_id: string
  data_type: string
  value: number
  signal_quality?: number
  created_at: string
  metadata?: any
}

export interface Alert {
  id: string
  user_id: string
  type: "info" | "warning" | "critical"
  title: string
  description: string
  created_at: string
  resolved: boolean
}

export async function createUser(userData: {
  firebase_uid: string
  name: string
  email: string
}): Promise<User> {
  const result = await sql`
    INSERT INTO users (firebase_uid, name, email)
    VALUES (${userData.firebase_uid}, ${userData.name}, ${userData.email})
    RETURNING *
  `
  return result[0] as User
}

export async function getUserByFirebaseUid(firebase_uid: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE firebase_uid = ${firebase_uid} LIMIT 1
  `
  return (result[0] as User) || null
}

export async function getAllUsers(): Promise<User[]> {
  const result = await sql`
    SELECT * FROM users ORDER BY created_at DESC
  `
  return result as User[]
}

export async function insertSensorData(data: {
  user_id: string
  data_type: string
  value: number
  signal_quality?: number
  metadata?: any
}): Promise<SensorData> {
  const result = await sql`
    INSERT INTO sensor_data (user_id, data_type, value, signal_quality, metadata)
    VALUES (${data.user_id}, ${data.data_type}, ${data.value}, ${data.signal_quality || null}, ${JSON.stringify(data.metadata || {})})
    RETURNING *
  `
  return result[0] as SensorData
}

export async function getLatestSensorData(userId?: string): Promise<SensorData[]> {
  if (userId) {
    const result = await sql`
      SELECT * FROM sensor_data 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC 
      LIMIT 10
    `
    return result as SensorData[]
  } else {
    const result = await sql`
      SELECT DISTINCT ON (user_id, data_type) *
      FROM sensor_data
      ORDER BY user_id, data_type, created_at DESC
    `
    return result as SensorData[]
  }
}

export async function createAlert(alertData: {
  user_id: string
  type: "info" | "warning" | "critical"
  title: string
  description: string
}): Promise<Alert> {
  const result = await sql`
    INSERT INTO alerts (user_id, type, title, description)
    VALUES (${alertData.user_id}, ${alertData.type}, ${alertData.title}, ${alertData.description})
    RETURNING *
  `
  return result[0] as Alert
}

export async function getAlerts(userId?: string): Promise<Alert[]> {
  if (userId) {
    const result = await sql`
      SELECT * FROM alerts 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC 
      LIMIT 20
    `
    return result as Alert[]
  } else {
    const result = await sql`
      SELECT * FROM alerts 
      ORDER BY created_at DESC 
      LIMIT 50
    `
    return result as Alert[]
  }
}

export async function getUsersWithLatestSensorData(): Promise<any[]> {
  const result = await sql`
    SELECT 
      u.id,
      u.firebase_uid,
      u.name,
      u.email,
      u.created_at as user_created_at,
      COALESCE(
        json_agg(
          json_build_object(
            'id', sd.id,
            'data_type', sd.data_type,
            'value', sd.value,
            'signal_quality', sd.signal_quality,
            'created_at', sd.created_at,
            'metadata', sd.metadata
          )
          ORDER BY sd.created_at DESC
        ) FILTER (WHERE sd.id IS NOT NULL),
        '[]'::json
      ) as sensor_data
    FROM users u
    LEFT JOIN LATERAL (
      SELECT DISTINCT ON (data_type) *
      FROM sensor_data
      WHERE user_id = u.id
      ORDER BY data_type, created_at DESC
    ) sd ON true
    GROUP BY u.id, u.firebase_uid, u.name, u.email, u.created_at
    ORDER BY u.created_at DESC
  `

  return result.map((row: any) => ({
    user: {
      id: row.id,
      firebase_uid: row.firebase_uid,
      name: row.name,
      email: row.email,
      created_at: row.user_created_at,
    },
    sensorData: row.sensor_data || [],
  }))
}
