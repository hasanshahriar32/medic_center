import { NextResponse } from "next/server"
import { clearOldData, getStoreStats } from "@/lib/realtime-store"

export async function POST() {
  try {
    const statsBefore = getStoreStats()
    
    // Clean up data older than 30 minutes
    clearOldData(30)
    
    const statsAfter = getStoreStats()
    
    return NextResponse.json({
      success: true,
      message: "Cleanup completed successfully",
      before: statsBefore,
      after: statsAfter,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error during cleanup:", error)
    return NextResponse.json(
      { error: "Failed to cleanup real-time data" }, 
      { status: 500 }
    )
  }
}

// Auto cleanup endpoint - can be called by cron jobs
export async function GET() {
  try {
    clearOldData(30)
    const stats = getStoreStats()
    
    return NextResponse.json({
      success: true,
      message: "Auto cleanup completed",
      stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error during auto cleanup:", error)
    return NextResponse.json(
      { error: "Failed to auto cleanup" }, 
      { status: 500 }
    )
  }
}
