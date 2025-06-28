"use client"

import { useEffect, useState } from "react"

interface RealTimeData {
  heartRate: number
  eegAlpha: number
  ecgSignal: number
  anxietyLevel: "Low" | "Medium" | "High"
  lastUpdate: Date
  userId?: string
}

interface UserData {
  user: any
  latestData: {
    heartRate?: any
    eeg?: any
    ecg?: any
  }
}

export function useRealTimeData() {
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    heartRate: 0,
    eegAlpha: 0,
    ecgSignal: 0,
    anxietyLevel: "Low",
    lastUpdate: new Date(),
  })
  const [allUsersData, setAllUsersData] = useState<UserData[]>([])
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected">("disconnected")

  useEffect(() => {
    // Initialize MQTT client on the server
    initializeMQTT()

    // Poll for latest data every 2 seconds
    const interval = setInterval(() => {
      fetchLatestData()
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const initializeMQTT = async () => {
    try {
      const response = await fetch("/api/mqtt/start", {
        method: "POST",
      })

      if (response.ok) {
        setConnectionStatus("connected")
        console.log("MQTT client initialized")
      } else {
        setConnectionStatus("disconnected")
        console.error("Failed to initialize MQTT client")
      }
    } catch (error) {
      console.error("Error initializing MQTT:", error)
      setConnectionStatus("disconnected")
    }
  }

  const fetchLatestData = async () => {
    try {
      const response = await fetch("/api/mqtt/latest")
      const data: UserData[] = await response.json()

      setAllUsersData(data)

      // Calculate aggregate real-time data from all users
      if (data.length > 0) {
        const latestUserData = data[0] // Use first user's data for main display
        const heartRate = latestUserData.latestData.heartRate?.value || 0
        const eegAlpha = latestUserData.latestData.eeg?.value || 0
        const ecgSignal = latestUserData.latestData.ecg?.signal_quality || 0

        // Calculate anxiety level based on heart rate and EEG
        let anxietyLevel: "Low" | "Medium" | "High" = "Low"
        if (heartRate > 100 || eegAlpha < 7) {
          anxietyLevel = "High"
        } else if (heartRate > 85 || eegAlpha < 8) {
          anxietyLevel = "Medium"
        }

        setRealTimeData({
          heartRate,
          eegAlpha,
          ecgSignal,
          anxietyLevel,
          lastUpdate: new Date(),
          userId: latestUserData.user.firebase_uid,
        })
      }
    } catch (error) {
      console.error("Error fetching latest data:", error)
      setConnectionStatus("disconnected")
    }
  }

  return {
    realTimeData,
    allUsersData,
    connectionStatus,
    refreshData: fetchLatestData,
  }
}
