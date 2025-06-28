"use client"

import { useState, useEffect, useCallback } from "react"

interface User {
  id: string
  firebase_uid: string
  email: string
  name: string
  created_at: string
}

interface SensorData {
  id: string
  user_id: string
  data_type: string
  value: number
  signal_quality?: number
  metadata?: any
  created_at: string
}

interface UserWithData {
  user: User
  latestData: Record<string, SensorData>
}

export function useRealTimeData() {
  const [data, setData] = useState<UserWithData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")

  const fetchLatestData = useCallback(async () => {
    try {
      console.log("📡 Fetching latest data...")
      const response = await fetch("/api/mqtt/latest")

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("📊 Received data:", result)

      if (Array.isArray(result)) {
        setData(result)
        setError(null)
        setConnectionStatus("connected")
      } else {
        console.error("❌ Invalid data format:", result)
        setError("Invalid data format received")
      }
    } catch (err) {
      console.error("❌ Failed to fetch latest data:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
      setConnectionStatus("disconnected")
    } finally {
      setLoading(false)
    }
  }, [])

  const initializeMQTT = useCallback(async () => {
    try {
      console.log("🔌 Initializing MQTT client...")
      const response = await fetch("/api/mqtt/start", { method: "POST" })

      if (!response.ok) {
        throw new Error(`Failed to start MQTT: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("✅ MQTT client initialized:", result)
      setConnectionStatus("connected")
    } catch (err) {
      console.error("❌ Failed to initialize MQTT:", err)
      setConnectionStatus("disconnected")
    }
  }, [])

  useEffect(() => {
    console.log("🚀 Initializing real-time data hook...")

    // Initialize MQTT client
    initializeMQTT()

    // Fetch initial data
    fetchLatestData()

    // Set up polling for real-time updates
    const interval = setInterval(fetchLatestData, 2000) // Poll every 2 seconds

    return () => {
      clearInterval(interval)
    }
  }, [fetchLatestData, initializeMQTT])

  // Helper functions to extract specific data types
  const getHeartRate = useCallback((userData: UserWithData) => {
    const heartRateData = userData.latestData.heartRate
    return heartRateData ? heartRateData.value : null
  }, [])

  const getEEGData = useCallback((userData: UserWithData) => {
    const eegData = userData.latestData.eeg
    return eegData ? eegData.value : null
  }, [])

  const getECGData = useCallback((userData: UserWithData) => {
    const ecgData = userData.latestData.ecg
    return ecgData ? ecgData.value : null
  }, [])

  const getSignalQuality = useCallback((userData: UserWithData, dataType: string) => {
    const sensorData = userData.latestData[dataType]
    return sensorData ? sensorData.signal_quality : null
  }, [])

  return {
    data,
    loading,
    error,
    connectionStatus,
    refetch: fetchLatestData,
    getHeartRate,
    getEEGData,
    getECGData,
    getSignalQuality,
  }
}
