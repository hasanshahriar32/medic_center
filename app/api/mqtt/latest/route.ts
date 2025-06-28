import { type NextRequest, NextResponse } from "next/server"
import { getLatestSensorData, getAllUsers } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (userId) {
      // Get latest data for specific user
      const latestData = await getLatestSensorData(userId)
      return NextResponse.json(latestData)
    } else {
      // Get latest data for all users
      const users = await getAllUsers()
      const allLatestData = await Promise.all(
        users.map(async (user) => {
          const latestData = await getLatestSensorData(user.id)
          return {
            user,
            latestData: latestData.reduce((acc, data) => {
              acc[data.data_type] = data
              return acc
            }, {} as any),
          }
        }),
      )
      return NextResponse.json(allLatestData)
    }
  } catch (error) {
    console.error("Error fetching latest MQTT data:", error)
    return NextResponse.json({ error: "Failed to fetch latest data" }, { status: 500 })
  }
}
