"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Server, Database, Wifi, Activity, CheckCircle, AlertTriangle, Settings, Heart, Brain, Zap } from "lucide-react"

export default function SystemStatusPage({ realTimeData }) {
  const systems = [
    {
      id: "SYS-001",
      name: "EEG Data Acquisition",
      type: "Sensor Array",
      status: "online",
      health: 98,
      dataRate: "256 Hz",
      channels: 32,
      uptime: "247 days",
      location: "Patient Room A",
      lastMaintenance: "2025-05-15",
    },
    {
      id: "SYS-002",
      name: "ECG Monitoring System",
      type: "Cardiac Monitor",
      status: "online",
      health: 95,
      dataRate: "1000 Hz",
      channels: 12,
      uptime: "189 days",
      location: "Patient Room A",
      lastMaintenance: "2025-06-01",
    },
    {
      id: "SYS-003",
      name: "ML Prediction Engine",
      type: "AI Processing",
      status: "online",
      health: 92,
      dataRate: "Real-time",
      channels: "N/A",
      uptime: "156 days",
      location: "Cloud Server",
      lastMaintenance: "2025-04-20",
    },
    {
      id: "SYS-004",
      name: "Data Storage Cluster",
      type: "Database",
      status: "online",
      health: 89,
      dataRate: "10 GB/day",
      channels: "N/A",
      uptime: "203 days",
      location: "Data Center",
      lastMaintenance: "2025-05-28",
    },
    {
      id: "SYS-005",
      name: "Alert Notification System",
      type: "Communication",
      status: "warning",
      health: 76,
      dataRate: "Event-based",
      channels: "N/A",
      uptime: "134 days",
      location: "Cloud Server",
      lastMaintenance: "2025-06-10",
    },
    {
      id: "SYS-006",
      name: "Network Infrastructure",
      type: "Connectivity",
      status: "online",
      health: 94,
      dataRate: "1 Gbps",
      channels: "N/A",
      uptime: "298 days",
      location: "Network Core",
      lastMaintenance: "2025-03-15",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-orange-100 text-orange-800"
      case "maintenance":
        return "bg-blue-100 text-blue-800"
      case "offline":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case "maintenance":
        return <Settings className="w-4 h-4 text-blue-500" />
      case "offline":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getSystemIcon = (type) => {
    switch (type) {
      case "Sensor Array":
        return <Brain className="w-6 h-6 text-purple-500" />
      case "Cardiac Monitor":
        return <Heart className="w-6 h-6 text-red-500" />
      case "AI Processing":
        return <Zap className="w-6 h-6 text-blue-500" />
      case "Database":
        return <Database className="w-6 h-6 text-green-500" />
      case "Communication":
        return <Activity className="w-6 h-6 text-orange-500" />
      case "Connectivity":
        return <Wifi className="w-6 h-6 text-cyan-500" />
      default:
        return <Server className="w-6 h-6 text-gray-500" />
    }
  }

  const getHealthColor = (health) => {
    if (health >= 95) return "text-green-600"
    if (health >= 85) return "text-green-600"
    if (health >= 70) return "text-orange-500"
    return "text-red-500"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">System Status</h1>
          <p className="text-sm text-gray-600">Medical monitoring infrastructure health and performance</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>

      {/* System Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 font-medium tracking-wider">SYSTEMS ONLINE</p>
                <p className="text-2xl font-bold text-green-700 font-mono">5/6</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-orange-600 font-medium tracking-wider">WARNINGS</p>
                <p className="text-2xl font-bold text-orange-700 font-mono">1</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 font-medium tracking-wider">AVG UPTIME</p>
                <p className="text-2xl font-bold text-blue-700 font-mono">99.8%</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-600 font-medium tracking-wider">DATA QUALITY</p>
                <p className="text-2xl font-bold text-purple-700 font-mono">94%</p>
              </div>
              <Database className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {systems.map((system) => (
          <Card key={system.id} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getSystemIcon(system.type)}
                  <div>
                    <CardTitle className="text-sm font-bold text-gray-800">{system.name}</CardTitle>
                    <p className="text-xs text-gray-500">{system.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(system.status)}
                  <Badge className={getStatusColor(system.status)}>{system.status.toUpperCase()}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">SYSTEM HEALTH</span>
                <span className={`text-sm font-bold font-mono ${getHealthColor(system.health)}`}>{system.health}%</span>
              </div>
              <Progress value={system.health} className="h-2" />

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-gray-500 mb-1">Data Rate</div>
                  <div className="text-gray-800 font-mono">{system.dataRate}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Channels</div>
                  <div className="text-gray-800 font-mono">{system.channels}</div>
                </div>
              </div>

              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span className="text-gray-800 font-mono">{system.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="text-gray-800">{system.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Maintenance:</span>
                  <span className="text-gray-800 font-mono">{system.lastMaintenance}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-time Data Flow */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Real-time Data Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Brain className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">EEG Data</h3>
              <p className="text-2xl font-bold text-purple-600 font-mono">{realTimeData.eegAlpha.toFixed(1)} Hz</p>
              <p className="text-xs text-gray-600">32 channels @ 256 Hz</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">ECG Data</h3>
              <p className="text-2xl font-bold text-red-600 font-mono">{realTimeData.heartRate} BPM</p>
              <p className="text-xs text-gray-600">12 leads @ 1000 Hz</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">ML Processing</h3>
              <p className="text-2xl font-bold text-blue-600 font-mono">{realTimeData.anxietyLevel}</p>
              <p className="text-xs text-gray-600">Real-time prediction</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Performance */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Wifi className="w-5 h-5 text-cyan-500" />
            Network Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Latency</p>
              <p className="text-2xl font-bold text-cyan-600 font-mono">2.3ms</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Throughput</p>
              <p className="text-2xl font-bold text-cyan-600 font-mono">850 Mbps</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Packet Loss</p>
              <p className="text-2xl font-bold text-cyan-600 font-mono">0.01%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Uptime</p>
              <p className="text-2xl font-bold text-cyan-600 font-mono">99.9%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
