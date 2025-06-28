"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AlertTriangle, Bell, Brain, CheckCircle, Clock, Heart, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type RealTimeData = {
  heartRate: number
  eegAlpha: number
  ecgSignal: number
  anxietyLevel: "Low" | "Medium" | "High"
  lastUpdate: Date
}

interface AlertsPageProps {
  realTimeData?: RealTimeData
}

const defaultRealTimeData: RealTimeData = {
  heartRate: 0,
  eegAlpha: 0,
  ecgSignal: 0,
  anxietyLevel: "Low",
  lastUpdate: new Date(),
}

export default function AlertsPage({ realTimeData = defaultRealTimeData }: AlertsPageProps) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const response = await fetch("/api/alerts")
      const alertsData = await response.json()
      setAlerts(alertsData)
    } catch (error) {
      console.error("Error fetching alerts:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateAlertStatus = async (alertId: string, status: string) => {
    try {
      await fetch("/api/alerts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ alert_id: alertId, status }),
      })
      fetchAlerts() // Refresh alerts
    } catch (error) {
      console.error("Error updating alert:", error)
    }
  }

  const getAlertColor = (type: string, priority: string) => {
    if (type === "critical" || priority === "high") {
      return "bg-red-50 border-red-200 text-red-800"
    } else if (type === "warning" || priority === "medium") {
      return "bg-orange-50 border-orange-200 text-orange-800"
    }
    return "bg-blue-50 border-blue-200 text-blue-800"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800"
      case "acknowledged":
        return "bg-orange-100 text-orange-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case "warning":
        return <Bell className="w-5 h-5 text-orange-500" />
      default:
        return <Bell className="w-5 h-5 text-blue-500" />
    }
  }

  const alertCounts = {
    critical: alerts.filter((alert) => alert.type === "critical" && alert.status === "active").length,
    warning: alerts.filter((alert) => alert.type === "warning" && alert.status === "active").length,
    info: alerts.filter((alert) => alert.type === "info" && alert.status === "active").length,
    resolved: alerts.filter((alert) => alert.status === "resolved").length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Alerts & Warnings</h1>
          <p className="text-sm text-gray-600">Real-time monitoring alerts and system notifications</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Bell className="w-4 h-4 mr-2" />
          Configure Alerts
        </Button>
      </div>

      {/* Alert Counters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CounterCard label="CRITICAL ALERTS" value={alertCounts.critical} color="red" />
        <CounterCard label="WARNINGS" value={alertCounts.warning} color="orange" />
        <CounterCard label="INFO ALERTS" value={alertCounts.info} color="blue" />
        <CounterCard label="RESOLVED" value={alertCounts.resolved} color="green" />
      </div>

      {/* Active Alerts List */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading alerts...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500">No active alerts</p>
              <p className="text-sm text-gray-400">All systems are operating normally</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`border rounded-lg p-4 ${getAlertColor(alert.type, alert.type)}`}>
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getAlertIcon(alert.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-800">{alert.title}</h3>
                          <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {alert.user_name || "Unknown User"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(alert.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {alert.status === "active" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs bg-transparent"
                            onClick={() => updateAlertStatus(alert.id, "acknowledged")}
                          >
                            Acknowledge
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                            View Patient
                          </Button>
                        </>
                      )}
                      {alert.status === "acknowledged" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white text-xs"
                          onClick={() => updateAlertStatus(alert.id, "resolved")}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-time Heart / EEG Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VitalCard
          icon={<Heart className="w-5 h-5 text-red-500" />}
          title="Heart Rate"
          value={`${realTimeData.heartRate} BPM`}
          pulse={realTimeData.heartRate > 90}
        />
        <VitalCard
          icon={<Brain className="w-5 h-5 text-purple-500" />}
          title="EEG Alpha"
          value={`${realTimeData.eegAlpha.toFixed(1)} Hz`}
          pulse={realTimeData.eegAlpha < 7}
        />
      </div>
    </div>
  )
}

function CounterCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: "red" | "orange" | "blue" | "green"
}) {
  const colorMap = {
    red: ["from-red-50 to-red-100", "text-red-700", AlertTriangle],
    orange: ["from-orange-50 to-orange-100", "text-orange-700", Bell],
    blue: ["from-blue-50 to-blue-100", "text-blue-700", Bell],
    green: ["from-green-50 to-green-100", "text-green-700", CheckCircle],
  } as const

  const [bg, text, Icon] = colorMap[color]

  return (
    <Card className={`bg-gradient-to-r ${bg} border-${color}-200`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs ${text} font-medium tracking-wider uppercase`}>{label}</p>
            <p className={`text-2xl font-bold font-mono ${text}`}>{value}</p>
          </div>
          <Icon className={`w-8 h-8 ${text}`} />
        </div>
      </CardContent>
    </Card>
  )
}

function VitalCard({
  icon,
  title,
  value,
  pulse,
}: {
  icon: React.ReactElement
  title: string
  value: string
  pulse: boolean
}) {
  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="font-mono text-2xl text-gray-800">{value}</span>
          <span className={`w-3 h-3 rounded-full ${pulse ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
        </div>
      </CardContent>
    </Card>
  )
}
