import { NextResponse } from "next/server";
import { getCacheStats, clearUserCache } from "@/lib/user-cache";

export async function GET() {
  try {
    const stats = getCacheStats();
    return NextResponse.json({
      status: "ok",
      cache: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error getting cache stats:", error);
    return NextResponse.json(
      { error: "Failed to get cache stats" }, 
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    clearUserCache();
    return NextResponse.json({
      status: "cache cleared",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error clearing cache:", error);
    return NextResponse.json(
      { error: "Failed to clear cache" }, 
      { status: 500 }
    );
  }
}
