import { type NextRequest, NextResponse } from "next/server"
import { insertSensorData, getUserByFirebaseUid, createAlert } from "@/lib/database-drizzle"

interface MQTTData {
  userId: string
  dataType: "eeg" | "ecg" | "heartRate" | "bloodPressure" | "temperature"
  bpm?: number
  signal?: number
  eegAlpha?: number
  ecgSignal?: number
  timestamp?: string
  metadata?: any
}

export async function POST(request: NextRequest) {
  try {
    const data: MQTTData = await request.json()
    console.log("Processing MQTT data:", data)

    // Get user from database using Firebase UID
    const user = await getUserByFirebaseUid(data.userId)
    if (!user) {
      console.error("User not found for Firebase UID:", data.userId)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const sensorDataEntries = []

    // Process different types of sensor data
    if (data.bpm !== undefined) {
      const heartRateData = await insertSensorData({
        userId: user.id,
        dataType: "heartRate",
        value: data.bpm.toString(),
        signalQuality: data.signal,
        metadata: {
          timestamp: data.timestamp,
          ...data.metadata,
        },
      })
      sensorDataEntries.push(heartRateData)

      // Check for heart rate alerts
      if (data.bpm > 100) {
        await createAlert({
          userId: user.id,
          type: "warning",
          title: "Elevated Heart Rate Detected",
          description: `Heart rate of ${data.bpm} BPM detected for ${user.name}`,
        })
      } else if (data.bpm > 120) {
        await createAlert({
          userId: user.id,
          type: "critical",
          title: "Critical Heart Rate Alert",
          description: `Dangerously high heart rate of ${data.bpm} BPM detected for ${user.name}`,
        })
      }
    }

    if (data.eegAlpha !== undefined) {
      const eegData = await insertSensorData({
        userId: user.id,
        dataType: "eeg",
        value: data.eegAlpha.toString(),
        signalQuality: data.signal,
        metadata: {
          timestamp: data.timestamp,
          ...data.metadata,
        },
      })
      sensorDataEntries.push(eegData)

      // Check for EEG alerts
      if (data.eegAlpha < 7) {
        await createAlert({
          userId: user.id,
          type: "warning",
          title: "Low Alpha Wave Activity",
          description: `EEG Alpha waves at ${data.eegAlpha} Hz detected for ${user.name} - possible stress indicator`,
        })
      }
    }

    if (data.ecgSignal !== undefined) {
      const ecgData = await insertSensorData({
        userId: user.id,
        dataType: "ecg",
        value: data.ecgSignal.toString(),
        signalQuality: data.signal,
        metadata: {
          timestamp: data.timestamp,
          ...data.metadata,
        },
      })
      sensorDataEntries.push(ecgData)

      // Check for ECG signal quality alerts
      if (data.ecgSignal < 70) {
        await createAlert({
          userId: user.id,
          type: "warning",
          title: "Poor ECG Signal Quality",
          description: `ECG signal quality at ${data.ecgSignal}% for ${user.name} - check sensor connection`,
        })
      }
    }

    // Broadcast real-time data to connected clients
    await broadcastRealTimeData(user.id, data)

    return NextResponse.json({
      success: true,
      data: sensorDataEntries,
      user: user.name,
    })
  } catch (error) {
    console.error("Error processing MQTT data:", error)
    return NextResponse.json({ error: "Failed to process MQTT data" }, { status: 500 })
  }
}

async function broadcastRealTimeData(userId: string, data: MQTTData) {
  // Store the latest data in a cache or database for real-time access
  // This could be Redis, but for now we'll use the database
  try {
    // You could implement a real-time broadcasting mechanism here
    // For now, we'll rely on polling from the frontend
    console.log(`Broadcasting real-time data for user ${userId}:`, data)
  } catch (error) {
    console.error("Error broadcasting real-time data:", error)
  }
}
