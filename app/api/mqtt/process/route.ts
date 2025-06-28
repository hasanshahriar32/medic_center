import { type NextRequest, NextResponse } from "next/server"
import { getUserByFirebaseUid, insertSensorData, createAlert } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log("📨 Processing MQTT data via API:", data)

    // Get user from database using Firebase UID
    const user = await getUserByFirebaseUid(data.userId)
    if (!user) {
      console.error("❌ User not found for Firebase UID:", data.userId)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("👤 Found user:", user.name)

    const sensorDataEntries = []

    // Process different types of sensor data
    if (data.bpm !== undefined) {
      console.log("💓 Processing heart rate data:", data.bpm)
      const heartRateData = await insertSensorData({
        user_id: user.id,
        data_type: "heartRate",
        value: data.bpm,
        signal_quality: data.signal,
        metadata: {
          timestamp: data.timestamp,
          deviceId: data.deviceId,
          ...data.metadata,
        },
      })
      sensorDataEntries.push(heartRateData)

      // Check for heart rate alerts
      if (data.bpm > 100) {
        console.log("⚠️ Creating heart rate warning alert")
        await createAlert({
          user_id: user.id,
          type: "warning",
          title: "Elevated Heart Rate Detected",
          description: `Heart rate of ${data.bpm} BPM detected for ${user.name}`,
        })
      } else if (data.bpm > 120) {
        console.log("🚨 Creating critical heart rate alert")
        await createAlert({
          user_id: user.id,
          type: "critical",
          title: "Critical Heart Rate Alert",
          description: `Dangerously high heart rate of ${data.bpm} BPM detected for ${user.name}`,
        })
      }
    }

    if (data.eegAlpha !== undefined) {
      console.log("🧠 Processing EEG data:", data.eegAlpha)
      const eegData = await insertSensorData({
        user_id: user.id,
        data_type: "eeg",
        value: data.eegAlpha,
        signal_quality: data.signal,
        metadata: {
          timestamp: data.timestamp,
          deviceId: data.deviceId,
          ...data.metadata,
        },
      })
      sensorDataEntries.push(eegData)

      // Check for EEG alerts
      if (data.eegAlpha < 7) {
        console.log("⚠️ Creating EEG warning alert")
        await createAlert({
          user_id: user.id,
          type: "warning",
          title: "Low Alpha Wave Activity",
          description: `EEG Alpha waves at ${data.eegAlpha} Hz detected for ${user.name} - possible stress indicator`,
        })
      }
    }

    if (data.ecgSignal !== undefined) {
      console.log("📈 Processing ECG data:", data.ecgSignal)
      const ecgData = await insertSensorData({
        user_id: user.id,
        data_type: "ecg",
        value: data.ecgSignal,
        signal_quality: data.signal,
        metadata: {
          timestamp: data.timestamp,
          deviceId: data.deviceId,
          ...data.metadata,
        },
      })
      sensorDataEntries.push(ecgData)

      // Check for ECG signal quality alerts
      if (data.ecgSignal < 70) {
        console.log("⚠️ Creating ECG signal quality alert")
        await createAlert({
          user_id: user.id,
          type: "warning",
          title: "Poor ECG Signal Quality",
          description: `ECG signal quality at ${data.ecgSignal}% for ${user.name} - check sensor connection`,
        })
      }
    }

    console.log("✅ MQTT data processed successfully:", {
      user: user.name,
      entriesCreated: sensorDataEntries.length,
    })

    return NextResponse.json({
      success: true,
      message: "Data processed successfully",
      entriesCreated: sensorDataEntries.length,
      user: user.name,
    })
  } catch (error) {
    console.error("❌ Error processing MQTT data:", error)
    return NextResponse.json(
      {
        error: "Failed to process MQTT data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
