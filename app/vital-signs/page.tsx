"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, Brain, Activity, Thermometer, Droplets, Wind } from "lucide-react"

export default function VitalSignsPage({ realTimeData }) {
  const vitalSigns = [
    {
      name: "Heart Rate",
      value: realTimeData.heartRate,
      unit: "BPM",
      normal: "60-100",
      icon: Heart,
      color: "red",
      trend: "+2.3%",
    },
    {
      name: "EEG Alpha Waves",
      value: realTimeData.eegAlpha.toFixed(1),
      unit: "Hz",
      normal: "8-12",
      icon: Brain,
      color: "purple",
      trend: "-1.2%",
    },
    {
      name: "ECG Signal Quality",
      value: realTimeData.ecgSignal,
      unit: "%",
      normal: ">80",
      icon: Activity,
      color: "blue",
      trend: "+0.8%",
    },
    {
      name: "Respiratory Rate",
      value: Math.floor(Math.random() * 8) + 12,
      unit: "/min",
      normal: "12-20",
      icon: Wind,
      color: "green",
      trend: "+1.1%",
    },
    {
      name: "Blood Oxygen",
      value: Math.floor(Math.random() * 5) + 95,
      unit: "%",
      normal: ">95",
      icon: Droplets,
      color: "cyan",
      trend: "0.0%",
    },
    {
      name: "Body Temperature",
      value: (Math.random() * 2 + 36).toFixed(1),
      unit: "°C",
      normal: "36.1-37.2",
      icon: Thermometer,
      color: "orange",
      trend: "+0.3%",
    },
  ]

  const getColorClasses = (color) => {
    const colors = {
      red: "from-red-50 to-pink-50 border-red-200 text-red-600",
      purple: "from-purple-50 to-indigo-50 border-purple-200 text-purple-600",
      blue: "from-blue-50 to-cyan-50 border-blue-200 text-blue-600",
      green: "from-green-50 to-emerald-50 border-green-200 text-green-600",
      cyan: "from-cyan-50 to-blue-50 border-cyan-200 text-cyan-600",
      orange: "from-orange-50 to-red-50 border-orange-200 text-orange-600",
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vital Signs Monitoring</h1>
          <p className="text-sm text-gray-600">Real-time physiological parameter tracking</p>
        </div>
      </div>

      {/* Vital Signs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vitalSigns.map((vital, index) => (
          <Card key={index} className={`bg-gradient-to-r ${getColorClasses(vital.color)} shadow-sm`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <vital.icon
                  className={`w-4 h-4 ${
                    vital.color === "red"
                      ? "text-red-500"
                      : vital.color === "purple"
                        ? "text-purple-500"
                        : vital.color === "blue"
                          ? "text-blue-500"
                          : vital.color === "green"
                            ? "text-green-500"
                            : vital.color === "cyan"
                              ? "text-cyan-500"
                              : "text-orange-500"
                  }`}
                />
                {vital.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-3xl font-bold font-mono ${
                      vital.color === "red"
                        ? "text-red-700"
                        : vital.color === "purple"
                          ? "text-purple-700"
                          : vital.color === "blue"
                            ? "text-blue-700"
                            : vital.color === "green"
                              ? "text-green-700"
                              : vital.color === "cyan"
                                ? "text-cyan-700"
                                : "text-orange-700"
                    }`}
                  >
                    {vital.value}
                  </span>
                  <span className="text-sm text-gray-600">{vital.unit}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Normal: {vital.normal}</span>
                    <span
                      className={
                        vital.trend.startsWith("+")
                          ? "text-green-600"
                          : vital.trend.startsWith("-")
                            ? "text-red-600"
                            : "text-gray-600"
                      }
                    >
                      {vital.trend}
                    </span>
                  </div>

                  <Progress
                    value={
                      vital.name === "Heart Rate"
                        ? ((Number.parseFloat(vital.value) - 60) / 40) * 100
                        : vital.name === "EEG Alpha Waves"
                          ? ((Number.parseFloat(vital.value) - 6) / 6) * 100
                          : Number.parseFloat(vital.value)
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Monitoring Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Heart Rate Variability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center border">
              <div className="text-center text-gray-500">
                <div className="w-full h-32 relative">
                  {/* Simulated HRV Chart */}
                  <svg className="w-full h-full">
                    <polyline
                      points="0,80 50,60 100,90 150,70 200,85 250,65 300,95 350,75"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
                <p className="text-sm mt-2">Current: {realTimeData.heartRate} BPM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              EEG Frequency Bands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { band: "Delta (0.5-4 Hz)", value: Math.random() * 30 + 10, color: "bg-blue-500" },
                { band: "Theta (4-8 Hz)", value: Math.random() * 25 + 15, color: "bg-green-500" },
                { band: "Alpha (8-12 Hz)", value: realTimeData.eegAlpha * 3, color: "bg-purple-500" },
                { band: "Beta (12-30 Hz)", value: Math.random() * 20 + 20, color: "bg-orange-500" },
              ].map((band, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{band.band}</span>
                    <span className="font-mono text-gray-600">{band.value.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${band.color} transition-all duration-300`}
                      style={{ width: `${band.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historical Trends */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">24-Hour Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border">
            <div className="text-center text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-4 animate-pulse" />
              <p className="text-lg font-medium">Historical Vital Signs Chart</p>
              <p className="text-sm">Showing trends for heart rate, EEG activity, and other parameters</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
