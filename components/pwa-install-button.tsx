"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePWA } from "@/hooks/usePWA"
import { Download, Smartphone, Monitor, Share, Bell, Wifi, WifiOff, CheckCircle, X } from "lucide-react"

export function PWAInstallButton() {
  const { canInstall, isInstalled, isStandalone, isOnline, installApp, shareApp, requestNotificationPermission } =
    usePWA()

  const [installing, setInstalling] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleInstall = async () => {
    setInstalling(true)
    try {
      const success = await installApp()
      if (success) {
        console.log("App installed successfully")
      }
    } catch (error) {
      console.error("Installation failed:", error)
    } finally {
      setInstalling(false)
    }
  }

  const handleShare = async () => {
    try {
      await shareApp()
    } catch (error) {
      console.error("Share failed:", error)
    }
  }

  const handleNotifications = async () => {
    try {
      await requestNotificationPermission()
    } catch (error) {
      console.error("Notification permission failed:", error)
    }
  }

  // Don't show install button if already installed
  if (isInstalled || isStandalone) {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          App Installed
        </Badge>
        <div className="flex items-center gap-1">
          {isOnline ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
          <span className="text-xs text-gray-500">{isOnline ? "Online" : "Offline"}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Install Button */}
      {canInstall && (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleInstall}
            disabled={installing}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {installing ? "Installing..." : "Install App"}
          </Button>

          <Button variant="outline" onClick={() => setShowDetails(!showDetails)} className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            Why Install?
          </Button>

          <Button variant="outline" onClick={handleShare} className="flex items-center gap-2 bg-transparent">
            <Share className="w-4 h-4" />
            Share
          </Button>
        </div>
      )}

      {/* Installation Benefits */}
      {showDetails && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Install MedWatch AI
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">📱 Mobile Benefits</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Works offline for critical monitoring</li>
                  <li>• Push notifications for alerts</li>
                  <li>• Faster loading and performance</li>
                  <li>• Home screen access</li>
                  <li>• Full-screen experience</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">💻 Desktop Benefits</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Native app experience</li>
                  <li>• System notifications</li>
                  <li>• Taskbar/dock integration</li>
                  <li>• Keyboard shortcuts</li>
                  <li>• Background data sync</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleNotifications}
                className="flex items-center gap-1 bg-transparent"
              >
                <Bell className="w-3 h-3" />
                Enable Notifications
              </Button>

              <Badge className="bg-blue-100 text-blue-800">
                <Monitor className="w-3 h-3 mr-1" />
                Works on all devices
              </Badge>

              <Badge className="bg-green-100 text-green-800">
                <WifiOff className="w-3 h-3 mr-1" />
                Offline capable
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fallback for non-installable browsers */}
      {!canInstall && !isInstalled && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-800 mb-1">Install as App</h4>
                <p className="text-sm text-orange-700 mb-2">
                  Add MedWatch AI to your home screen for the best experience:
                </p>
                <div className="text-xs text-orange-600 space-y-1">
                  <p>
                    <strong>Chrome/Edge:</strong> Menu → "Install MedWatch AI"
                  </p>
                  <p>
                    <strong>Safari:</strong> Share → "Add to Home Screen"
                  </p>
                  <p>
                    <strong>Firefox:</strong> Menu → "Install"
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
