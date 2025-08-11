"use client"

import { useEffect, useState } from "react"

interface RealTimeData {
  userId: string
  dataType: string
  bpm?: number
  hp?: number
  threshold?: number
  baselineHR?: number
  rmssd?: number
  hrTrend?: number
  ecgSignal?: number
  signal?: number
  timestamp: string
  deviceId?: string
}

interface DisplayData {
  heartRate: number
  ecgSignal: number
  eegAlpha: number // Set to 0 since we removed EEG functionality
  hp: number
  threshold: number
  baselineHR: number
  rmssd: number
  hrTrend: number
  anxietyLevel: "Low" | "Medium" | "High"
  lastUpdate: Date
  userId?: string
}

interface RealTimeResponse {
  success: boolean
  data: Record<string, Record<string, RealTimeData>>
  subscribers: number
  timestamp: string
}

export function useRealTimeData() {
  const [realTimeData, setRealTimeData] = useState<DisplayData>({
    heartRate: 0,
    ecgSignal: 0,
    eegAlpha: 0, // Removed EEG functionality
    hp: 0,
    threshold: 8,
    baselineHR: 70,
    rmssd: 0,
    hrTrend: 55,
    anxietyLevel: "Low",
    lastUpdate: new Date(),
  })
  const [rawData, setRawData] = useState<Record<string, Record<string, RealTimeData>>>({})
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected">("disconnected")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Start MQTT processing
    initializeMQTT()

    // Fetch data more frequently for real-time updates (500ms)
    const interval = setInterval(() => {
      fetchLatestData()
    }, 500)

    // Cleanup old data periodically (every 5 minutes)
    const cleanupInterval = setInterval(() => {
      fetch("/api/realtime?cleanup=true").catch(console.error)
    }, 5 * 60 * 1000)

    return () => {
      clearInterval(interval)
      clearInterval(cleanupInterval)
    }
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
      const response = await fetch("/api/realtime", {
        cache: 'no-store', // Ensure we get fresh data
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch real-time data`)
      }
      
      const result: RealTimeResponse = await response.json()
      
      if (result.success && result.data) {
        console.log("Received real-time data:", result.data)
        setRawData(result.data)
        setConnectionStatus("connected")
        
        // Process the first user's data for display (or specific user if needed)
        const userIds = Object.keys(result.data)
        if (userIds.length > 0) {
          const firstUserId = userIds[0]
          const userData = result.data[firstUserId]
          
          const heartRateData = userData.heartRate
          const ecgData = userData.ecg
          
          const heartRate = heartRateData?.bpm || 0
          const ecgSignal = ecgData?.ecgSignal || 0
          const hp = ecgData?.hp || 0
          const threshold = ecgData?.threshold || 8
          const baselineHR = heartRateData?.baselineHR || 70
          const rmssd = heartRateData?.rmssd || 0
          const hrTrend = heartRateData?.hrTrend || 55
          
          // Calculate anxiety level based on physiological data (removed EEG dependency)
          let anxietyLevel: "Low" | "Medium" | "High" = "Low"
          if (heartRate > 100 || hp < 5) {
            anxietyLevel = "High"
          } else if (heartRate > 85 || hp < 10) {
            anxietyLevel = "Medium"
          }

          // Only update if data has actually changed
          setRealTimeData(prev => {
            if (prev.heartRate !== heartRate || 
                prev.ecgSignal !== ecgSignal || 
                prev.hp !== hp ||
                prev.anxietyLevel !== anxietyLevel) {
              return {
                heartRate,
                ecgSignal,
                eegAlpha: 0, // Removed EEG functionality
                hp,
                threshold,
                baselineHR,
                rmssd,
                hrTrend,
                anxietyLevel,
                lastUpdate: new Date(),
                userId: firstUserId,
              }
            }
            return prev
          })
        }
      }
      
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching real-time data:", error)
      setConnectionStatus("disconnected")
      setIsLoading(false)
    }
  }

  // Helper functions
  const getHeartRate = (userId?: string) => {
    if (!userId) {
      return realTimeData.heartRate
    }
    return rawData[userId]?.heartRate?.bpm || 0
  }

  const getAllUsers = () => {
    return Object.keys(rawData)
  }

  const getUserData = (userId: string) => {
    return rawData[userId] || {}
  }

  return {
    realTimeData,
    rawData,
    connectionStatus,
    isLoading,
    refreshData: fetchLatestData,
    getHeartRate,
    getAllUsers,
    getUserData,
  }
}
