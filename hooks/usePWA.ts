"use client"

import { useState, useEffect } from "react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

interface PWAState {
  isInstallable: boolean
  isInstalled: boolean
  isStandalone: boolean
  isOnline: boolean
  canInstall: boolean
  installPrompt: BeforeInstallPromptEvent | null
}

export function usePWA() {
  const [pwaState, setPWAState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    isOnline: true,
    canInstall: false,
    installPrompt: null,
  })

  useEffect(() => {
    // Check if running in standalone mode (installed as PWA)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://")

    // Check if app is installable
    const isInstalled = isStandalone || localStorage.getItem("pwa-installed") === "true"

    // Check online status
    const isOnline = navigator.onLine

    setPWAState((prev) => ({
      ...prev,
      isStandalone,
      isInstalled,
      isOnline,
    }))

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log("PWA: Install prompt available")
      e.preventDefault() // Prevent the mini-infobar from appearing

      setPWAState((prev) => ({
        ...prev,
        isInstallable: true,
        canInstall: true,
        installPrompt: e,
      }))
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log("PWA: App installed")
      localStorage.setItem("pwa-installed", "true")

      setPWAState((prev) => ({
        ...prev,
        isInstalled: true,
        canInstall: false,
        installPrompt: null,
      }))
    }

    // Listen for online/offline events
    const handleOnline = () => {
      console.log("PWA: Back online")
      setPWAState((prev) => ({ ...prev, isOnline: true }))
    }

    const handleOffline = () => {
      console.log("PWA: Gone offline")
      setPWAState((prev) => ({ ...prev, isOnline: false }))
    }

    // Add event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener)
    window.addEventListener("appinstalled", handleAppInstalled)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("PWA: Service Worker registered", registration.scope)

          // Check for updates
          registration.addEventListener("updatefound", () => {
            console.log("PWA: New service worker available")
          })
        })
        .catch((error) => {
          console.error("PWA: Service Worker registration failed", error)
        })
    }

    // Cleanup
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener)
      window.removeEventListener("appinstalled", handleAppInstalled)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const installApp = async () => {
    if (!pwaState.installPrompt) {
      console.log("PWA: No install prompt available")
      return false
    }

    try {
      // Show the install prompt
      await pwaState.installPrompt.prompt()

      // Wait for the user to respond
      const { outcome } = await pwaState.installPrompt.userChoice

      console.log("PWA: Install prompt result", outcome)

      if (outcome === "accepted") {
        setPWAState((prev) => ({
          ...prev,
          canInstall: false,
          installPrompt: null,
        }))
        return true
      }

      return false
    } catch (error) {
      console.error("PWA: Install failed", error)
      return false
    }
  }

  const shareApp = async () => {
    const shareData = {
      title: "MedWatch AI",
      text: "Real-time medical monitoring with AI-powered predictions",
      url: window.location.origin,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return true
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareData.url)
        return true
      }
    } catch (error) {
      console.error("PWA: Share failed", error)
      return false
    }
  }

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.log("PWA: Notifications not supported")
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      console.log("PWA: Notification permission", permission)
      return permission === "granted"
    } catch (error) {
      console.error("PWA: Notification permission failed", error)
      return false
    }
  }

  return {
    ...pwaState,
    installApp,
    shareApp,
    requestNotificationPermission,
  }
}
