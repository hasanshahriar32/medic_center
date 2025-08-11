"use client"

import { useState, useEffect } from "react"
import { onAuthStateChangedClient, signOutClient } from "@/lib/firebase-auth"
import { ChevronRight, Activity, Heart, Signal, AlertTriangle, Bell, RefreshCw, Zap, LogOut, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRealTimeData } from "@/hooks/useRealTimeData"
import { ECGDashboard } from "@/components/ecg-dashboard"
import PatientMonitoringPage from "./patient-monitoring/page"
import VitalSignsPage from "./vital-signs/page"
import PredictiveAnalyticsPage from "./predictive-analytics/page"
import AlertsPage from "./alerts/page"
import SystemStatusPage from "./system-status/page"
import { MQTTInstructions } from "@/components/mqtt-instructions"

export default function MedicalDashboard() {
  const [activeSection, setActiveSection] = useState("ecg")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const { realTimeData, connectionStatus, refreshData } = useRealTimeData()

  useEffect(() => {
    const unsubscribePromise = onAuthStateChangedClient((user) => {
      if (user) {
        setUser(user)
      } else {
        // Redirect to login if not authenticated
        window.location.href = "/auth/login"
      }
      setLoading(false)
    })

    return () => {
      unsubscribePromise.then((unsub) => unsub())
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await signOutClient()
      window.location.href = "/auth/login"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading MedWatch AI...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-72"} bg-white border-r border-gray-200 shadow-lg transition-all duration-300 fixed md:relative z-50 md:z-auto h-full md:h-auto ${!sidebarCollapsed ? "md:block" : ""}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <h1 className="text-blue-600 font-bold text-lg tracking-wide">ECG Monitor AI</h1>
              <p className="text-gray-500 text-xs">Real-Time ECG Analysis</p>
              <p className="text-gray-400 text-xs">v3.2.1 HIPAA Compliant</p>
              {user && (
                <div className="text-gray-600 text-xs mt-2 space-y-1">
                  <p>Welcome, {user.email}</p>
                  <div className="bg-gray-100 p-2 rounded border">
                    <p className="font-medium text-gray-700">MQTT User ID:</p>
                    <p className="font-mono text-xs text-blue-600 break-all">{user.uid}</p>
                    <p className="text-gray-500 text-xs mt-1">Use this ID in your IoT device</p>
                  </div>
                </div>
              )}
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
              { id: "ecg", icon: Activity, label: "ECG DASHBOARD", color: "text-blue-600" },
              { id: "monitoring", icon: Heart, label: "PATIENT MONITORING", color: "text-red-500" },
              { id: "vitals", icon: Signal, label: "VITAL SIGNS", color: "text-green-500" },
              { id: "analytics", icon: Zap, label: "ECG ANALYTICS", color: "text-purple-600" },
              { id: "alerts", icon: AlertTriangle, label: "ALERTS & WARNINGS", color: "text-orange-500" },
              { id: "system", icon: Wifi, label: "SYSTEM STATUS", color: "text-cyan-600" },
              { id: "mqtt", icon: Wifi, label: "MQTT SETUP", color: "text-gray-600" },
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
            <>
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${connectionStatus === "connected" ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span className="text-xs text-gray-700 font-medium">ECG MONITOR STATUS</span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Heart Rate:</span>
                    <span className="font-mono text-red-600">{realTimeData.heartRate} BPM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ECG Signal:</span>
                    <span className="font-mono text-blue-600">{realTimeData.ecgSignal.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HP Value:</span>
                    <span className="font-mono text-green-600">{realTimeData.hp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Baseline HR:</span>
                    <span className="font-mono text-gray-600">{realTimeData.baselineHR}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RMSSD:</span>
                    <span className="font-mono text-purple-600">{realTimeData.rmssd.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HR Trend:</span>
                    <span className="font-mono text-indigo-600">{realTimeData.hrTrend}</span>
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
                  <div className="text-xs text-gray-400 mt-1">
                    User: {realTimeData.userId?.slice(-8)}
                  </div>
                </div>
              </div>

              <Button onClick={handleSignOut} variant="ghost" className="w-full mt-4 text-gray-600 hover:text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
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
              <span className="font-medium text-gray-800">ECG Medical Monitoring</span>
              <span className="mx-2">•</span>
              <span className="text-blue-600 font-medium">
                {activeSection === "ecg"
                  ? "ECG Dashboard"
                  : activeSection === "monitoring"
                    ? "Patient Monitoring"
                    : activeSection === "vitals"
                      ? "Vital Signs"
                      : activeSection === "analytics"
                        ? "ECG Analytics"
                        : activeSection === "alerts"
                          ? "Alerts & Warnings"
                          : activeSection === "system"
                            ? "System Status"
                            : "MQTT Setup"}
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
                {connectionStatus === "connected" ? "ECG Monitor Connected" : "ECG Monitor Disconnected"}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600" onClick={refreshData}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 to-indigo-100">
          {activeSection === "ecg" && (
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">ECG Monitoring Dashboard</h1>
                <p className="text-gray-600">Real-time ECG analysis and heart rate monitoring</p>
              </div>
              <ECGDashboard realTimeData={realTimeData} />
            </div>
          )}
          {activeSection === "monitoring" && <PatientMonitoringPage realTimeData={realTimeData} />}
          {activeSection === "vitals" && <VitalSignsPage />}
          {activeSection === "analytics" && <PredictiveAnalyticsPage realTimeData={realTimeData} />}
          {activeSection === "alerts" && <AlertsPage realTimeData={realTimeData} />}
          {activeSection === "system" && <SystemStatusPage realTimeData={realTimeData} />}
          {activeSection === "mqtt" && (
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">MQTT Setup Instructions</h1>
                <p className="text-sm text-gray-600">Configure your IoT devices to send sensor data</p>
              </div>
              {user && <MQTTInstructions userId={user.uid} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
