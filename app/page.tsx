"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Activity, Heart, Brain, AlertTriangle, Bell, RefreshCw, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import PatientMonitoringPage from "./patient-monitoring/page"
import VitalSignsPage from "./vital-signs/page"
import PredictiveAnalyticsPage from "./predictive-analytics/page"
import AlertsPage from "./alerts/page"
import SystemStatusPage from "./system-status/page"

export default function MedicalDashboard() {
  const [activeSection, setActiveSection] = useState("monitoring")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState("connected")
  const [realTimeData, setRealTimeData] = useState({
    heartRate: 72,
    eegAlpha: 8.5,
    ecgSignal: 85,
    anxietyLevel: "Low",
    lastUpdate: new Date(),
  })

  // Simulate real-time data updates (replace with actual Socket.IO connection)
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 BPM
        eegAlpha: Math.random() * 5 + 6, // 6-11 Hz
        ecgSignal: Math.floor(Math.random() * 30) + 70, // 70-100
        anxietyLevel: Math.random() > 0.7 ? "High" : Math.random() > 0.4 ? "Medium" : "Low",
        lastUpdate: new Date(),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-72"} bg-white border-r border-gray-200 shadow-lg transition-all duration-300 fixed md:relative z-50 md:z-auto h-full md:h-auto ${!sidebarCollapsed ? "md:block" : ""}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <h1 className="text-blue-600 font-bold text-lg tracking-wide">MedWatch AI</h1>
              <p className="text-gray-500 text-xs">Real-Time Medical Monitoring</p>
              <p className="text-gray-400 text-xs">v3.2.1 HIPAA Compliant</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-400 hover:text-blue-600"
            >
              <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
              />
            </Button>
          </div>

          <nav className="space-y-2">
            {[
              { id: "monitoring", icon: Activity, label: "PATIENT MONITORING", color: "text-blue-600" },
              { id: "vitals", icon: Heart, label: "VITAL SIGNS", color: "text-red-500" },
              { id: "analytics", icon: Brain, label: "PREDICTIVE ANALYTICS", color: "text-purple-600" },
              { id: "alerts", icon: AlertTriangle, label: "ALERTS & WARNINGS", color: "text-orange-500" },
              { id: "system", icon: Zap, label: "SYSTEM STATUS", color: "text-green-600" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <item.icon className={`w-5 h-5 ${activeSection === item.id ? item.color : ""}`} />
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${connectionStatus === "connected" ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <span className="text-xs text-gray-700 font-medium">SYSTEM STATUS</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Heart Rate:</span>
                  <span className="font-mono text-red-600">{realTimeData.heartRate} BPM</span>
                </div>
                <div className="flex justify-between">
                  <span>EEG Alpha:</span>
                  <span className="font-mono text-purple-600">{realTimeData.eegAlpha.toFixed(1)} Hz</span>
                </div>
                <div className="flex justify-between">
                  <span>Anxiety Level:</span>
                  <span
                    className={`font-mono ${
                      realTimeData.anxietyLevel === "High"
                        ? "text-red-600"
                        : realTimeData.anxietyLevel === "Medium"
                          ? "text-orange-500"
                          : "text-green-600"
                    }`}
                  >
                    {realTimeData.anxietyLevel}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Last Update: {realTimeData.lastUpdate.toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${!sidebarCollapsed ? "md:ml-0" : ""}`}>
        {/* Top Header */}
        <div className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Multimodal Prediction System</span>
              <span className="mx-2">•</span>
              <span className="text-blue-600 font-medium">
                {activeSection === "monitoring"
                  ? "Patient Monitoring"
                  : activeSection === "vitals"
                    ? "Vital Signs"
                    : activeSection === "analytics"
                      ? "Predictive Analytics"
                      : activeSection === "alerts"
                        ? "Alerts & Warnings"
                        : "System Status"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-500">Last Sync: {new Date().toLocaleTimeString()}</div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${connectionStatus === "connected" ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <span className="text-xs text-gray-600">
                {connectionStatus === "connected" ? "Connected" : "Disconnected"}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 to-indigo-100">
          {activeSection === "monitoring" && <PatientMonitoringPage realTimeData={realTimeData} />}
          {activeSection === "vitals" && <VitalSignsPage realTimeData={realTimeData} />}
          {activeSection === "analytics" && <PredictiveAnalyticsPage realTimeData={realTimeData} />}
          {activeSection === "alerts" && <AlertsPage realTimeData={realTimeData} />}
          {activeSection === "system" && <SystemStatusPage realTimeData={realTimeData} />}
        </div>
      </div>
    </div>
  )
}
