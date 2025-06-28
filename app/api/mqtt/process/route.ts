import { type NextRequest, NextResponse } from "next/server"
import { createAlert } from "@/lib/database-drizzle"
import { getCachedUser } from "@/lib/user-cache"
import { updateRealTimeData } from "@/lib/realtime-store"

interface MQTTData {
  userId: string
  dataType: "eeg" | "ecg" | "heartRate" | "bloodPressure" | "temperature"
  bpm?: number
  signal?: number
  eegAlpha?: number
  ecgSignal?: number
  timestamp?: string
  deviceId?: string
  metadata?: any
}

export async function POST(request: NextRequest) {
  try {
    const data: MQTTData = await request.json()
    console.log("Processing MQTT data:", data)

    const processedData = []

    // Process different types of sensor data and store in real-time store
    if (data.bpm !== undefined) {
      const heartRateData = {
        userId: data.userId,
        dataType: "heartRate",
        bpm: data.bpm,
        signal: data.signal,
        timestamp: data.timestamp || new Date().toISOString(),
        deviceId: data.deviceId,
      }
      
      // Update real-time store (no database)
      updateRealTimeData(heartRateData)
      processedData.push(heartRateData)

      // Check for critical heart rate alerts only
      if (data.bpm > 120 || data.bpm < 50) {
        try {
          const user = await getCachedUser(data.userId)
          if (user) {
            await createAlert({
              userId: user.id,
              type: "critical",
              title: "Critical Heart Rate Alert",
              description: `${data.bpm > 120 ? 'Dangerously high' : 'Dangerously low'} heart rate of ${data.bpm} BPM detected for ${user.name}`,
            })
          }
        } catch (error) {
          console.error("Error creating heart rate alert:", error)
        }
      }
    }

    if (data.eegAlpha !== undefined) {
      const eegData = {
        userId: data.userId,
        dataType: "eeg",
        eegAlpha: data.eegAlpha,
        signal: data.signal,
        timestamp: data.timestamp || new Date().toISOString(),
        deviceId: data.deviceId,
      }
      
      // Update real-time store (no database)
      updateRealTimeData(eegData)
      processedData.push(eegData)

      // Check for critical EEG alerts only
      if (data.eegAlpha < 5) {
        try {
          const user = await getCachedUser(data.userId)
          if (user) {
            await createAlert({
              userId: user.id,
              type: "warning",
              title: "Critical Alpha Wave Activity",
              description: `Very low EEG Alpha waves at ${data.eegAlpha} Hz detected for ${user.name}`,
            })
          }
        } catch (error) {
          console.error("Error creating EEG alert:", error)
        }
      }
    }

    if (data.ecgSignal !== undefined) {
      const ecgData = {
        userId: data.userId,
        dataType: "ecg",
        ecgSignal: data.ecgSignal,
        signal: data.signal,
        timestamp: data.timestamp || new Date().toISOString(),
        deviceId: data.deviceId,
      }
      
      // Update real-time store (no database)
      updateRealTimeData(ecgData)
      processedData.push(ecgData)

      // Check for critical ECG signal quality alerts only
      if (data.ecgSignal < 50) {
        try {
          const user = await getCachedUser(data.userId)
          if (user) {
            await createAlert({
              userId: user.id,
              type: "warning",
              title: "Critical ECG Signal Quality",
              description: `Very poor ECG signal quality at ${data.ecgSignal}% for ${user.name}`,
            })
          }
        } catch (error) {
          console.error("Error creating ECG alert:", error)
        }
      }
    }

    // Broadcast real-time data to subscribers
    broadcastRealTimeData(data.userId, data)

    return NextResponse.json({
      success: true,
      data: processedData,
      userId: data.userId,
      realTime: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error processing MQTT data:", error)
    return NextResponse.json({ error: "Failed to process MQTT data" }, { status: 500 })
  }
}

function broadcastRealTimeData(userId: string, data: MQTTData) {
  // Real-time data is already stored in the realtime-store
  // Frontend will poll this data via the /api/realtime endpoint
  console.log(`Real-time data updated for user ${userId}:`, {
    dataType: data.dataType,
    timestamp: data.timestamp || new Date().toISOString()
  })
}
