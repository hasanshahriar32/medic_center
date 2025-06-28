import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "MedWatch AI - Medical Monitoring Dashboard",
  description: "Real-time MQTT medical monitoring with AI-powered anxiety and panic attack prediction",
  keywords: ["medical", "monitoring", "MQTT", "IoT", "healthcare", "AI", "anxiety", "panic attack", "EEG", "ECG"],
  authors: [{ name: "MedWatch AI Team" }],
  creator: "MedWatch AI",
  publisher: "MedWatch AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MedWatch AI - Medical Monitoring Dashboard",
    description: "Real-time MQTT medical monitoring with AI-powered predictions",
    url: "/",
    siteName: "MedWatch AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MedWatch AI Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MedWatch AI - Medical Monitoring Dashboard",
    description: "Real-time MQTT medical monitoring with AI-powered predictions",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.svg",
        color: "#2563eb",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MedWatch AI",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "MedWatch AI",
    "application-name": "MedWatch AI",
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#2563eb",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
  colorScheme: "light",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="background-color" content="#ffffff" />
        <meta name="display" content="standalone" />
        <meta name="orientation" content="portrait-primary" />

        {/* iOS Specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MedWatch AI" />

        {/* Windows Specific */}
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://38f07a1ee3754972a26af0f040402fde.s1.eu.hivemq.cloud" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//38f07a1ee3754972a26af0f040402fde.s1.eu.hivemq.cloud" />
      </head>
      <body className="bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 antialiased">{children}</body>
    </html>
  )
}
