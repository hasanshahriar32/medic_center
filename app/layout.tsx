import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "MedWatch AI - Medical Monitoring Dashboard",
  description: "Multimodal Prediction of Anxiety and Panic Attacks Using EEG and Heart Rate Variability",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 antialiased">{children}</body>
    </html>
  )
}
