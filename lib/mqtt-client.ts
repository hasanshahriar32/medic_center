import mqtt from "mqtt"
import { getUserByFirebaseUid, insertSensorData, createAlert } from "@/lib/database"

let mqttClient: mqtt.MqttClient | null = null

export interface MQTTData {
  userId: string
  dataType: "eeg" | "ecg" | "heartRate" | "bloodPressure" | "temperature"
  bpm?: number
  signal?: number
  eegAlpha?: number
  ecgSignal?: number
  timestamp?: string
  metadata?: any
  deviceId?: string
}

export async function initializeMQTTClient() {
  if (mqttClient?.connected) {
    console.log("♻️ MQTT client already connected")
    return mqttClient
  }

  console.log("🔌 Creating new MQTT client...")
  console.log("🌐 MQTT Server:", process.env.MQTT_SERVER)
  console.log("🔌 MQTT Port:", process.env.MQTT_PORT)
  console.log("👤 MQTT Username:", process.env.MQTT_USERNAME ? "Set" : "Not set")

  const mqttUrl = `mqtts://${process.env.MQTT_SERVER}:${process.env.MQTT_PORT}`
  const mqttOptions: mqtt.IClientOptions = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    connectTimeout: 60000,
    reconnectPeriod: 5000,
    protocol: "mqtts" as const,
    port: Number.parseInt(process.env.MQTT_PORT || "8883"),
  }

  console.log("🔗 Connecting to:", mqttUrl)

  mqttClient = mqtt.connect(mqttUrl, mqttOptions)

  return new Promise<mqtt.MqttClient>((resolve, reject) => {
    if (!mqttClient) {
      reject(new Error("Failed to create MQTT client"))
      return
    }

    mqttClient.on("connect", () => {
      console.log("✅ Connected to HiveMQ Cloud MQTT broker")

      // Subscribe to multiple topics for different data types
      const topics = ["mrhasan/heart", "mrhasan/eeg", "mrhasan/ecg", "mrhasan/vitals"]

      topics.forEach((topic) => {
        mqttClient?.subscribe(topic, (err) => {
          if (err) {
            console.error(`❌ MQTT subscribe error for ${topic}:`, err)
          } else {
            console.log("✅ Subscribed to topic:", topic)
          }
        })
      })

      resolve(mqttClient)
    })

    mqttClient.on("message", async (topic, message) => {
      try {
        const data: MQTTData = JSON.parse(message.toString())
        console.log("📨 Received MQTT data:", { topic, data })

        // Process and store the data directly
        await processMQTTDataDirect(data)
      } catch (e) {
        console.error("❌ Invalid MQTT message:", message.toString(), e)
      }
    })

    mqttClient.on("error", (err) => {
      console.error("❌ MQTT error:", err)
      reject(err)
    })

    mqttClient.on("disconnect", () => {
      console.log("🔌 MQTT client disconnected")
    })

    mqttClient.on("reconnect", () => {
      console.log("🔄 MQTT client reconnecting...")
    })

    mqttClient.on("offline", () => {
      console.log("📴 MQTT client offline")
    })

    // Timeout after 60 seconds
    setTimeout(() => {
      reject(new Error("MQTT connection timeout"))
    }, 60000)
  })
}

async function processMQTTDataDirect(data: MQTTData) {
  try {
    console.log("⚙️ Processing MQTT data directly:", data)

    // Get user from database using Firebase UID
    const user = await getUserByFirebaseUid(data.userId)
    if (!user) {
      console.error("❌ User not found for Firebase UID:", data.userId)
      return
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
  } catch (error) {
    console.error("❌ Error processing MQTT data directly:", error)
  }
}

export function getMQTTClient() {
  return mqttClient
}

export function disconnectMQTT() {
  if (mqttClient) {
    console.log("🛑 Disconnecting MQTT client...")
    mqttClient.end()
    mqttClient = null
  }
}
