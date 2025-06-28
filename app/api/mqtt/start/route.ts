import { NextResponse } from "next/server"
import { initializeMQTTClient } from "@/lib/mqtt-client"

export async function POST() {
  try {
    console.log("🚀 Starting MQTT client...")

    const client = initializeMQTTClient()

    if (client) {
      console.log("✅ MQTT client started successfully")
      return NextResponse.json({
        success: true,
        message: "MQTT client initialized",
        status: "connected",
      })
    } else {
      console.error("❌ Failed to initialize MQTT client")
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
        message: "Error starting MQTT client",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
