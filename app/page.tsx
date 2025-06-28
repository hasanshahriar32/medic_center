"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Activity,
  Brain,
  Heart,
  Shield,
  Users,
  AlertTriangle,
  Wifi,
  WifiOff,
  RefreshCw,
  User,
  Signal,
} from "lucide-react"
import { useRealTimeData } from "@/hooks/useRealTimeData"
import { useAuth } from "@/lib/firebase-auth"

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const { data, users, isLoading, error, refetch, initializeMQTT } = useRealTimeData()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => (window.location.href = "/auth/login")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getConnectionStatusColor = () => {
    switch (data.connectionStatus) {
      case "connected":
        return "text-green-500"
      case "connecting":
        return "text-yellow-500"
      case "error":
      case "disconnected":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getConnectionIcon = () => {
    switch (data.connectionStatus) {
      case "connected":
        return <Wifi className="h-4 w-4" />
      case "connecting":
        return <RefreshCw className="h-4 w-4 animate-spin" />
      default:
        return <WifiOff className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Tactical Command Interface</h1>
            <p className="text-slate-300">Real-time monitoring and control system</p>
          </div>
          <div className="text-right">
            <div className="text-white font-mono text-lg">{currentTime.toLocaleTimeString()}</div>
            <div className="text-slate-300 text-sm">{currentTime.toLocaleDateString()}</div>
          </div>
        </div>

        {/* Connection Status */}
        <Card className="mb-6 bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={getConnectionStatusColor()}>{getConnectionIcon()}</div>
                <div>
                  <p className="text-white font-medium">MQTT Connection</p>
                  <p className="text-slate-400 text-sm capitalize">{data.connectionStatus}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {data.lastUpdated && (
                  <div className="text-slate-400 text-sm">
                    Last update: {new Date(data.lastUpdated).toLocaleTimeString()}
                  </div>
                )}
                <Button
                  onClick={refetch}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current User Info */}
        <Card className="mb-6 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="h-5 w-5 mr-2" />
              Current User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Name</p>
                <p className="text-white font-medium">{user.displayName || "Unknown"}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Email</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Firebase UID</p>
                <p className="text-white font-mono text-xs bg-slate-700 p-2 rounded">{user.uid}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Heart Rate */}
          <Card className="bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-800/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-100">Heart Rate</CardTitle>
              <Heart className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-300">{data.heartRate ? `${data.heartRate} BPM` : "--"}</div>
              {data.signalQuality && (
                <div className="flex items-center mt-2">
                  <Signal className="h-3 w-3 mr-1 text-red-400" />
                  <span className="text-xs text-red-200">Signal: {data.signalQuality}</span>
                </div>
              )}
              <p className="text-xs text-red-200 mt-1">
                {data.heartRate ? (data.heartRate > 100 ? "Elevated" : "Normal") : "No data"}
              </p>
            </CardContent>
          </Card>

          {/* EEG Alpha */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-800/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">EEG Alpha</CardTitle>
              <Brain className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-300">{data.eegAlpha ? `${data.eegAlpha} Hz` : "--"}</div>
              <p className="text-xs text-blue-200 mt-1">
                {data.eegAlpha ? (data.eegAlpha < 7 ? "Low" : "Normal") : "No data"}
              </p>
            </CardContent>
          </Card>

          {/* ECG Signal */}
          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-800/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">ECG Signal</CardTitle>
              <Activity className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-300">{data.ecgSignal ? `${data.ecgSignal}%` : "--"}</div>
              <p className="text-xs text-green-200 mt-1">
                {data.ecgSignal ? (data.ecgSignal > 70 ? "Good" : "Poor") : "No data"}
              </p>
            </CardContent>
          </Card>

          {/* Active Users */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-800/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Active Users</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-300">{users.length}</div>
              <p className="text-xs text-purple-200 mt-1">{users.length > 0 ? "Users monitored" : "No active users"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Users List */}
        {users.length > 0 && (
          <Card className="mb-6 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Monitored Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {users.map((userData) => (
                    <div key={userData.user.id} className="border border-slate-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">{userData.user.name}</h3>
                        <Badge variant="outline" className="text-slate-300 border-slate-600">
                          {userData.sensorData.length} sensors
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-sm mb-3">{userData.user.email}</p>

                      {userData.sensorData.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {userData.sensorData.map((sensor) => (
                            <div key={sensor.id} className="bg-slate-700/50 rounded p-2">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-300 text-sm capitalize">{sensor.data_type}</span>
                                <span className="text-white font-medium">
                                  {sensor.value}
                                  {sensor.data_type === "heartRate"
                                    ? " BPM"
                                    : sensor.data_type === "eeg"
                                      ? " Hz"
                                      : sensor.data_type === "ecg"
                                        ? "%"
                                        : ""}
                                </span>
                              </div>
                              {sensor.signal_quality && (
                                <div className="text-xs text-slate-400 mt-1">Signal: {sensor.signal_quality}</div>
                              )}
                              <div className="text-xs text-slate-500 mt-1">
                                {new Date(sensor.created_at).toLocaleTimeString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="mb-6 bg-red-900/20 border-red-800/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div>
                  <p className="text-red-300 font-medium">Connection Error</p>
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
                <Button
                  onClick={initializeMQTT}
                  variant="outline"
                  size="sm"
                  className="ml-auto border-red-600 text-red-300 hover:bg-red-800/20 bg-transparent"
                >
                  Retry Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button
            onClick={() => (window.location.href = "/command-center")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Shield className="h-4 w-4 mr-2" />
            Command Center
          </Button>
          <Button
            onClick={() => (window.location.href = "/agent-network")}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Users className="h-4 w-4 mr-2" />
            Agent Network
          </Button>
          <Button
            onClick={() => (window.location.href = "/vital-signs")}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Heart className="h-4 w-4 mr-2" />
            Vital Signs
          </Button>
          <Button
            onClick={() => (window.location.href = "/alerts")}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alerts
          </Button>
        </div>
      </div>
    </div>
  )
}
