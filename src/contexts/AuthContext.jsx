import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, googleProvider, db } from '../lib/firebase'

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // ── Helpers ────────────────────────────────────────────────────────────────

  async function createUserDoc(firebaseUser, extra = {}) {
    const ref = doc(db, 'users', firebaseUser.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? null,
        phone: firebaseUser.phoneNumber ?? null,
        displayName: firebaseUser.displayName ?? extra.displayName ?? null,
        photoURL: firebaseUser.photoURL ?? null,
        role: extra.role ?? 'farmer',
        createdAt: serverTimestamp(),
        ...extra,
      })
    }
    const updated = await getDoc(ref)
    setUserProfile(updated.data())
  }

  // ── Email / Password ───────────────────────────────────────────────────────

  async function signUp(email, password, displayName, role = 'farmer') {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName })
    await createUserDoc(cred.user, { displayName, role })
    return cred
  }

  async function signIn(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    await createUserDoc(cred.user)
    return cred
  }

  // ── Google ─────────────────────────────────────────────────────────────────

  async function signInWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider)
    await createUserDoc(cred.user)
    return cred
  }

  // ── Phone / OTP ────────────────────────────────────────────────────────────

  /**
   * Call once to attach an invisible reCAPTCHA to the given container element id.
   * Returns the RecaptchaVerifier instance — keep it in component state.
   */
  function setupRecaptcha(containerId) {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear()
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {}, // reCAPTCHA solved — allow signInWithPhoneNumber
    })
    return window.recaptchaVerifier
  }

  /**
   * Step 1: send OTP.  Returns a confirmationResult.
   * phoneNumber must include country code, e.g. "+233241234567"
   */
  async function sendOTP(phoneNumber, recaptchaVerifier) {
    const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
    return confirmation
  }

  /**
   * Step 2: verify OTP.
   * confirmationResult comes from sendOTP(); otp is the 6-digit code.
   */
  async function verifyOTP(confirmationResult, otp) {
    const cred = await confirmationResult.confirm(otp)
    await createUserDoc(cred.user)
    return cred
  }

  // ── Sign Out ───────────────────────────────────────────────────────────────

  async function logOut() {
    await signOut(auth)
    setUserProfile(null)
  }

  // ── Auth State Listener ────────────────────────────────────────────────────

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        const ref = doc(db, 'users', user.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) setUserProfile(snap.data())
        else await createUserDoc(user)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  // ── Context Value ──────────────────────────────────────────────────────────

  const value = {
    currentUser,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    setupRecaptcha,
    sendOTP,
    verifyOTP,
    logOut,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
