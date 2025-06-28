"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePWA } from "@/hooks/usePWA"
import { Download, Smartphone, X, CheckCircle } from "lucide-react"

export function PWAInstallPrompt() {
  const { canInstall, isInstalled, isStandalone, installApp } = usePWA()
  const [installing, setInstalling] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Don't show if already installed or dismissed
  if (isInstalled || isStandalone || dismissed || !canInstall) {
    return null
  }

  const handleInstall = async () => {
    setInstalling(true)
    try {
      const success = await installApp()
      if (success) {
        console.log("App installed successfully")
        setDismissed(true)
      }
    } catch (error) {
      console.error("Installation failed:", error)
    } finally {
      setInstalling(false)
    }
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-blue-800 flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Install MedWatch AI
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDismissed(true)}
            className="text-gray-400 hover:text-gray-600 w-8 h-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-blue-700">
          Install MedWatch AI as an app for faster access, offline capabilities, and push notifications.
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs text-blue-600">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Works offline</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Push notifications</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Faster loading</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Home screen access</span>
          </div>
        </div>

        <Button
          onClick={handleInstall}
          disabled={installing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {installing ? "Installing..." : "Install App"}
        </Button>
      </CardContent>
    </Card>
  )
}
