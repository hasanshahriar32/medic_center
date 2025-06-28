import { initializeApp, getApps, getApp } from "firebase/app"

export const firebaseConfig = {
  apiKey: "AIzaSyDJ8fHGVciQhN96ZXU1TWNMqFmciffasgk",
  authDomain: "medic-centre.firebaseapp.com",
  projectId: "medic-centre",
  storageBucket: "medic-centre.firebasestorage.app",
  messagingSenderId: "338115309172",
  appId: "1:338115309172:web:f071b81df690c08e2feb21",
  measurementId: "G-1KPSYZ4GRC",
}

// Initialize (or re-use) the app – this works in every environment.
export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
