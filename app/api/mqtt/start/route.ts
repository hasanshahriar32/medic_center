import { NextResponse } from "next/server"
import { initializeMQTTClient } from "@/lib/mqtt-client"

export async function POST() {
  try {
    console.log("🚀 Starting MQTT client...")
    const client = await initializeMQTTClient()

    if (client) {
      console.log("✅ MQTT client started successfully")
      return NextResponse.json({
        success: true,
        message: "MQTT client initialized successfully",
        connected: client.connected,
      })
    } else {
      console.log("❌ Failed to start MQTT client")
      return NextResponse.json(
        {
          success: false,
          message: "Failed to initialize MQTT client",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ Error starting MQTT client:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to start MQTT client",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
