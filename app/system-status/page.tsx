"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Server, Database, Wifi, Shield, Zap, AlertTriangle, CheckCircle } from "lucide-react"

const defaultRealTimeData = {
  heartRate: 0,
  eegAlpha: 0,
  ecgSignal: 0,
  anxietyLevel: "Low",
  lastUpdate: new Date(),
}

export default function SystemStatusPage({
  realTimeData = defaultRealTimeData,
}: {
  realTimeData?: {
    heartRate: number
    eegAlpha: number
    ecgSignal: number
    anxietyLevel: string
    lastUpdate: Date
  }
}) {
  const systemComponents = [
    {
      name: "Database Server",
      status: "online",
      uptime: "99.9%",
      lastCheck: "2 min ago",
      icon: Database,
      color: "green",
      details: "Neon PostgreSQL - All queries responding normally",
    },
    {
      name: "MQTT Broker",
      status: "online",
      uptime: "99.7%",
      lastCheck: "1 min ago",
      icon: Wifi,
      color: "green",
      details: "HiveMQ Cloud - Processing real-time sensor data",
    },
    {
      name: "Firebase Auth",
      status: "online",
      uptime: "100%",
      lastCheck: "30 sec ago",
      icon: Shield,
      color: "green",
      details: "Authentication services operational",
    },
    {
      name: "ML Prediction Engine",
      status: "warning",
      uptime: "98.2%",
      lastCheck: "5 min ago",
      icon: Zap,
      color: "orange",
      details: "High CPU usage detected - scaling in progress",
    },
    {
      name: "Socket.IO Server",
      status: "online",
      uptime: "99.5%",
      lastCheck: "1 min ago",
      icon: Server,
      color: "green",
      details: "Real-time communication active",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800 border-green-200"
      case "warning":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "offline":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />
      case "offline":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <CheckCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const overallHealth =
    (systemComponents.filter((comp) => comp.status === "online").length / systemComponents.length) * 100

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">System Status</h1>
          <p className="text-sm text-gray-600">Infrastructure monitoring and health checks</p>
        </div>
      </div>

      {/* Overall System Health */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            Overall System Health
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold font-mono text-blue-600 mb-2">{overallHealth.toFixed(1)}%</div>
              <p className="text-sm text-gray-600">System Availability</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold font-mono text-green-600 mb-2">
                {systemComponents.filter((comp) => comp.status === "online").length}
              </div>
              <p className="text-sm text-gray-600">Services Online</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold font-mono text-purple-600 mb-2">
                {realTimeData.lastUpdate ? Math.floor((Date.now() - realTimeData.lastUpdate.getTime()) / 1000) : 0}s
              </div>
              <p className="text-sm text-gray-600">Last Data Update</p>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={overallHealth} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* System Components */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">System Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemComponents.map((component, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      <component.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{component.name}</h3>
                        {getStatusIcon(component.status)}
                      </div>
                      <p className="text-sm text-gray-600">{component.details}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center">
                    <Badge className={getStatusColor(component.status)}>{component.status.toUpperCase()}</Badge>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Uptime</p>
                      <p className="text-xs text-gray-500">{component.uptime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Last Check</p>
                      <p className="text-xs text-gray-500">{component.lastCheck}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Data Flow Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">MQTT Messages/min</span>
                <span className="font-mono text-lg text-blue-600">247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Database Queries/sec</span>
                <span className="font-mono text-lg text-green-600">12.3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Connections</span>
                <span className="font-mono text-lg text-purple-600">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ML Predictions/hour</span>
                <span className="font-mono text-lg text-orange-600">1,247</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Resource Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "CPU Usage", value: 45, color: "bg-blue-500" },
                { label: "Memory Usage", value: 67, color: "bg-green-500" },
                { label: "Database Storage", value: 23, color: "bg-purple-500" },
                { label: "Network I/O", value: 78, color: "bg-orange-500" },
              ].map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{metric.label}</span>
                    <span className="font-mono text-gray-600">{metric.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${metric.color} transition-all duration-300`}
                      style={{ width: `${metric.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Recent System Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: "2 min ago", event: "Database backup completed successfully", type: "info" },
              { time: "15 min ago", event: "ML model retrained with new data", type: "success" },
              { time: "1 hour ago", event: "High CPU usage detected on prediction server", type: "warning" },
              { time: "3 hours ago", event: "System maintenance completed", type: "info" },
              { time: "6 hours ago", event: "New user registration: john.doe@example.com", type: "info" },
            ].map((event, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    event.type === "success"
                      ? "bg-green-500"
                      : event.type === "warning"
                        ? "bg-orange-500"
                        : event.type === "error"
                          ? "bg-red-500"
                          : "bg-blue-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{event.event}</p>
                  <p className="text-xs text-gray-500">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
