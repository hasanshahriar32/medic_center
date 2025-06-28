"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, AlertTriangle, Target, Zap, BarChart3 } from "lucide-react"

export default function PredictiveAnalyticsPage({ realTimeData }) {
  const predictions = [
    {
      type: "Panic Attack",
      probability: realTimeData.anxietyLevel === "High" ? 85 : realTimeData.anxietyLevel === "Medium" ? 45 : 15,
      timeframe: "Next 30 minutes",
      confidence: 92,
      factors: ["Elevated HR", "EEG Patterns", "HRV Changes"],
    },
    {
      type: "Anxiety Episode",
      probability: realTimeData.anxietyLevel === "High" ? 75 : realTimeData.anxietyLevel === "Medium" ? 55 : 25,
      timeframe: "Next 2 hours",
      confidence: 88,
      factors: ["Alpha Wave Reduction", "Stress Markers", "Historical Pattern"],
    },
    {
      type: "Sleep Disturbance",
      probability: Math.floor(Math.random() * 40) + 30,
      timeframe: "Tonight",
      confidence: 76,
      factors: ["Circadian Rhythm", "Stress Level", "EEG Activity"],
    },
  ]

  const mlModels = [
    {
      name: "LSTM Neural Network",
      accuracy: 94.2,
      status: "active",
      lastTrained: "2 hours ago",
      dataPoints: "10.2M",
    },
    {
      name: "Random Forest Classifier",
      accuracy: 91.8,
      status: "active",
      lastTrained: "6 hours ago",
      dataPoints: "8.7M",
    },
    {
      name: "SVM Ensemble",
      accuracy: 89.5,
      status: "training",
      lastTrained: "1 day ago",
      dataPoints: "12.1M",
    },
  ]

  const getProbabilityColor = (prob) => {
    if (prob >= 70) return "text-red-600 bg-red-50 border-red-200"
    if (prob >= 40) return "text-orange-600 bg-orange-50 border-orange-200"
    return "text-green-600 bg-green-50 border-green-200"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "training":
        return "bg-blue-100 text-blue-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Predictive Analytics</h1>
          <p className="text-sm text-gray-600">AI-powered anxiety and panic attack prediction</p>
        </div>
      </div>

      {/* Current Risk Assessment */}
      <Card
        className={`border-2 ${
          realTimeData.anxietyLevel === "High"
            ? "bg-red-50 border-red-300"
            : realTimeData.anxietyLevel === "Medium"
              ? "bg-orange-50 border-orange-300"
              : "bg-green-50 border-green-300"
        }`}
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Current Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div
                className={`text-4xl font-bold font-mono mb-2 ${
                  realTimeData.anxietyLevel === "High"
                    ? "text-red-600"
                    : realTimeData.anxietyLevel === "Medium"
                      ? "text-orange-600"
                      : "text-green-600"
                }`}
              >
                {realTimeData.anxietyLevel}
              </div>
              <p className="text-sm text-gray-600">Overall Risk Level</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold font-mono text-blue-600 mb-2">
                {realTimeData.anxietyLevel === "High" ? "85%" : realTimeData.anxietyLevel === "Medium" ? "45%" : "15%"}
              </div>
              <p className="text-sm text-gray-600">Panic Attack Probability</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold font-mono text-purple-600 mb-2">92%</div>
              <p className="text-sm text-gray-600">Model Confidence</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {predictions.map((prediction, index) => (
          <Card key={index} className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                {prediction.type}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div
                  className={`text-3xl font-bold font-mono mb-2 ${
                    prediction.probability >= 70
                      ? "text-red-600"
                      : prediction.probability >= 40
                        ? "text-orange-600"
                        : "text-green-600"
                  }`}
                >
                  {prediction.probability}%
                </div>
                <p className="text-sm text-gray-600">{prediction.timeframe}</p>
              </div>

              <Progress value={prediction.probability} className="h-3" />

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Key Factors:</p>
                <div className="flex flex-wrap gap-1">
                  {prediction.factors.map((factor, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-500">Confidence: {prediction.confidence}%</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ML Models Status */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Machine Learning Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mlModels.map((model, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{model.name}</h3>
                      <p className="text-sm text-gray-600">Accuracy: {model.accuracy}%</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center">
                    <Badge className={getStatusColor(model.status)}>{model.status}</Badge>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Last Trained</p>
                      <p className="text-xs text-gray-500">{model.lastTrained}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Data Points</p>
                      <p className="text-xs text-gray-500">{model.dataPoints}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Importance */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Feature Importance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { feature: "Heart Rate Variability", importance: 92, color: "bg-red-500" },
              { feature: "EEG Alpha/Beta Ratio", importance: 88, color: "bg-purple-500" },
              { feature: "ECG QT Interval", importance: 76, color: "bg-blue-500" },
              { feature: "Respiratory Rate", importance: 65, color: "bg-green-500" },
              { feature: "Skin Conductance", importance: 58, color: "bg-orange-500" },
              { feature: "Movement Patterns", importance: 42, color: "bg-gray-500" },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.feature}</span>
                  <span className="font-mono text-gray-600">{item.importance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color} transition-all duration-300`}
                    style={{ width: `${item.importance}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
