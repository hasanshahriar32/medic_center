"use client"

import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"

interface MQTTData {
  userId: string
  dataType: "eeg" | "ecg" | "heartRate"
  bpm?: number
  signal?: number
  eegAlpha?: number
  ecgSignal?: number
  timestamp: string
}

interface RealTimeData {
  heartRate: number
  eegAlpha: number
  ecgSignal: number
  anxietyLevel: "Low" | "Medium" | "High"
  lastUpdate: Date
  userId?: string
}

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    heartRate: 0,
    eegAlpha: 0,
    ecgSignal: 0,
    anxietyLevel: "Low",
    lastUpdate: new Date(),
  })
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected">("disconnected")

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001")

    socketInstance.on("connect", () => {
      console.log("Connected to socket server")
      setConnectionStatus("connected")
    })

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from socket server")
      setConnectionStatus("disconnected")
    })

    // Listen for MQTT data
    socketInstance.on("mqtt-data", async (data: MQTTData) => {
      console.log("Received MQTT data:", data)

      // Update real-time data state
      setRealTimeData((prev) => {
        const newData = { ...prev }

        if (data.bpm !== undefined) {
          newData.heartRate = data.bpm
        }

        if (data.eegAlpha !== undefined) {
          newData.eegAlpha = data.eegAlpha
        }

        if (data.ecgSignal !== undefined) {
          newData.ecgSignal = data.ecgSignal
        }

        // Calculate anxiety level based on heart rate and EEG
        if (newData.heartRate > 100 || newData.eegAlpha < 7) {
          newData.anxietyLevel = "High"
        } else if (newData.heartRate > 85 || newData.eegAlpha < 8) {
          newData.anxietyLevel = "Medium"
        } else {
          newData.anxietyLevel = "Low"
        }

        newData.lastUpdate = new Date()
        newData.userId = data.userId

        return newData
      })

      // Send data to API for database storage
      try {
        await fetch("/api/sensor-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
      } catch (error) {
        console.error("Error saving sensor data:", error)
      }
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return {
    socket,
    realTimeData,
    connectionStatus,
  }
}
