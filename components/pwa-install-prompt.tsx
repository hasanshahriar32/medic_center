"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Smartphone, Wifi, Bell, X, CheckCircle } from "lucide-react"
import { usePWA } from "@/hooks/usePWA"

export function PWAInstallPrompt() {
  const { isInstallable, isInstalled, install } = usePWA()
  const [showPrompt, setShowPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Show prompt after 3 seconds if installable and not dismissed
    const timer = setTimeout(() => {
      if (isInstallable && !isInstalled && !dismissed) {
        setShowPrompt(true)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [isInstallable, isInstalled, dismissed])

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDismissed(true)
    // Remember dismissal for this session
    sessionStorage.setItem("pwa-prompt-dismissed", "true")
  }

  // Don't show if already installed or not installable
  if (isInstalled || !isInstallable || !showPrompt) {
    return null
  }

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-blue-500 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">Install Tactical Command App</CardTitle>
              <p className="text-blue-100 text-sm">Get the full experience on your device</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 text-white">
              <Wifi className="w-4 h-4 text-blue-200" />
              <span className="text-sm">Works Offline</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Bell className="w-4 h-4 text-blue-200" />
              <span className="text-sm">Push Notifications</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <CheckCircle className="w-4 h-4 text-blue-200" />
              <span className="text-sm">Native Experience</span>
            </div>
          </div>

          {/* Install Button */}
          <div className="flex gap-3">
            <Button onClick={handleInstall} className="flex-1 bg-white text-blue-600 hover:bg-blue-50 font-semibold">
              <Download className="w-4 h-4 mr-2" />
              Install App
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              Maybe Later
            </Button>
          </div>

          <p className="text-xs text-blue-100 text-center">Install for faster access and offline capabilities</p>
        </div>
      </CardContent>
    </Card>
  )
}
