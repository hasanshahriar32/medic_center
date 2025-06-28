"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Download, Smartphone, Monitor, Wifi, Bell, Zap } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      const isInstalled = isStandalone || isInWebAppiOS
      setIsInstalled(isInstalled)
      return isInstalled
    }

    if (checkInstalled()) {
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Show prompt after a delay if not installed
    const timer = setTimeout(() => {
      if (!checkInstalled() && !deferredPrompt) {
        setShowPrompt(true)
      }
    }, 5000)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      clearTimeout(timer)
    }
  }, [deferredPrompt])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        setDeferredPrompt(null)
        setShowPrompt(false)
      }
    } else {
      // Fallback for browsers that don't support the install prompt
      alert(
        'To install this app:\n\n1. Open browser menu\n2. Select "Add to Home Screen" or "Install App"\n3. Follow the prompts',
      )
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't show again for this session
    sessionStorage.setItem("pwa-prompt-dismissed", "true")
  }

  // Don't show if already installed or dismissed
  if (isInstalled || !showPrompt || sessionStorage.getItem("pwa-prompt-dismissed")) {
    return null
  }

  return (
    <Card className="border-cyan-500/50 bg-gradient-to-r from-cyan-950/20 to-blue-950/20 relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDismiss}
        className="absolute top-2 right-2 h-8 w-8 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
      >
        <X className="h-4 w-4" />
      </Button>

      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20">
            <Download className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <CardTitle className="text-cyan-400 text-lg sm:text-xl">Install Tactical Command Interface</CardTitle>
            <CardDescription className="text-cyan-300/70">
              Get the full app experience with offline access
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-sm text-cyan-300">
            <Wifi className="h-4 w-4 text-cyan-400" />
            <span>Offline Access</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-cyan-300">
            <Bell className="h-4 w-4 text-cyan-400" />
            <span>Push Notifications</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-cyan-300">
            <Zap className="h-4 w-4 text-cyan-400" />
            <span>Faster Loading</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleInstall} className="bg-cyan-600 hover:bg-cyan-700 text-white flex-1">
            <Download className="h-4 w-4 mr-2" />
            Install App
          </Button>

          <div className="flex gap-2">
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
              <Smartphone className="h-3 w-3 mr-1" />
              Mobile
            </Badge>
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
              <Monitor className="h-3 w-3 mr-1" />
              Desktop
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
