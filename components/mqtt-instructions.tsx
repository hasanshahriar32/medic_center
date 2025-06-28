"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Wifi, Zap, AlertTriangle } from "lucide-react"

interface MQTTInstructionsProps {
  userId: string
}

export function MQTTInstructions({ userId }: MQTTInstructionsProps) {
  const connectionConfig = {
    broker: "mqtts://38f07a1ee3754972a26af0f040402fde.s1.eu.hivemq.cloud:8883",
    username: "Paradox",
    password: "Paradox1",
    topics: {
      heartRate: "mrhasan/heart",
      eeg: "mrhasan/eeg",
      ecg: "mrhasan/ecg",
      vitals: "mrhasan/vitals",
    },
  }

  const exampleHeartRate = {
    userId: userId,
    dataType: "heartRate",
    bpm: 75,
    signal: 85,
    timestamp: "2025-01-28T10:43:51.123Z",
    deviceId: "esp32_001",
  }

  const exampleEEG = {
    userId: userId,
    dataType: "eeg",
    eegAlpha: 8.5,
    signal: 92,
    timestamp: "2025-01-28T10:43:52.456Z",
    deviceId: "neurosky_001",
  }

  return (
    <div className="space-y-6">
      {/* Connection Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-blue-600" />
            MQTT Connection Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Broker URL</label>
              <div className="bg-gray-100 p-2 rounded font-mono text-sm break-all">{connectionConfig.broker}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Username</label>
              <div className="bg-gray-100 p-2 rounded font-mono text-sm">{connectionConfig.username}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="bg-gray-100 p-2 rounded font-mono text-sm">{connectionConfig.password}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Your User ID</label>
              <div className="bg-blue-100 p-2 rounded font-mono text-sm text-blue-800 break-all">{userId}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-600" />
            MQTT Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(connectionConfig.topics).map(([type, topic]) => (
              <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium text-gray-700 capitalize">{type}</span>
                <Badge variant="outline" className="font-mono">
                  {topic}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Format Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-green-600" />
            Data Format Examples
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Heart Rate Data (Topic: mrhasan/heart)</h4>
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(exampleHeartRate, null, 2)}
            </pre>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">EEG Data (Topic: mrhasan/eeg)</h4>
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(exampleEEG, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Required Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Required Fields
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800">Required</Badge>
              <code className="font-mono">userId</code>
              <span className="text-gray-600">- Your Firebase UID (shown above)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800">Required</Badge>
              <code className="font-mono">dataType</code>
              <span className="text-gray-600">- "heartRate", "eeg", "ecg", or "vitals"</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800">Required</Badge>
              <code className="font-mono">timestamp</code>
              <span className="text-gray-600">- ISO 8601 format</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-800">Optional</Badge>
              <code className="font-mono">signal</code>
              <span className="text-gray-600">- Signal quality (0-100%)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-800">Optional</Badge>
              <code className="font-mono">deviceId</code>
              <span className="text-gray-600">- Unique device identifier</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
