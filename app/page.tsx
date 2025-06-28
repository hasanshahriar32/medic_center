"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useRealTimeData } from "@/hooks/useRealTimeData"
import { initializeFirebaseAuth, getCurrentUser } from "@/lib/firebase-auth"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { PWAInstallButtonHeader } from "@/components/pwa-install-button-header"
import {
  Activity,
  Heart,
  Brain,
  Zap,
  Users,
  AlertTriangle,
  TrendingUp,
  Shield,
  Wifi,
  WifiOff,
  User,
} from "lucide-react"

export default function Dashboard() {
  const { data, loading, error, connectionStatus, getHeartRate, getEEGData, getECGData } = useRealTimeData()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const auth = await initializeFirebaseAuth()
        if (auth) {
          const user = await getCurrentUser()
          setCurrentUser(user)
          console.log("🔐 Current user:", user?.uid || "Not logged in")
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setAuthLoading(false)
      }
    }

    initAuth()
  }, [])

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "text-green-500"
      case "connecting":
        return "text-yellow-500"
      case "disconnected":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getConnectionIcon = () => {
    return connectionStatus === "connected" ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />
  }

  if (loading && data.length === 0) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Activity className="h-8 w-8 animate-pulse mx-auto mb-4" />
              <p>Initializing tactical command interface...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-400 mb-2">
              TACTICAL COMMAND INTERFACE
            </h1>
            <p className="text-green-300/70 text-sm sm:text-base">Real-time monitoring and control system</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <PWAInstallButtonHeader />

            <div className={`flex items-center gap-2 ${getConnectionStatusColor()}`}>
              {getConnectionIcon()}
              <span className="text-xs sm:text-sm font-medium capitalize">{connectionStatus}</span>
            </div>

            {currentUser && (
              <div className="flex items-center gap-2 text-green-300">
                <User className="h-4 w-4" />
                <span className="text-xs sm:text-sm">UID: {currentUser.uid.slice(0, 8)}...</span>
              </div>
            )}
          </div>
        </div>

        {/* PWA Install Prompt */}
        <PWAInstallPrompt />

        {/* Error Display */}
        {error && (
          <Card className="border-red-500/50 bg-red-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm">Connection Error: {error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Real-time Data Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="border-green-500/30 bg-green-950/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-400 flex items-center gap-2 text-sm sm:text-base">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                Active Agents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-400">{data.length}</div>
              <p className="text-xs sm:text-sm text-green-300/70">Registered users</p>
            </CardContent>
          </Card>

          <Card className="border-blue-500/30 bg-blue-950/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-400 flex items-center gap-2 text-sm sm:text-base">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                Heart Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-blue-400">
                {data.length > 0 && getHeartRate(data[0]) !== null ? `${getHeartRate(data[0])} BPM` : "-- BPM"}
              </div>
              <p className="text-xs sm:text-sm text-blue-300/70">Latest reading</p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/30 bg-purple-950/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-400 flex items-center gap-2 text-sm sm:text-base">
                <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
                EEG Alpha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-purple-400">
                {data.length > 0 && getEEGData(data[0]) !== null ? `${getEEGData(data[0])} μV` : "-- μV"}
              </div>
              <p className="text-xs sm:text-sm text-purple-300/70">Brain activity</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/30 bg-yellow-950/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-yellow-400 flex items-center gap-2 text-sm sm:text-base">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                ECG Signal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                {data.length > 0 && getECGData(data[0]) !== null ? `${getECGData(data[0])} mV` : "-- mV"}
              </div>
              <p className="text-xs sm:text-sm text-yellow-300/70">Cardiac rhythm</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Agents */}
        {data.length > 0 && (
          <Card className="border-green-500/30 bg-green-950/10">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Active Monitoring Targets
              </CardTitle>
              <CardDescription className="text-green-300/70">
                Real-time biometric data from registered agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {data.map((userData) => (
                  <Card key={userData.user.id} className="border-green-500/20 bg-black/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-green-400 text-lg">{userData.user.name}</CardTitle>
                        <Badge variant="outline" className="border-green-500/50 text-green-400">
                          ACTIVE
                        </Badge>
                      </div>
                      <CardDescription className="text-green-300/70 text-sm">
                        Agent ID: {userData.user.firebase_uid.slice(0, 12)}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                        <div className="text-center p-2 rounded border border-blue-500/30 bg-blue-950/20">
                          <Heart className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                          <div className="font-bold text-blue-400">
                            {getHeartRate(userData) !== null ? `${getHeartRate(userData)}` : "--"}
                          </div>
                          <div className="text-xs text-blue-300/70">BPM</div>
                        </div>

                        <div className="text-center p-2 rounded border border-purple-500/30 bg-purple-950/20">
                          <Brain className="h-4 w-4 mx-auto mb-1 text-purple-400" />
                          <div className="font-bold text-purple-400">
                            {getEEGData(userData) !== null ? `${getEEGData(userData)}` : "--"}
                          </div>
                          <div className="text-xs text-purple-300/70">μV</div>
                        </div>

                        <div className="text-center p-2 rounded border border-yellow-500/30 bg-yellow-950/20 col-span-2 sm:col-span-1">
                          <Zap className="h-4 w-4 mx-auto mb-1 text-yellow-400" />
                          <div className="font-bold text-yellow-400">
                            {getECGData(userData) !== null ? `${getECGData(userData)}` : "--"}
                          </div>
                          <div className="text-xs text-yellow-300/70">mV</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Separator className="border-green-500/30" />

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link href="/patient-monitoring">
            <Card className="border-green-500/30 bg-green-950/10 hover:bg-green-950/20 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Patient Monitoring
                </CardTitle>
                <CardDescription className="text-green-300/70">
                  Real-time vital signs and health metrics
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/vital-signs">
            <Card className="border-blue-500/30 bg-blue-950/10 hover:bg-blue-950/20 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Vital Signs
                </CardTitle>
                <CardDescription className="text-blue-300/70">Comprehensive biometric analysis</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/alerts">
            <Card className="border-red-500/30 bg-red-950/10 hover:bg-red-950/20 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alert System
                </CardTitle>
                <CardDescription className="text-red-300/70">Critical notifications and warnings</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/predictive-analytics">
            <Card className="border-purple-500/30 bg-purple-950/10 hover:bg-purple-950/20 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Predictive Analytics
                </CardTitle>
                <CardDescription className="text-purple-300/70">AI-powered health predictions</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/system-status">
            <Card className="border-yellow-500/30 bg-yellow-950/10 hover:bg-yellow-950/20 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  System Status
                </CardTitle>
                <CardDescription className="text-yellow-300/70">Infrastructure monitoring</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/mqtt-setup">
            <Card className="border-cyan-500/30 bg-cyan-950/10 hover:bg-cyan-950/20 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  MQTT Setup
                </CardTitle>
                <CardDescription className="text-cyan-300/70">Device integration guide</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
