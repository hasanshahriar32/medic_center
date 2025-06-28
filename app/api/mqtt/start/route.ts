import { NextResponse } from "next/server"
import { initializeMQTTClient } from "@/lib/mqtt-client"

export async function POST() {
  try {
    const client = initializeMQTTClient()

    return NextResponse.json({
      success: true,
      message: "MQTT client initialized and listening for data",
    })
  } catch (error) {
    console.error("Error starting MQTT client:", error)
    return NextResponse.json({ error: "Failed to start MQTT client" }, { status: 500 })
  }
}
