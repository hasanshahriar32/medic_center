import { type NextRequest, NextResponse } from "next/server"
import { createAlert } from "@/lib/database-drizzle"
import { getCachedUser } from "@/lib/user-cache"
import { updateRealTimeData } from "@/lib/realtime-store"

interface MQTTData {
  userId: string
  dataType: "ecg_analysis" | "ecg" | "heartRate" | "bloodPressure" | "temperature"
  bpm?: number
  signal?: number
  hp?: number
  threshold?: number
  baselineHR?: number
  rmssd?: number
  hrTrend?: number
  ecgSignal?: number
  timestamp?: string
  deviceId?: string
  receivedAt?: string
  metadata?: any
}

export async function POST(request: NextRequest) {
  try {
    const data: MQTTData = await request.json()
    console.log("Processing MQTT data:", data)

    const processedData = []

    // Handle ECG analysis data specifically
    if (data.dataType === 'ecg_analysis') {
      console.log("Processing ECG analysis data with HP:", data.hp, "BPM:", data.bpm)
      
      // Process heart rate data from ECG analysis
      if (data.bpm !== undefined) {
        const heartRateData = {
          userId: data.userId,
          dataType: "heartRate",
          bpm: data.bpm,
          baselineHR: data.baselineHR,
          rmssd: data.rmssd,
          hrTrend: data.hrTrend,
          signal: data.signal,
          timestamp: data.timestamp || new Date().toISOString(),
          deviceId: data.deviceId,
        }
        
        // Update real-time store
        updateRealTimeData(heartRateData)
        processedData.push(heartRateData)

        // Check for critical heart rate alerts
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

      // Process ECG data from ECG analysis
      const ecgData = {
        userId: data.userId,
        dataType: "ecg",
        hp: data.hp || 0,
        threshold: data.threshold || 8,
        ecgSignal: data.hp ? (data.hp / 10) : 0, // Normalize HP for display
        baselineHR: data.baselineHR,
        rmssd: data.rmssd,
        hrTrend: data.hrTrend,
        signal: data.signal,
        timestamp: data.timestamp || new Date().toISOString(),
        deviceId: data.deviceId,
      }
      
      // Update real-time store
      updateRealTimeData(ecgData)
      processedData.push(ecgData)
      console.log("Updated ECG data in store:", ecgData)

      // Check for critical ECG signal quality alerts
      if (data.hp !== undefined && data.hp < 5) {
        try {
          const user = await getCachedUser(data.userId)
          if (user) {
            await createAlert({
              userId: user.id,
              type: "warning", 
              title: "Critical ECG Signal Quality",
              description: `Very poor ECG HP signal at ${data.hp} detected for ${user.name}`,
            })
          }
        } catch (error) {
          console.error("Error creating ECG alert:", error)
        }
      }
    }
    
    // Handle regular heart rate data (non ECG analysis)
    else if (data.bpm !== undefined) {
      const heartRateData = {
        userId: data.userId,
        dataType: "heartRate",
        bpm: data.bpm,
        baselineHR: data.baselineHR,
        rmssd: data.rmssd,
        hrTrend: data.hrTrend,
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

    // Handle regular ECG signal data (non ECG analysis)
    else if (data.ecgSignal !== undefined) {
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
