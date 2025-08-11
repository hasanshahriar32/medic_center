import mqtt from "mqtt"

let mqttClient: mqtt.MqttClient | null = null

export interface MQTTData {
  userId: string
  dataType: "ecg_analysis" | "ecg" | "heartRate" | "bloodPressure" | "temperature"
  bpm?: number
  signal?: number
  hp?: number
  threshold?: number
  baselineHR?: number
  rmssd?: number
  hrTrend?: number
  ecgSignal?: number
  timestamp?: string
  deviceId?: string
  metadata?: any
}

export function initializeMQTTClient() {
  if (mqttClient) {
    return mqttClient
  }

  // HiveMQ Configuration (hardcoded as requested)
  const MQTT_BROKER = 'd5e9ca698a2a4640b81af8b8e3e6e1e4.s1.eu.hivemq.cloud'
  const MQTT_PORT = 8883
  const MQTT_USERNAME = 'Paradox'
  const MQTT_PASSWORD = 'Paradox1'

  const mqttUrl = `mqtts://${MQTT_BROKER}:${MQTT_PORT}`
  const mqttOptions = {
    clientId: `ecg_webapp_${Math.random().toString(16).substr(2, 8)}`,
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
    rejectUnauthorized: false, // For testing only
  }

  mqttClient = mqtt.connect(mqttUrl, mqttOptions)

  mqttClient.on("connect", () => {
    console.log("Connected to HiveMQ Cloud MQTT broker")

    // Subscribe to ECG data topic (matching the demo data structure)
    const topic = "mrhasan/heart"

    mqttClient?.subscribe(topic, (err) => {
      if (err) {
        console.error(`MQTT subscribe error for ${topic}:`, err)
      } else {
        console.log("Subscribed to topic:", topic)
      }
    })
  })

  mqttClient.on("message", async (topic, message) => {
    try {
      const data: MQTTData = JSON.parse(message.toString())
      console.log("Received MQTT data:", { topic, data })

      // Process ECG analysis data
      if (data.dataType === 'ecg_analysis') {
        // Enhance the data with normalized HP signal for better visualization
        const enhancedData = {
          ...data,
          ecgSignal: data.hp ? (data.hp / 10) : 0, // Normalize HP for ECG signal display
          receivedAt: new Date().toISOString()
        }

        // Process and store the data
        await processMQTTData(enhancedData)
      } else {
        // Process other data types normally
        await processMQTTData(data)
      }
    } catch (e) {
      console.error("Invalid MQTT message:", message.toString(), e)
    }
  })

  mqttClient.on("error", (err) => {
    console.error("MQTT error:", err)
  })

  mqttClient.on("disconnect", () => {
    console.log("MQTT client disconnected")
  })

  return mqttClient
}

async function processMQTTData(data: MQTTData) {
  try {
    // Send data to our API endpoint for processing and storage  
    const response = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:10000"}/api/mqtt/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      console.error("Failed to process MQTT data:", response.statusText)
    } else {
      console.log("Successfully processed MQTT data")
    }
  } catch (error) {
    console.error("Error processing MQTT data:", error)
  }
}

export function getMQTTClient() {
  return mqttClient
}

export function disconnectMQTT() {
  if (mqttClient) {
    mqttClient.end()
    mqttClient = null
  }
}
