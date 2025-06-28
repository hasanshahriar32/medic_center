"use client"

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import type { Auth, User, UserCredential, NextOrObserver } from "firebase/auth"

let _firebaseApp: FirebaseApp | undefined
let _auth: Auth | undefined

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

/**
 * Initialize Firebase Auth safely - only in browser
 */
export async function initializeFirebaseAuth(): Promise<Auth | null> {
  if (typeof window === "undefined") {
    console.log("🚫 Firebase Auth: Server-side execution blocked")
    return null
  }

  try {
    // Initialize Firebase App if needed
    if (!_firebaseApp) {
      _firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
      console.log("🔥 Firebase App initialized")
    }

    // Initialize Auth if needed
    if (!_auth) {
      const { getAuth, connectAuthEmulator } = await import("firebase/auth")
      _auth = getAuth(_firebaseApp)

      // Connect to emulator in development if needed
      if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL) {
        try {
          connectAuthEmulator(_auth, process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL)
          console.log("🔧 Firebase Auth Emulator connected")
        } catch (error) {
          console.log("⚠️ Auth emulator already connected or not available")
        }
      }

      console.log("🔐 Firebase Auth initialized")
    }

    return _auth
  } catch (error) {
    console.error("❌ Firebase Auth initialization error:", error)
    return null
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<UserCredential> {
  const auth = await initializeFirebaseAuth()
  if (!auth) throw new Error("Firebase Auth not available")

  const { signInWithEmailAndPassword } = await import("firebase/auth")
  return signInWithEmailAndPassword(auth, email, password)
}

/**
 * Create user with email and password
 */
export async function createUserWithEmail(email: string, password: string): Promise<UserCredential> {
  const auth = await initializeFirebaseAuth()
  if (!auth) throw new Error("Firebase Auth not available")

  const { createUserWithEmailAndPassword } = await import("firebase/auth")
  return createUserWithEmailAndPassword(auth, email, password)
}

/**
 * Listen to auth state changes
 */
export async function onAuthStateChangedClient(callback: NextOrObserver<User>): Promise<() => void> {
  const auth = await initializeFirebaseAuth()
  if (!auth) {
    console.warn("⚠️ Firebase Auth not available for state listener")
    return () => {}
  }

  const { onAuthStateChanged } = await import("firebase/auth")
  return onAuthStateChanged(auth, callback)
}

/**
 * Sign out current user
 */
export async function signOutClient(): Promise<void> {
  const auth = await initializeFirebaseAuth()
  if (!auth) throw new Error("Firebase Auth not available")

  const { signOut } = await import("firebase/auth")
  return signOut(auth)
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const auth = await initializeFirebaseAuth()
  return auth?.currentUser || null
}
