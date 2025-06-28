import mqtt from "mqtt"

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
}

export function initializeMQTTClient() {
  if (mqttClient) {
    return mqttClient
  }

  const mqttUrl = `mqtts://${process.env.MQTT_SERVER}:${process.env.MQTT_PORT}`
  const mqttOptions = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  }

  mqttClient = mqtt.connect(mqttUrl, mqttOptions)

  mqttClient.on("connect", () => {
    console.log("Connected to HiveMQ Cloud MQTT broker")

    // Subscribe to multiple topics for different data types
    const topics = ["mrhasan/heart", "mrhasan/eeg", "mrhasan/ecg", "mrhasan/vitals"]

    topics.forEach((topic) => {
      mqttClient?.subscribe(topic, (err) => {
        if (err) {
          console.error(`MQTT subscribe error for ${topic}:`, err)
        } else {
          console.log("Subscribed to topic:", topic)
        }
      })
    })
  })

  mqttClient.on("message", async (topic, message) => {
    try {
      const data: MQTTData = JSON.parse(message.toString())
      console.log("Received MQTT data:", { topic, data })

      // Process and store the data
      await processMQTTData(data)
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
    const response = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/mqtt/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      console.error("Failed to process MQTT data:", response.statusText)
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
