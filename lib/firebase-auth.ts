"use client"

import { firebaseApp } from "./firebase-app"
import type { Auth, UserCredential, User, UserCredential as UC, NextOrObserver } from "firebase/auth"

let authInstance: Auth | null = null

// Dynamically load the Auth SDK only in the browser
async function loadAuth(): Promise<Auth> {
  if (authInstance) return authInstance
  const { getAuth } = await import("firebase/auth")
  authInstance = getAuth(firebaseApp)
  return authInstance
}

/* ------------------------------------------------------------------ */
/*  Convenience wrappers – imported functions are also lazy-loaded.   */
/* ------------------------------------------------------------------ */
export async function signInWithEmail(email: string, password: string): Promise<UC> {
  const [{ signInWithEmailAndPassword }, auth] = await Promise.all([import("firebase/auth").then((m) => m), loadAuth()])
  return signInWithEmailAndPassword(auth, email, password)
}

export async function createUserWithEmail(email: string, password: string): Promise<UserCredential> {
  const [{ createUserWithEmailAndPassword }, auth] = await Promise.all([
    import("firebase/auth").then((m) => m),
    loadAuth(),
  ])
  return createUserWithEmailAndPassword(auth, email, password)
}

export async function onAuthStateChangedClient(cb: NextOrObserver<User>): Promise<() => void> {
  const [{ onAuthStateChanged }, auth] = await Promise.all([import("firebase/auth").then((m) => m), loadAuth()])
  return onAuthStateChanged(auth, cb)
}

export async function signOutClient(): Promise<void> {
  const [{ signOut }, auth] = await Promise.all([import("firebase/auth").then((m) => m), loadAuth()])
  return signOut(auth)
}
