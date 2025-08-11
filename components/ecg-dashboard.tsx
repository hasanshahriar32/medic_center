"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Heart, Zap, TrendingUp, Signal, AlertTriangle } from "lucide-react"

interface ECGDashboardProps {
  realTimeData: {
    heartRate: number
    ecgSignal: number
    hp: number
    threshold: number
    baselineHR: number
    rmssd: number
    hrTrend: number
    anxietyLevel: "Low" | "Medium" | "High"
    lastUpdate: Date
    userId?: string
  }
}

export function ECGDashboard({ realTimeData }: ECGDashboardProps) {
  const [ecgHistory, setEcgHistory] = useState<number[]>([])

  useEffect(() => {
    // Simulate ECG waveform data based on HP signal
    const newEcgPoint = realTimeData.hp + (Math.random() - 0.5) * 5
    setEcgHistory(prev => [...prev.slice(-49), newEcgPoint])
  }, [realTimeData.hp, realTimeData.lastUpdate])

  const getSignalQuality = (hp: number) => {
    if (hp >= 15) return { label: "Excellent", color: "bg-green-500", percentage: 95 }
    if (hp >= 10) return { label: "Good", color: "bg-blue-500", percentage: 80 }
    if (hp >= 5) return { label: "Fair", color: "bg-yellow-500", percentage: 60 }
    return { label: "Poor", color: "bg-red-500", percentage: 30 }
  }

  const getHeartRateStatus = (bpm: number, baseline: number) => {
    const deviation = Math.abs(bpm - baseline)
    if (bpm > 120) return { status: "High", color: "text-red-600", icon: AlertTriangle }
    if (bpm < 50) return { status: "Low", color: "text-red-600", icon: AlertTriangle }
    if (deviation > 20) return { status: "Elevated", color: "text-orange-500", icon: TrendingUp }
    return { status: "Normal", color: "text-green-600", icon: Heart }
  }

  const signalQuality = getSignalQuality(realTimeData.hp)
  const heartRateStatus = getHeartRateStatus(realTimeData.heartRate, realTimeData.baselineHR)
  const HeartIcon = heartRateStatus.icon

  return (
    <div className="space-y-6">
      {/* Main ECG Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate Card */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
              <HeartIcon className="w-4 h-4" />
              Heart Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{realTimeData.heartRate}</div>
            <div className="text-xs text-red-500">BPM</div>
            <Badge 
              variant="secondary" 
              className={`mt-2 ${heartRateStatus.color} bg-transparent border-current`}
            >
              {heartRateStatus.status}
            </Badge>
          </CardContent>
        </Card>

        {/* ECG Signal Quality */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Signal className="w-4 h-4" />
              Signal Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{signalQuality.label}</div>
            <div className="text-xs text-blue-500">HP: {realTimeData.hp}</div>
            <Progress 
              value={signalQuality.percentage} 
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        {/* RMSSD (Heart Rate Variability) */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              HRV (RMSSD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{realTimeData.rmssd.toFixed(1)}</div>
            <div className="text-xs text-purple-500">milliseconds</div>
            <Badge 
              variant="secondary" 
              className="mt-2 text-purple-600 bg-transparent border-purple-300"
            >
              {realTimeData.rmssd > 50 ? "Good" : realTimeData.rmssd > 20 ? "Fair" : "Low"}
            </Badge>
          </CardContent>
        </Card>

        {/* Anxiety Level */}
        <Card className={`border-${realTimeData.anxietyLevel === 'High' ? 'red' : realTimeData.anxietyLevel === 'Medium' ? 'orange' : 'green'}-200 bg-${realTimeData.anxietyLevel === 'High' ? 'red' : realTimeData.anxietyLevel === 'Medium' ? 'orange' : 'green'}-50`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-medium text-${realTimeData.anxietyLevel === 'High' ? 'red' : realTimeData.anxietyLevel === 'Medium' ? 'orange' : 'green'}-700 flex items-center gap-2`}>
              <Zap className="w-4 h-4" />
              Stress Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold text-${realTimeData.anxietyLevel === 'High' ? 'red' : realTimeData.anxietyLevel === 'Medium' ? 'orange' : 'green'}-600`}>
              {realTimeData.anxietyLevel}
            </div>
            <div className={`text-xs text-${realTimeData.anxietyLevel === 'High' ? 'red' : realTimeData.anxietyLevel === 'Medium' ? 'orange' : 'green'}-500`}>
              Based on ECG analysis
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ECG Waveform Chart */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            ECG Signal Waveform
          </CardTitle>
          <div className="text-sm text-gray-600">
            Real-time ECG signal visualization • Device: {realTimeData.userId?.slice(-8)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-black rounded-lg p-4 h-48 relative overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 800 150" className="absolute inset-0">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0f4a1e" strokeWidth="0.5" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* ECG Waveform */}
              <polyline
                fill="none"
                stroke="#00ff00"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={ecgHistory.map((value, index) => {
                  const x = (index / 49) * 800
                  const y = 75 + (value - realTimeData.hp) * 2
                  return `${x},${Math.max(10, Math.min(140, y))}`
                }).join(' ')}
              />
              
              {/* Current value indicator */}
              {ecgHistory.length > 0 && (
                <circle
                  cx="780"
                  cy={Math.max(10, Math.min(140, 75 + (ecgHistory[ecgHistory.length - 1] - realTimeData.hp) * 2))}
                  r="3"
                  fill="#00ff00"
                  stroke="#fff"
                  strokeWidth="1"
                />
              )}
            </svg>
            
            {/* Signal info overlay */}
            <div className="absolute top-2 left-4 text-green-400 text-xs font-mono">
              <div>HP: {realTimeData.hp}</div>
              <div>Threshold: {realTimeData.threshold}</div>
              <div>Signal: {realTimeData.ecgSignal.toFixed(1)}</div>
            </div>
            
            {/* Heart rate overlay */}
            <div className="absolute top-2 right-4 text-red-400 text-xs font-mono">
              <div className="text-xl font-bold">{realTimeData.heartRate} BPM</div>
              <div>Baseline: {realTimeData.baselineHR}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ECG Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Signal className="w-5 h-5 text-blue-600" />
              ECG Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">HP Signal Strength</span>
              <span className="font-mono text-lg">{realTimeData.hp}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Detection Threshold</span>
              <span className="font-mono text-lg">{realTimeData.threshold}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Normalized ECG Signal</span>
              <span className="font-mono text-lg">{realTimeData.ecgSignal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Signal Quality</span>
              <Badge className={signalQuality.color + " text-white"}>
                {signalQuality.label}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Heart Rate Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              Heart Rate Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current Heart Rate</span>
              <span className="font-mono text-lg text-red-600">{realTimeData.heartRate} BPM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Baseline Heart Rate</span>
              <span className="font-mono text-lg">{realTimeData.baselineHR} BPM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">HR Trend</span>
              <span className="font-mono text-lg">{realTimeData.hrTrend}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">RMSSD (HRV)</span>
              <span className="font-mono text-lg">{realTimeData.rmssd.toFixed(1)} ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status</span>
              <Badge className={heartRateStatus.color + " bg-transparent border-current"}>
                {heartRateStatus.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data source info */}
      <Card className="bg-gray-50">
        <CardContent className="pt-4">
          <div className="text-xs text-gray-500 text-center">
            <div>Last Update: {realTimeData.lastUpdate.toLocaleString()}</div>
            <div>Data Source: ESP32 ECG Analysis via HiveMQ MQTT</div>
            <div>User ID: {realTimeData.userId}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
