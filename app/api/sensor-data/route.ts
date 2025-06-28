import { type NextRequest, NextResponse } from "next/server"

// This endpoint is deprecated - IoT data now streams directly via MQTT
// and is stored in-memory for real-time access only
export async function POST(request: NextRequest) {
  return NextResponse.json({
    error: "This endpoint is deprecated. IoT data now streams directly via MQTT processing.",
    message: "Use the MQTT processing endpoint at /api/mqtt/process instead.",
    realTimeEndpoint: "/api/realtime"
  }, { status: 410 }) // 410 Gone - resource no longer available
}
