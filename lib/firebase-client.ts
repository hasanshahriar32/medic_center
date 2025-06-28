"use client"

import { firebaseApp } from "./firebase-app"
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics"

export const auth = getAuth(firebaseApp)
export const analytics = typeof window !== "undefined" ? getAnalytics(firebaseApp) : null
