"use client"

import { Button } from "@/components/ui/button"
import { usePWA } from "@/hooks/usePWA"
import { Download, CheckCircle } from "lucide-react"
import { useState } from "react"

export function PWAInstallButtonHeader() {
  const { canInstall, isInstalled, isStandalone, installApp } = usePWA()
  const [installing, setInstalling] = useState(false)

  // Show installed status if already installed
  if (isInstalled || isStandalone) {
    return (
      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 cursor-default">
        <CheckCircle className="w-4 h-4 mr-1" />
        <span className="hidden md:inline">Installed</span>
      </Button>
    )
  }

  // Show install button if available
  if (canInstall) {
    const handleInstall = async () => {
      setInstalling(true)
      try {
        await installApp()
      } catch (error) {
        console.error("Installation failed:", error)
      } finally {
        setInstalling(false)
      }
    }

    return (
      <Button
        onClick={handleInstall}
        disabled={installing}
        size="sm"
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Download className="w-4 h-4 mr-1" />
        <span className="hidden md:inline">{installing ? "Installing..." : "Install"}</span>
        <span className="md:hidden">{installing ? "..." : "Install"}</span>
      </Button>
    )
  }

  return null
}
