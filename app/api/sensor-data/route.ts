import { type NextRequest, NextResponse } from "next/server"
import { insertSensorData, getUserByFirebaseUid } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { userId, dataType, bpm, signal, eegAlpha, ecgSignal, metadata } = await request.json()

    // Get user from database using Firebase UID
    const user = await getUserByFirebaseUid(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const sensorDataEntries = []

    // Insert heart rate data
    if (bpm !== undefined) {
      const heartRateData = await insertSensorData({
        user_id: user.id,
        data_type: "heartRate",
        value: bpm,
        signal_quality: signal,
        metadata,
      })
      sensorDataEntries.push(heartRateData)
    }

    // Insert EEG data
    if (eegAlpha !== undefined) {
      const eegData = await insertSensorData({
        user_id: user.id,
        data_type: "eeg",
        value: eegAlpha,
        signal_quality: signal,
        metadata,
      })
      sensorDataEntries.push(eegData)
    }

    // Insert ECG data
    if (ecgSignal !== undefined) {
      const ecgData = await insertSensorData({
        user_id: user.id,
        data_type: "ecg",
        value: ecgSignal,
        signal_quality: signal,
        metadata,
      })
      sensorDataEntries.push(ecgData)
    }

    return NextResponse.json({ success: true, data: sensorDataEntries })
  } catch (error) {
    console.error("Error inserting sensor data:", error)
    return NextResponse.json({ error: "Failed to insert sensor data" }, { status: 500 })
  }
}
