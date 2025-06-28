"use client"

import { useState, useEffect } from "react"
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
  const [patientsWithData, setPatientsWithData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPatientsWithLatestData()

    // Refresh data every 5 seconds
    const interval = setInterval(fetchPatientsWithLatestData, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchPatientsWithLatestData = async () => {
    try {
      const response = await fetch("/api/mqtt/latest")
      const usersData = await response.json()

      // Transform users data to patient format with real-time sensor data
      const patientsData = usersData.map((userData: any) => {
        const heartRateData = userData.latestData.heartRate
        const eegData = userData.latestData.eeg
        const ecgData = userData.latestData.ecg

        const heartRate = heartRateData?.value || 0
        const eegActivity = eegData?.value || 0
        const ecgSignal = ecgData?.signal_quality || 0

        // Calculate risk level based on latest sensor data
        let riskLevel = "Low"
        if (heartRate > 100 || eegActivity < 7) {
          riskLevel = "High"
        } else if (heartRate > 85 || eegActivity < 8) {
          riskLevel = "Medium"
        }

        return {
          id: userData.user.id,
          firebase_uid: userData.user.firebase_uid,
          name: userData.user.name,
          age: userData.user.age || "N/A",
          condition: userData.user.medical_condition || "General Monitoring",
          status: heartRateData || eegData || ecgData ? "monitoring" : "no-data",
          heartRate,
          eegActivity,
          ecgSignal,
          riskLevel,
          lastUpdate:
            heartRateData?.timestamp || eegData?.timestamp || ecgData?.timestamp
              ? new Date(heartRateData?.timestamp || eegData?.timestamp || ecgData?.timestamp).toLocaleString()
              : "No data",
          email: userData.user.email,
          hasRecentData: !!(heartRateData || eegData || ecgData),
        }
      })

      setPatientsWithData(patientsData)
    } catch (error) {
      console.error("Error fetching patients with data:", error)
    } finally {
      setLoading(false)
    }
  }

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
      case "no-data":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const patientsWithRecentData = patientsWithData.filter((p) => p.hasRecentData)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Monitoring Dashboard</h1>
          <p className="text-sm text-gray-600">Real-time MQTT sensor data monitoring</p>
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
            Patients with MQTT Data ({patientsWithRecentData.length} active)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading patient data...</p>
            </div>
          ) : patientsWithRecentData.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No patients with recent MQTT data</p>
              <p className="text-sm text-gray-400">Patients will appear here when they start sending sensor data</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patientsWithRecentData.map((patient) => (
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
                          {patient.email} • Age {patient.age}
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
                        <p className="text-lg font-bold text-purple-600 font-mono">{patient.eegActivity.toFixed(1)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">ECG Quality</p>
                        <p className="text-lg font-bold text-blue-600 font-mono">{patient.ecgSignal}%</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getRiskColor(patient.riskLevel)}>{patient.riskLevel} Risk</Badge>
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status === "monitoring" ? "Live Data" : "No Data"}
                        </Badge>
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
          )}
        </CardContent>
      </Card>

      {/* Real-time Waveform Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              MQTT Heart Rate Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center border">
              <div className="text-center text-gray-500">
                <Activity className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                <p className="text-sm">Real-time MQTT heart rate data</p>
                <p className="text-xs">Current: {realTimeData.heartRate} BPM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              MQTT EEG Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center border">
              <div className="text-center text-gray-500">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                <p className="text-sm">Real-time MQTT EEG data</p>
                <p className="text-xs">Alpha Waves: {realTimeData.eegAlpha.toFixed(1)} Hz</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
