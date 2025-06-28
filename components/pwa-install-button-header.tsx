"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, CheckCircle, Smartphone } from "lucide-react"
import { usePWA } from "@/hooks/usePWA"

export function PWAInstallButtonHeader() {
  const { isInstallable, isInstalled, install } = usePWA()

  const handleInstall = async () => {
    await install()
  }

  if (isInstalled) {
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Installed
      </Badge>
    )
  }

  if (isInstallable) {
    return (
      <Button onClick={handleInstall} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
        <Download className="w-4 h-4 mr-1" />
        Install
      </Button>
    )
  }

  return (
    <Badge variant="outline" className="border-gray-600 text-gray-400">
      <Smartphone className="w-3 h-3 mr-1" />
      Web App
    </Badge>
  )
}
