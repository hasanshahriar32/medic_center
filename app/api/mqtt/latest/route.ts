import { NextResponse } from "next/server"
import { getAllUsers, getLatestSensorData } from "@/lib/database"

export async function GET() {
  try {
    console.log("📡 API: Getting latest MQTT data...")

    // Get all users
    console.log("👥 Getting data for all users...")
    const users = await getAllUsers()

    if (!users || users.length === 0) {
      console.log("❌ No users found")
      return NextResponse.json({ error: "No users found" }, { status: 404 })
    }

    const allUserData = []

    // Get latest sensor data for each user
    for (const user of users) {
      console.log(`📊 Getting sensor data for user: ${user.name} (${user.id})`)

      try {
        const sensorData = await getLatestSensorData(user.id)
        console.log(`✅ Found ${sensorData.length} sensor entries for ${user.name}`)

        const userData = {
          user: {
            id: user.id,
            firebase_uid: user.firebase_uid,
            name: user.name,
            email: user.email,
          },
          sensorData: sensorData || [],
          lastUpdated: new Date().toISOString(),
        }

        allUserData.push(userData)
      } catch (error) {
        console.error(`❌ Error getting sensor data for user ${user.name}:`, error)
        // Continue with other users even if one fails
        allUserData.push({
          user: {
            id: user.id,
            firebase_uid: user.firebase_uid,
            name: user.name,
            email: user.email,
          },
          sensorData: [],
          lastUpdated: new Date().toISOString(),
          error: "Failed to fetch sensor data",
        })
      }
    }

    console.log("✅ Latest MQTT data compiled successfully")
    return NextResponse.json({
      success: true,
      data: allUserData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error fetching latest MQTT data:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch latest MQTT data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
