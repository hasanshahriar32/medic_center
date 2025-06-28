import mqtt from "mqtt"
import { insertSensorData, getUserByFirebaseUid, createAlert } from "./database"

let mqttClient: mqtt.MqttClient | null = null
let isConnecting = false

interface MQTTData {
  userId: string
  dataType: string
  bpm?: number
  signal?: number
  value?: number
  timestamp: string
  deviceId?: string
  [key: string]: any
}

export async function initializeMQTTClient() {
  if (mqttClient?.connected) {
    console.log("🔌 MQTT client already connected")
    return mqttClient
  }

  if (isConnecting) {
    console.log("⏳ MQTT client connection in progress...")
    return null
  }

  try {
    isConnecting = true
    console.log("🔌 Creating new MQTT client...")

    const server = process.env.MQTT_SERVER
    const port = process.env.MQTT_PORT
    const username = process.env.MQTT_USERNAME
    const password = process.env.MQTT_PASSWORD

    console.log("🌐 MQTT Server:", server)
    console.log("🔌 MQTT Port:", port)
    console.log("👤 MQTT Username:", username ? "Set" : "Not set")

    if (!server || !port || !username || !password) {
      throw new Error("Missing MQTT configuration")
    }

    const brokerUrl = `mqtts://${server}:${port}`
    console.log("🔗 Connecting to:", brokerUrl)

    mqttClient = mqtt.connect(brokerUrl, {
      username,
      password,
      protocol: "mqtts",
      port: Number.parseInt(port),
      clean: true,
      connectTimeout: 30000,
      reconnectPeriod: 5000,
      keepalive: 60,
    })

    return new Promise((resolve, reject) => {
      if (!mqttClient) {
        reject(new Error("Failed to create MQTT client"))
        return
      }

      mqttClient.on("connect", () => {
        console.log("✅ Connected to HiveMQ Cloud MQTT broker")
        isConnecting = false

        // Subscribe to topics
        const topics = ["mrhasan/heart", "mrhasan/eeg", "mrhasan/ecg", "mrhasan/vitals"]
        topics.forEach((topic) => {
          mqttClient?.subscribe(topic, (err) => {
            if (err) {
              console.error(`❌ Failed to subscribe to ${topic}:`, err)
            } else {
              console.log(`✅ Subscribed to topic: ${topic}`)
            }
          })
        })

        resolve(mqttClient)
      })

      mqttClient.on("message", async (topic, message) => {
        try {
          const data = JSON.parse(message.toString()) as MQTTData
          console.log("📨 Received MQTT data:", { topic, data })

          await processMQTTData(data)
        } catch (error) {
          console.error("❌ Error processing MQTT message:", error)
        }
      })

      mqttClient.on("error", (error) => {
        console.error("❌ MQTT connection error:", error)
        isConnecting = false
        reject(error)
      })

      mqttClient.on("offline", () => {
        console.log("📴 MQTT client offline")
      })

      mqttClient.on("reconnect", () => {
        console.log("🔄 MQTT client reconnecting...")
      })

      // Timeout after 30 seconds
      setTimeout(() => {
        if (isConnecting) {
          isConnecting = false
          reject(new Error("MQTT connection timeout"))
        }
      }, 30000)
    })
  } catch (error) {
    console.error("❌ Failed to initialize MQTT client:", error)
    isConnecting = false
    throw error
  }
}

async function processMQTTData(data: MQTTData) {
  try {
    console.log("🔄 Processing MQTT data:", data)

    // Find user by Firebase UID
    const user = await getUserByFirebaseUid(data.userId)
    if (!user) {
      console.error("❌ User not found for Firebase UID:", data.userId)
      return
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
        deviceId: data.deviceId,
        timestamp: data.timestamp,
        rawData: data,
      },
    })

    console.log("✅ MQTT data processed successfully:", sensorData.id)

    // Check for alerts based on thresholds
    await checkAndCreateAlerts(user.id, data.dataType, value)
  } catch (error) {
    console.error("❌ Error processing MQTT data:", error)
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

export function getMQTTClient() {
  return mqttClient
}

export function disconnectMQTT() {
  if (mqttClient) {
    mqttClient.end()
    mqttClient = null
    console.log("🔌 MQTT client disconnected")
  }
}
