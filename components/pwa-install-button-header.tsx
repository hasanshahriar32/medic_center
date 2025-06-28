"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Check, Smartphone } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallButtonHeader() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [canInstall, setCanInstall] = useState(false)

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      const installed = isStandalone || isInWebAppiOS
      setIsInstalled(installed)
      return installed
    }

    if (checkInstalled()) {
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      setCanInstall(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        setDeferredPrompt(null)
        setCanInstall(false)
        setIsInstalled(true)
      }
    }
  }

  if (isInstalled) {
    return (
      <Badge variant="outline" className="border-green-500/50 text-green-400 px-3 py-1">
        <Check className="h-3 w-3 mr-1" />
        App Installed
      </Badge>
    )
  }

  if (canInstall) {
    return (
      <Button onClick={handleInstall} size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 h-8">
        <Download className="h-3 w-3 mr-1" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </Button>
    )
  }

  // Show manual install hint for browsers that don't support the prompt
  return (
    <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 px-3 py-1">
      <Smartphone className="h-3 w-3 mr-1" />
      <span className="hidden sm:inline">Installable</span>
      <span className="sm:hidden">PWA</span>
    </Badge>
  )
}
