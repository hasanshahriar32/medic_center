"use client"

import { firebaseApp } from "./firebase-app"
import type { Auth, User, UserCredential, NextOrObserver } from "firebase/auth"

/**
 * Singleton Auth instance.
 */
let authInstance: Auth | null = null

/**
 * Dynamically load `firebase/auth` only in the browser and make sure the
 * component registry is ready **before** `getAuth` is called.
 */
async function loadAuth(): Promise<{
  auth: Auth
  mod: typeof import("firebase/auth")
}> {
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth can only be used in the browser.")
  }

  if (authInstance) {
    const mod = await import("firebase/auth")
    return { auth: authInstance, mod }
  }

  // Import the full auth module – this registers the "auth" component.
  const mod = await import("firebase/auth")

  // Now it is safe to call getAuth().
  authInstance = mod.getAuth(firebaseApp)
  return { auth: authInstance, mod }
}

/* ------------------------------------------------------------------ */
/*  Convenience wrappers                                               */
/* ------------------------------------------------------------------ */

export async function signInWithEmail(email: string, password: string): Promise<UserCredential> {
  const { auth, mod } = await loadAuth()
  return mod.signInWithEmailAndPassword(auth, email, password)
}

export async function createUserWithEmail(email: string, password: string): Promise<UserCredential> {
  const { auth, mod } = await loadAuth()
  return mod.createUserWithEmailAndPassword(auth, email, password)
}

export async function onAuthStateChangedClient(cb: NextOrObserver<User>): Promise<() => void> {
  const { auth, mod } = await loadAuth()
  return mod.onAuthStateChanged(auth, cb)
}

export async function signOutClient(): Promise<void> {
  const { auth, mod } = await loadAuth()
  return mod.signOut(auth)
}
