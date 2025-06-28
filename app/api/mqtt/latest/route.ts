import { NextResponse } from "next/server"
import { getUsersWithLatestSensorData } from "@/lib/database"

export async function GET() {
  try {
    console.log("📡 Fetching latest MQTT data...")

    const usersWithData = await getUsersWithLatestSensorData()

    console.log("📊 Retrieved data for", usersWithData.length, "users")

    return NextResponse.json({
      success: true,
      data: usersWithData,
      timestamp: new Date().toISOString(),
      count: usersWithData.length,
    })
  } catch (error) {
    console.error("❌ Error fetching latest MQTT data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch latest data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
