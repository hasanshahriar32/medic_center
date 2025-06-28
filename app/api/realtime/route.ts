import { type NextRequest, NextResponse } from "next/server"
import { getRealTimeData, getDataHistory, getStoreStats, clearOldData } from "@/lib/realtime-store"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const includeHistory = searchParams.get("history") === "true"
    const cleanup = searchParams.get("cleanup") === "true"

    // Clean up old data if requested
    if (cleanup) {
      clearOldData(30) // Remove data older than 30 minutes
    }

    const data = getRealTimeData(userId || undefined)
    const history = includeHistory && userId ? getDataHistory(userId) : undefined
    const stats = getStoreStats()
    
    return NextResponse.json({
      success: true,
      data,
      history,
      stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching real-time data:", error)
    return NextResponse.json({ error: "Failed to fetch real-time data" }, { status: 500 })
  }
}
