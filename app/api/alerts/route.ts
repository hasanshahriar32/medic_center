import { type NextRequest, NextResponse } from "next/server"
import { getActiveAlerts, createAlert, updateAlertStatus } from "@/lib/database"

export async function GET() {
  try {
    const alerts = await getActiveAlerts()
    return NextResponse.json(alerts)
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const alertData = await request.json()
    const alert = await createAlert(alertData)
    return NextResponse.json(alert)
  } catch (error) {
    console.error("Error creating alert:", error)
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { alert_id, status } = await request.json()
    const alert = await updateAlertStatus(alert_id, status)
    return NextResponse.json(alert)
  } catch (error) {
    console.error("Error updating alert:", error)
    return NextResponse.json({ error: "Failed to update alert" }, { status: 500 })
  }
}
