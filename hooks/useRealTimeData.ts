"use client"

import { useState, useEffect, useCallback } from "react"

interface SensorData {
  id: string
  user_id: string
  data_type: string
  value: number
  signal_quality?: number
  created_at: string
  metadata?: any
}

interface UserData {
  user: {
    id: string
    firebase_uid: string
    name: string
    email: string
  }
  sensorData: SensorData[]
}

interface RealTimeData {
  heartRate?: number
  eegAlpha?: number
  ecgSignal?: number
  signalQuality?: number
  lastUpdated?: string
  connectionStatus: "connecting" | "connected" | "disconnected" | "error"
}

export function useRealTimeData() {
  const [data, setData] = useState<RealTimeData>({
    connectionStatus: "connecting",
  })
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize MQTT client
  const initializeMQTT = useCallback(async () => {
    try {
      console.log("🚀 Initializing real-time data hook...")
      setData((prev) => ({ ...prev, connectionStatus: "connecting" }))

      console.log("🔌 Initializing MQTT client...")
      const response = await fetch("/api/mqtt/start", {
        method: "POST",
      })

      if (response.ok) {
        const result = await response.json()
        console.log("✅ MQTT client initialized successfully:", result)
        setData((prev) => ({ ...prev, connectionStatus: "connected" }))
      } else {
        console.error("❌ Failed to initialize MQTT client")
        setData((prev) => ({ ...prev, connectionStatus: "error" }))
      }
    } catch (error) {
      console.error("❌ Error initializing MQTT client:", error)
      setData((prev) => ({ ...prev, connectionStatus: "error" }))
    }
  }, [])

  // Fetch latest data
  const fetchLatestData = useCallback(async () => {
    try {
      console.log("📡 Fetching latest data...")
      const response = await fetch("/api/mqtt/latest")

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("📊 Received data:", result)

      if (result.success && result.data) {
        setUsers(result.data)

        // Process the latest sensor data for display
        const latestData: RealTimeData = {
          connectionStatus: "connected",
          lastUpdated: result.timestamp,
        }

        // Find the most recent data across all users
        for (const userData of result.data) {
          for (const sensor of userData.sensorData || []) {
            switch (sensor.data_type) {
              case "heartRate":
                console.log("💓 Heart Rate:", sensor.value, "BPM")
                latestData.heartRate = sensor.value
                latestData.signalQuality = sensor.signal_quality
                break
              case "eeg":
                console.log("🧠 EEG Alpha:", sensor.value, "Hz")
                latestData.eegAlpha = sensor.value
                break
              case "ecg":
                console.log("📈 ECG Signal:", sensor.value, "%")
                latestData.ecgSignal = sensor.value
                break
            }
          }
        }

        setData(latestData)
        setError(null)
      } else {
        throw new Error(result.error || "No data received")
      }
    } catch (error) {
      console.error("❌ Error fetching latest data:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch data")
      setData((prev) => ({ ...prev, connectionStatus: "error" }))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initialize on mount
  useEffect(() => {
    initializeMQTT()
  }, [initializeMQTT])

  // Poll for latest data every 2 seconds
  useEffect(() => {
    const interval = setInterval(fetchLatestData, 2000)

    // Initial fetch
    fetchLatestData()

    return () => clearInterval(interval)
  }, [fetchLatestData])

  return {
    data,
    users,
    isLoading,
    error,
    refetch: fetchLatestData,
    initializeMQTT,
  }
}
