"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  Heart,
  Brain,
  Zap,
  Users,
  AlertTriangle,
  TrendingUp,
  Wifi,
  WifiOff,
  Menu,
  Settings,
  Bell,
  Shield,
  Target,
  BarChart3,
  Smartphone,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { useRealTimeData } from "@/hooks/useRealTimeData"
import { onAuthStateChangedClient, signOutClient } from "@/lib/firebase-auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User } from "firebase/auth"

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3, current: true },
  { name: "Command Center", href: "/command-center", icon: Shield },
  { name: "Patient Monitoring", href: "/patient-monitoring", icon: Heart },
  { name: "Agent Network", href: "/agent-network", icon: Users },
  { name: "Operations", href: "/operations", icon: Target },
  { name: "Intelligence", href: "/intelligence", icon: Brain },
  { name: "Systems", href: "/systems", icon: Settings },
]

const quickActions = [
  { name: "Vital Signs", href: "/vital-signs", icon: Activity, color: "bg-emerald-500" },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle, color: "bg-red-500" },
  { name: "Analytics", href: "/predictive-analytics", icon: TrendingUp, color: "bg-blue-500" },
  { name: "System Status", href: "/system-status", icon: Wifi, color: "bg-purple-500" },
]

export default function Dashboard() {
  const { data, users, isLoading, error } = useRealTimeData()
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChangedClient((user) => {
      console.log("Auth state changed:", user?.uid)
      setUser(user)
      setAuthLoading(false)

      if (!user) {
        router.push("/auth/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    try {
      await signOutClient()
      router.push("/auth/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  const connectionStatusColor = {
    connecting: "bg-yellow-500",
    connected: "bg-green-500",
    disconnected: "bg-red-500",
    error: "bg-red-500",
  }[data.connectionStatus]

  const connectionStatusText = {
    connecting: "Connecting...",
    connected: "Live",
    disconnected: "Offline",
    error: "Error",
  }[data.connectionStatus]

  return (
    <div className="min-h-screen bg-black text-cyan-400">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-cyan-400">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-black border-cyan-500/20">
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-2 p-4">
                  <Shield className="h-8 w-8 text-cyan-400" />
                  <span className="text-xl font-bold">TacOps</span>
                </div>
                <nav className="flex-1 space-y-2 p-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/10 transition-colors"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={`${connectionStatusColor} text-black border-0`}>
              {data.connectionStatus === "connected" ? (
                <Wifi className="w-3 h-3 mr-1" />
              ) : (
                <WifiOff className="w-3 h-3 mr-1" />
              )}
              {connectionStatusText}
            </Badge>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-black border-r border-cyan-500/20">
          <div className="flex items-center h-16 px-6 border-b border-cyan-500/20">
            <Shield className="h-8 w-8 text-cyan-400 mr-3" />
            <span className="text-xl font-bold">Tactical Command Interface</span>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-cyan-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">{user.email?.[0]?.toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-cyan-100 truncate">{user.displayName || user.email}</p>
                <p className="text-xs text-cyan-400 truncate">Administrator</p>
              </div>
            </div>

            {/* Firebase UID Display */}
            <div className="mt-4 p-3 bg-cyan-500/10 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-cyan-300">Firebase UID:</span>
                <Smartphone className="h-4 w-4 text-cyan-400" />
              </div>
              <code className="text-xs text-cyan-100 font-mono break-all">{user.uid}</code>
              <p className="text-xs text-cyan-300 mt-1">Use this UID in your IoT devices</p>
            </div>

            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="w-full mt-4 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 bg-transparent"
            >
              Sign Out
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  item.current
                    ? "bg-cyan-500/20 text-cyan-100"
                    : "text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/10"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Connection Status */}
          <div className="p-4 border-t border-cyan-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-cyan-300">MQTT Status</span>
              <Badge variant="outline" className={`${connectionStatusColor} text-black border-0`}>
                {data.connectionStatus === "connected" ? (
                  <Wifi className="w-3 h-3 mr-1" />
                ) : (
                  <WifiOff className="w-3 h-3 mr-1" />
                )}
                {connectionStatusText}
              </Badge>
            </div>
            {data.lastUpdated && (
              <p className="text-xs text-cyan-400 mt-1">Last: {new Date(data.lastUpdated).toLocaleTimeString()}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-cyan-100 mb-2">Mission Control Dashboard</h1>
            <p className="text-cyan-300">Real-time tactical operations monitoring and command interface</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickActions.map((action) => (
              <Link key={action.name} href={action.href}>
                <Card className="bg-gray-900/50 border-cyan-500/20 hover:border-cyan-400/40 transition-all cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-cyan-100">{action.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Live Data Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Heart Rate */}
            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-cyan-100">
                  <Heart className="h-5 w-5 mr-2 text-red-400" />
                  Heart Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-cyan-100">
                      {isLoading ? "---" : data.heartRate ? `${data.heartRate}` : "---"}
                    </span>
                    <span className="text-sm text-cyan-300">BPM</span>
                  </div>
                  <Progress
                    value={data.heartRate ? Math.min((data.heartRate / 120) * 100, 100) : 0}
                    className="h-2 bg-gray-800"
                  />
                  {data.signalQuality && <p className="text-xs text-cyan-400">Signal: {data.signalQuality}%</p>}
                </div>
              </CardContent>
            </Card>

            {/* EEG Alpha */}
            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-cyan-100">
                  <Brain className="h-5 w-5 mr-2 text-purple-400" />
                  EEG Alpha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-cyan-100">
                      {isLoading ? "---" : data.eegAlpha ? `${data.eegAlpha.toFixed(1)}` : "---"}
                    </span>
                    <span className="text-sm text-cyan-300">Hz</span>
                  </div>
                  <Progress value={data.eegAlpha ? (data.eegAlpha / 20) * 100 : 0} className="h-2 bg-gray-800" />
                </div>
              </CardContent>
            </Card>

            {/* ECG Signal */}
            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-cyan-100">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  ECG Signal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-cyan-100">
                      {isLoading ? "---" : data.ecgSignal ? `${data.ecgSignal}` : "---"}
                    </span>
                    <span className="text-sm text-cyan-300">%</span>
                  </div>
                  <Progress value={data.ecgSignal || 0} className="h-2 bg-gray-800" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registered Users */}
          {users.length > 0 && (
            <Card className="bg-gray-900/50 border-cyan-500/20 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-100">
                  <Users className="h-5 w-5 mr-2" />
                  Registered Users ({users.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((userData) => (
                    <div
                      key={userData.user.id}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-cyan-100">{userData.user.name}</p>
                        <p className="text-sm text-cyan-300">{userData.user.email}</p>
                        <p className="text-xs text-cyan-400">UID: {userData.user.firebase_uid}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="border-cyan-500/50 text-cyan-300">
                          {userData.sensorData.length} sensors
                        </Badge>
                        <p className="text-xs text-cyan-400 mt-1">
                          {userData.lastUpdated ? new Date(userData.lastUpdated).toLocaleTimeString() : "No data"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Card className="bg-red-900/20 border-red-500/20 mb-8">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <span className="text-red-300">Error: {error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-100">
                  <Activity className="h-5 w-5 mr-2" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-300">Database</span>
                    <Badge variant="outline" className="bg-green-500 text-black border-0">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-300">MQTT Broker</span>
                    <Badge variant="outline" className={`${connectionStatusColor} text-black border-0`}>
                      {connectionStatusText}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-300">Authentication</span>
                    <Badge variant="outline" className="bg-green-500 text-black border-0">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-100">
                  <Bell className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.lastUpdated ? (
                    <>
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-cyan-300">
                          Data received at {new Date(data.lastUpdated).toLocaleTimeString()}
                        </span>
                      </div>
                      {data.heartRate && (
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-cyan-300">Heart rate: {data.heartRate} BPM</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-cyan-300">Waiting for data...</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
