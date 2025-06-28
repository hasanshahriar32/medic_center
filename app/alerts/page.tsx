"use client"
import { AlertTriangle, Bell, Brain, CheckCircle, Clock, Heart, User, X } from "lucide-react"
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

export default function AlertsPage({
  realTimeData = {
    heartRate: 0,
    eegAlpha: 0,
    ecgSignal: 0,
    anxietyLevel: "Low",
    lastUpdate: new Date(),
  },
}: AlertsPageProps) {
  const alerts = [
    {
      id: "ALT-001",
      type: "Critical",
      title: "High Anxiety Level Detected",
      patient: "Sarah Johnson",
      time: "2 minutes ago",
      description: "Patient showing elevated heart rate (95 BPM) and reduced alpha wave activity",
      status: "active",
      priority: "high",
      source: "ML Prediction Model",
    },
    {
      id: "ALT-002",
      type: "Warning",
      title: "EEG Pattern Anomaly",
      patient: "Michael Chen",
      time: "5 minutes ago",
      description: "Unusual beta wave patterns detected, possible stress indicator",
      status: "acknowledged",
      priority: "medium",
      source: "EEG Monitor",
    },
    {
      id: "ALT-003",
      type: "Info",
      title: "Medication Reminder",
      patient: "Emma Davis",
      time: "10 minutes ago",
      description: "Scheduled anxiety medication due in 30 minutes",
      status: "resolved",
      priority: "low",
      source: "Treatment Schedule",
    },
    {
      id: "ALT-004",
      type: "Critical",
      title: "Panic Attack Prediction",
      patient: "Sarah Johnson",
      time: "15 minutes ago",
      description: "85% probability of panic attack in next 30 minutes based on current vitals",
      status: "active",
      priority: "high",
      source: "LSTM Neural Network",
    },
  ]

  const getAlertColor = (type, priority) => {
    if (type === "Critical" || priority === "high") {
      return "bg-red-50 border-red-200 text-red-800"
    } else if (type === "Warning" || priority === "medium") {
      return "bg-orange-50 border-orange-200 text-orange-800"
    } else {
      return "bg-blue-50 border-blue-200 text-blue-800"
    }
  }

  const getStatusColor = (status) => {
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

  const getAlertIcon = (type) => {
    switch (type) {
      case "Critical":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case "Warning":
        return <Bell className="w-5 h-5 text-orange-500" />
      default:
        return <Bell className="w-5 h-5 text-blue-500" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Alerts & Warnings</h1>
          <p className="text-sm text-gray-600">Real-time monitoring alerts and system notifications</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Bell className="w-4 h-4 mr-2" />
            Configure Alerts
          </Button>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-600 font-medium tracking-wider">CRITICAL ALERTS</p>
                <p className="text-2xl font-bold text-red-700 font-mono">2</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
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
              <Bell className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 font-medium tracking-wider">INFO ALERTS</p>
                <p className="text-2xl font-bold text-blue-700 font-mono">1</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 font-medium tracking-wider">RESOLVED</p>
                <p className="text-2xl font-bold text-green-700 font-mono">1</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className={`border rounded-lg p-4 ${getAlertColor(alert.type, alert.priority)}`}>
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
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {alert.patient}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.time}
                        </div>
                        <div>Source: {alert.source}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {alert.status === "active" && (
                      <>
                        <Button size="sm" variant="outline" className="text-xs bg-transparent">
                          Acknowledge
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                          View Patient
                        </Button>
                      </>
                    )}
                    {alert.status === "acknowledged" && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Resolve
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-gray-500 hover:text-red-600">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Monitoring Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Cardiac Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Heart Rate</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg text-red-600">{realTimeData.heartRate} BPM</span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      realTimeData.heartRate > 90 ? "bg-red-500 animate-pulse" : "bg-green-500"
                    }`}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ECG Signal Quality</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg text-blue-600">{realTimeData.ecgSignal}%</span>
                  <div
                    className={`w-2 h-2 rounded-full ${realTimeData.ecgSignal > 80 ? "bg-green-500" : "bg-orange-500"}`}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Alert Threshold</span>
                <span className="text-sm text-gray-500">HR &gt; 100 BPM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Neurological Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">EEG Alpha Waves</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg text-purple-600">{realTimeData.eegAlpha.toFixed(1)} Hz</span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      realTimeData.eegAlpha < 7 ? "bg-orange-500 animate-pulse" : "bg-green-500"
                    }`}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Anxiety Level</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-lg ${
                      realTimeData.anxietyLevel === "High"
                        ? "text-red-600"
                        : realTimeData.anxietyLevel === "Medium"
                          ? "text-orange-600"
                          : "text-green-600"
                    }`}
                  >
                    {realTimeData.anxietyLevel}
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      realTimeData.anxietyLevel === "High"
                        ? "bg-red-500 animate-pulse"
                        : realTimeData.anxietyLevel === "Medium"
                          ? "bg-orange-500"
                          : "bg-green-500"
                    }`}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Alert Threshold</span>
                <span className="text-sm text-gray-500">Alpha &lt; 7 Hz</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
