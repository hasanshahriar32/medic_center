import { type NextRequest, NextResponse } from "next/server"
import { getLatestSensorData, getAllUsers } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    console.log("📡 API: Getting latest MQTT data...")

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (userId) {
      console.log("👤 Getting data for specific user:", userId)
      const latestData = await getLatestSensorData(userId)
      console.log("📊 Latest data for user:", latestData)
      return NextResponse.json(latestData)
    } else {
      console.log("👥 Getting data for all users...")
      const users = await getAllUsers()
      console.log("👥 Found users:", users.length)

      const allLatestData = await Promise.all(
        users.map(async (user) => {
          const latestData = await getLatestSensorData(user.id)
          const formattedData = latestData.reduce((acc, data) => {
            acc[data.data_type] = data
            return acc
          }, {} as any)

          console.log(`📊 User ${user.name} latest data:`, formattedData)

          return {
            user,
            latestData: formattedData,
          }
        }),
      )

      console.log("✅ All latest data compiled:", allLatestData.length, "users")
      return NextResponse.json(allLatestData)
    }
  } catch (error) {
    console.error("❌ Error fetching latest MQTT data:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch latest data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
