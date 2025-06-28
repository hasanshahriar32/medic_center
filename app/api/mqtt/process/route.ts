import { type NextRequest, NextResponse } from "next/server"
import { insertSensorData, getUserByFirebaseUid, createAlert } from "@/lib/database"

interface MQTTData {
  userId: string
  dataType: "eeg" | "ecg" | "heartRate" | "bloodPressure" | "temperature"
  bpm?: number
  signal?: number
  eegAlpha?: number
  ecgSignal?: number
  timestamp?: string
  metadata?: any
  deviceId?: string
  value?: number
}

export async function POST(request: NextRequest) {
  try {
    const data: MQTTData = await request.json()
    console.log("📨 API: Processing MQTT data:", data)

    // Get user from database using Firebase UID
    const user = await getUserByFirebaseUid(data.userId)
    if (!user) {
      console.error("❌ User not found for Firebase UID:", data.userId)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("👤 Found user:", user.name)

    // Extract sensor value based on data type
    let value: number
    let signalQuality: number | undefined

    switch (data.dataType) {
      case "heartRate":
        value = data.bpm || data.value || 0
        signalQuality = data.signal
        break
      case "eeg":
      case "ecg":
        value = data.value || 0
        signalQuality = data.signal
        break
      default:
        value = data.value || 0
        signalQuality = data.signal
    }

    // Insert sensor data
    const sensorData = await insertSensorData({
      user_id: user.id,
      data_type: data.dataType,
      value,
      signal_quality: signalQuality,
      metadata: {
        timestamp: data.timestamp,
        deviceId: data.deviceId,
        ...data.metadata,
      },
    })

    console.log("✅ MQTT data processed successfully:", sensorData.id)

    // Check for alerts based on thresholds
    await checkAndCreateAlerts(user.id, data.dataType, value)

    return NextResponse.json({
      success: true,
      sensorDataId: sensorData.id,
    })
  } catch (error) {
    console.error("❌ Error processing MQTT data via API:", error)
    return NextResponse.json(
      {
        error: "Failed to process MQTT data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function checkAndCreateAlerts(userId: string, dataType: string, value: number) {
  try {
    let alertType: "info" | "warning" | "critical" | null = null
    let title = ""
    let description = ""

    switch (dataType) {
      case "heartRate":
        if (value > 100) {
          alertType = value > 120 ? "critical" : "warning"
          title = "High Heart Rate Detected"
          description = `Heart rate is ${value} BPM, which is ${value > 120 ? "critically" : "moderately"} elevated.`
        } else if (value < 60) {
          alertType = value < 50 ? "critical" : "warning"
          title = "Low Heart Rate Detected"
          description = `Heart rate is ${value} BPM, which is ${value < 50 ? "critically" : "moderately"} low.`
        }
        break

      case "eeg":
        if (value > 50) {
          alertType = "warning"
          title = "Unusual EEG Activity"
          description = `EEG reading of ${value} μV detected, which may indicate heightened brain activity.`
        }
        break

      case "ecg":
        if (value > 2.0 || value < -2.0) {
          alertType = "critical"
          title = "Abnormal ECG Reading"
          description = `ECG amplitude of ${value} mV is outside normal range and requires immediate attention.`
        }
        break
    }

    if (alertType) {
      await createAlert({
        user_id: userId,
        type: alertType,
        title,
        description,
      })
      console.log(`🚨 ${alertType.toUpperCase()} alert created: ${title}`)
    }
  } catch (error) {
    console.error("❌ Error checking alerts:", error)
  }
}
