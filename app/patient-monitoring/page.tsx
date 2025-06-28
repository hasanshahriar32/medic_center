"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Brain, Activity, TrendingUp, AlertTriangle, User, Clock } from "lucide-react"

const defaultRealTimeData = {
  heartRate: 0,
  eegAlpha: 0,
  ecgSignal: 0,
  anxietyLevel: "Low",
  lastUpdate: new Date(),
}

export default function PatientMonitoringPage({
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
  const patients = [
    {
      id: "P-001",
      name: "Sarah Johnson",
      age: 28,
      condition: "Anxiety Disorder",
      status: "monitoring",
      heartRate: realTimeData.heartRate,
      eegActivity: realTimeData.eegAlpha,
      riskLevel: realTimeData.anxietyLevel,
      lastUpdate: "2 min ago",
    },
    {
      id: "P-002",
      name: "Michael Chen",
      age: 34,
      condition: "Panic Disorder",
      status: "stable",
      heartRate: 68,
      eegActivity: 9.2,
      riskLevel: "Low",
      lastUpdate: "5 min ago",
    },
    {
      id: "P-003",
      name: "Emma Davis",
      age: 31,
      condition: "GAD",
      status: "alert",
      heartRate: 95,
      eegActivity: 6.8,
      riskLevel: "High",
      lastUpdate: "1 min ago",
    },
  ]

  const getRiskColor = (level) => {
    switch (level) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "monitoring":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "stable":
        return "bg-green-100 text-green-800 border-green-200"
      case "alert":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Monitoring Dashboard</h1>
          <p className="text-sm text-gray-600">Real-time monitoring of anxiety and panic attack indicators</p>
        </div>
      </div>

      {/* Real-time Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-600 font-medium tracking-wider">HEART RATE</p>
                <p className="text-2xl font-bold text-red-700 font-mono">{realTimeData.heartRate}</p>
                <p className="text-xs text-red-500">BPM</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <div className="mt-2">
              <Progress value={((realTimeData.heartRate - 60) / 40) * 100} className="h-2 bg-red-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-600 font-medium tracking-wider">EEG ALPHA WAVES</p>
                <p className="text-2xl font-bold text-purple-700 font-mono">{realTimeData.eegAlpha.toFixed(1)}</p>
                <p className="text-xs text-purple-500">Hz</p>
              </div>
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <Progress value={((realTimeData.eegAlpha - 6) / 5) * 100} className="h-2 bg-purple-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 font-medium tracking-wider">ECG SIGNAL</p>
                <p className="text-2xl font-bold text-blue-700 font-mono">{realTimeData.ecgSignal}</p>
                <p className="text-xs text-blue-500">Quality</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Progress value={realTimeData.ecgSignal} className="h-2 bg-blue-100" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`bg-gradient-to-r border-2 ${
            realTimeData.anxietyLevel === "High"
              ? "from-red-50 to-red-100 border-red-300"
              : realTimeData.anxietyLevel === "Medium"
                ? "from-orange-50 to-orange-100 border-orange-300"
                : "from-green-50 to-green-100 border-green-300"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium tracking-wider text-gray-600">ANXIETY LEVEL</p>
                <p
                  className={`text-2xl font-bold font-mono ${
                    realTimeData.anxietyLevel === "High"
                      ? "text-red-700"
                      : realTimeData.anxietyLevel === "Medium"
                        ? "text-orange-700"
                        : "text-green-700"
                  }`}
                >
                  {realTimeData.anxietyLevel}
                </p>
                <p className="text-xs text-gray-500">Risk Assessment</p>
              </div>
              <AlertTriangle
                className={`w-8 h-8 ${
                  realTimeData.anxietyLevel === "High"
                    ? "text-red-500"
                    : realTimeData.anxietyLevel === "Medium"
                      ? "text-orange-500"
                      : "text-green-500"
                }`}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient List */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5" />
            Active Patients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{patient.name}</h3>
                      <p className="text-sm text-gray-600">
                        {patient.id} • Age {patient.age}
                      </p>
                      <p className="text-sm text-gray-500">{patient.condition}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Heart Rate</p>
                      <p className="text-lg font-bold text-red-600 font-mono">{patient.heartRate}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">EEG Alpha</p>
                      <p className="text-lg font-bold text-purple-600 font-mono">{patient.eegActivity}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getRiskColor(patient.riskLevel)}>{patient.riskLevel} Risk</Badge>
                      <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {patient.lastUpdate}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Waveform Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              ECG Waveform
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center border">
              <div className="text-center text-gray-500">
                <Activity className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                <p className="text-sm">Real-time ECG visualization</p>
                <p className="text-xs">Signal Quality: {realTimeData.ecgSignal}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              EEG Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center border">
              <div className="text-center text-gray-500">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                <p className="text-sm">Real-time EEG visualization</p>
                <p className="text-xs">Alpha Waves: {realTimeData.eegAlpha.toFixed(1)} Hz</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
