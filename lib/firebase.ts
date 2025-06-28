import { initializeApp, getApps, getApp } from "firebase/app"
import type { Auth } from "firebase/auth"

// --- Firebase config -------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyDJ8fHGVciQhN96ZXU1TWNMqFmciffasgk",
  authDomain: "medic-centre.firebaseapp.com",
  projectId: "medic-centre",
  storageBucket: "medic-centre.firebasestorage.app",
  messagingSenderId: "338115309172",
  appId: "1:338115309172:web:f071b81df690c08e2feb21",
  measurementId: "G-1KPSYZ4GRC",
}

// --- Always (client & server) initialise/get the Firebase App -------------
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// --- Lazy-load browser-only SDKs ------------------------------------------
let auth: Auth | null = null
let analytics: any = null

if (typeof window !== "undefined") {
  // “require” is safe here because this code only runs in the browser bundle
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getAuth } = require("firebase/auth")
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getAnalytics } = require("firebase/analytics")

  auth = getAuth(firebaseApp)
  analytics = getAnalytics(firebaseApp)
}

// Export a non-null auth only on the client; server code should guard for null
export { firebaseApp as app, auth, analytics }
