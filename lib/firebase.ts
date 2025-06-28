// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJ8fHGVciQhN96ZXU1TWNMqFmciffasgk",
  authDomain: "medic-centre.firebaseapp.com",
  projectId: "medic-centre",
  storageBucket: "medic-centre.firebasestorage.app",
  messagingSenderId: "338115309172",
  appId: "1:338115309172:web:f071b81df690c08e2feb21",
  measurementId: "G-1KPSYZ4GRC",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Initialize Analytics only on client side
let analytics
if (typeof window !== "undefined") {
  analytics = getAnalytics(app)
}

export { analytics }
export default app
