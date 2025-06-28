"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  AlertTriangle,
  Brain,
  Heart,
  Shield,
  Users,
  Zap,
  TrendingUp,
  Clock,
  User,
  Menu,
  X,
} from "lucide-react"
import { useRealTimeData } from "@/hooks/useRealTimeData"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { PWAInstallButtonHeader } from "@/components/pwa-install-button-header"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { initializeFirebaseAuth } from "@/lib/firebase-auth"

export default function TacticalDashboard() {
  const { realTimeData, allUsersData, connectionStatus, refreshData } = useRealTimeData()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      try {
        await initializeFirebaseAuth()
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(user)
          } else {
            router.push("/auth/login")
          }
          setLoading(false)
        })

        return () => unsubscribe()
      } catch (error) {
        console.error("Auth initialization error:", error)
        setLoading(false)
      }
    }

    initAuth()
  }, [router])

  const handleSignOut = async () => {
    try {
      const auth = getAuth()
      await signOut(auth)
      router.push("/auth/login")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navigationItems = [
    { name: "Command Center", href: "/command-center", icon: Shield },
    { name: "Agent Network", href: "/agent-network", icon: Users },
    { name: "Operations", href: "/operations", icon: Activity },
    { name: "Intelligence", href: "/intelligence", icon: Brain },
    { name: "Systems", href: "/systems", icon: Zap },
    { name: "Patient Monitoring", href: "/patient-monitoring", icon: Heart },
    { name: "Vital Signs", href: "/vital-signs", icon: Activity },
    { name: "Alerts", href: "/alerts", icon: AlertTriangle },
    { name: "Predictive Analytics", href: "/predictive-analytics", icon: TrendingUp },
    { name: "System Status", href: "/system-status", icon: Activity },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-xl font-bold text-cyan-400">Tactical Command</h1>
          </div>
          <PWAInstallButtonHeader />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-80 lg:w-72 bg-gray-800 border-r border-gray-700 transition-transform duration-300 ease-in-out lg:transition-none`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-cyan-400">Tactical Command</h1>
                    <p className="text-xs text-gray-400">Interface v2.1</p>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <PWAInstallButtonHeader />
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-gray-700 bg-gray-750">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.displayName || user.email}</p>
                  <p className="text-xs text-gray-400 truncate">Firebase UID: {user.uid}</p>
                </div>
              </div>
              <div className="mt-3 p-2 bg-gray-700 rounded text-xs">
                <p className="text-gray-300">IoT devices should use this UID:</p>
                <code className="text-cyan-400 break-all">{user.uid}</code>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Connection Status */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      connectionStatus === "connected" ? "bg-green-400" : "bg-red-400"
                    }`}
                  />
                  <span className="text-xs text-gray-400">
                    MQTT {connectionStatus === "connected" ? "Connected" : "Disconnected"}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={refreshData}
                  className="text-xs bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Refresh
                </Button>
              </div>
            </div>

            {/* Sign Out */}
            <div className="p-4 border-t border-gray-700">
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-4 md:p-8 space-y-6 md:space-y-8">
            {/* PWA Install Prompt */}
            <PWAInstallPrompt />

            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Tactical Command Interface
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Real-time monitoring and control system for tactical operations with MQTT sensor integration
              </p>
            </div>

            {/* Real-time Status Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <StatusCard
                title="Heart Rate"
                value={`${realTimeData.heartRate} BPM`}
                icon={<Heart className="w-6 h-6 text-red-400" />}
                status={realTimeData.heartRate > 0 ? "active" : "inactive"}
                lastUpdate={realTimeData.lastUpdate}
              />
              <StatusCard
                title="EEG Alpha"
                value={`${realTimeData.eegAlpha.toFixed(1)} Hz`}
                icon={<Brain className="w-6 h-6 text-purple-400" />}
                status={realTimeData.eegAlpha > 0 ? "active" : "inactive"}
                lastUpdate={realTimeData.lastUpdate}
              />
              <StatusCard
                title="ECG Signal"
                value={`${realTimeData.ecgSignal}%`}
                icon={<Activity className="w-6 h-6 text-blue-400" />}
                status={realTimeData.ecgSignal > 0 ? "active" : "inactive"}
                lastUpdate={realTimeData.lastUpdate}
              />
              <StatusCard
                title="Anxiety Level"
                value={realTimeData.anxietyLevel}
                icon={<AlertTriangle className="w-6 h-6 text-orange-400" />}
                status={realTimeData.anxietyLevel !== "Low" ? "warning" : "normal"}
                lastUpdate={realTimeData.lastUpdate}
              />
            </div>

            {/* Live Users Data */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Live User Data ({allUsersData.length} users)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {allUsersData.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No live data available</p>
                    <p className="text-sm text-gray-500">Users will appear here when they start sending MQTT data</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allUsersData.map((userData, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{userData.user.name}</h3>
                              <p className="text-sm text-gray-400">{userData.user.email}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4">
                            <div className="text-center">
                              <p className="text-xs text-gray-400">Heart Rate</p>
                              <p className="text-lg font-bold text-red-400">
                                {userData.latestData.heartRate?.value || 0}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-400">EEG Alpha</p>
                              <p className="text-lg font-bold text-purple-400">
                                {userData.latestData.eeg?.value?.toFixed(1) || "0.0"}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-400">ECG Quality</p>
                              <p className="text-lg font-bold text-blue-400">
                                {userData.latestData.ecg?.signal_quality || 0}%
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <ActionCard
                title="Patient Monitoring"
                description="Real-time MQTT sensor data monitoring"
                href="/patient-monitoring"
                icon={<Heart className="w-8 h-8 text-red-400" />}
                color="red"
              />
              <ActionCard
                title="Vital Signs"
                description="Comprehensive physiological tracking"
                href="/vital-signs"
                icon={<Activity className="w-8 h-8 text-blue-400" />}
                color="blue"
              />
              <ActionCard
                title="Alert Management"
                description="Monitor and respond to system alerts"
                href="/alerts"
                icon={<AlertTriangle className="w-8 h-8 text-orange-400" />}
                color="orange"
              />
              <ActionCard
                title="Command Center"
                description="Central tactical operations hub"
                href="/command-center"
                icon={<Shield className="w-8 h-8 text-cyan-400" />}
                color="cyan"
              />
              <ActionCard
                title="Agent Network"
                description="Monitor field agent status"
                href="/agent-network"
                icon={<Users className="w-8 h-8 text-green-400" />}
                color="green"
              />
              <ActionCard
                title="Intelligence"
                description="Data analysis and insights"
                href="/intelligence"
                icon={<Brain className="w-8 h-8 text-purple-400" />}
                color="purple"
              />
            </div>

            {/* System Performance */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">System Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">CPU Usage</span>
                      <span className="text-white">23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Memory</span>
                      <span className="text-white">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Network</span>
                      <span className="text-white">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusCard({
  title,
  value,
  icon,
  status,
  lastUpdate,
}: {
  title: string
  value: string
  icon: React.ReactNode
  status: "active" | "inactive" | "warning" | "normal"
  lastUpdate: Date
}) {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "warning":
        return "bg-orange-500"
      case "inactive":
        return "bg-gray-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm text-gray-400">{title}</span>
          </div>
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-white font-mono">{value}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ActionCard({
  title,
  description,
  href,
  icon,
  color,
}: {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <Link href={href}>
      <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer group">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-700 rounded-lg group-hover:bg-gray-600 transition-colors">{icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-400">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
