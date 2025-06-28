"use client"

import { Badge } from "@/components/ui/badge"
import { usePWA } from "@/hooks/usePWA"
import { Wifi, WifiOff, Smartphone, Monitor, Bell } from "lucide-react"

export function PWAStatus() {
  const { isOnline, isStandalone, isInstalled } = usePWA()

  return (
    <div className="flex items-center gap-2">
      {/* Online/Offline Status */}
      <div className="flex items-center gap-1">
        {isOnline ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
        <span className="text-xs text-gray-500">{isOnline ? "Online" : "Offline"}</span>
      </div>

      {/* Installation Status */}
      {(isInstalled || isStandalone) && (
        <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
          {isStandalone ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
          PWA
        </Badge>
      )}

      {/* Notification Status */}
      {typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted" && (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <Bell className="w-3 h-3" />
          Notifications
        </Badge>
      )}
    </div>
  )
}
