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
        message: "MQTT client started successfully",
        connected: client.connected,
      })
    } else {
      console.log("⚠️ MQTT client initialization in progress")
      return NextResponse.json({
        success: true,
        message: "MQTT client initialization in progress",
      })
    }
  } catch (error) {
    console.error("❌ Failed to start MQTT client:", error)
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
