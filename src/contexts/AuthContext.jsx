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
import { initializeUserProfile, getCompleteProfile } from '../lib/reputationService'

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [userFullProfile, setUserFullProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // ── Helpers ────────────────────────────────────────────────────────────────

  async function loadFullProfile(userId, role) {
    if (!userId || !role) return
    const full = await getCompleteProfile(userId, role)
    setUserFullProfile(full)
  }

  async function createUserDoc(firebaseUser, extra = {}) {
    const ref = doc(db, 'users', firebaseUser.uid)
    const snap = await getDoc(ref)
    const role = extra.role ?? (snap.exists() ? snap.data().role : 'farmer')
    const displayName = extra.displayName ?? (snap.exists() ? snap.data().displayName : (firebaseUser.displayName || ''))

    if (!snap.exists()) {
      await setDoc(ref, {
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? null,
        phone: firebaseUser.phoneNumber ?? null,
        displayName: displayName || null,
        photoURL: firebaseUser.photoURL ?? null,
        role: role,
        createdAt: serverTimestamp(),
        ...extra,
      })
      
      // Initialize reputation & role sub-documents
      await initializeUserProfile(firebaseUser.uid, role, displayName, {
        email: firebaseUser.email,
        phone: firebaseUser.phoneNumber,
        ...extra
      })
    } else {
      // Ensure subdocs exist (fallback for legacy or half-created accounts)
      const repRef = doc(db, 'user_reputation', firebaseUser.uid)
      const repSnap = await getDoc(repRef)
      if (!repSnap.exists()) {
        await initializeUserProfile(firebaseUser.uid, role, displayName, {
          email: firebaseUser.email || snap.data().email,
          phone: firebaseUser.phoneNumber || snap.data().phone,
          ...extra
        })
      }
    }

    const updated = await getDoc(ref)
    const userData = updated.data()
    setUserProfile(userData)
    await loadFullProfile(firebaseUser.uid, userData.role)
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

  function setupRecaptcha(containerId) {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear()
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {},
    })
    return window.recaptchaVerifier
  }

  async function sendOTP(phoneNumber, recaptchaVerifier) {
    const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
    return confirmation
  }

  async function verifyOTP(confirmationResult, otp) {
    const cred = await confirmationResult.confirm(otp)
    await createUserDoc(cred.user)
    return cred
  }

  // ── Sign Out ───────────────────────────────────────────────────────────────

  async function logOut() {
    await signOut(auth)
    setUserProfile(null)
    setUserFullProfile(null)
  }

  // ── Auth State Listener ────────────────────────────────────────────────────

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        const ref = doc(db, 'users', user.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          const userData = snap.data()
          setUserProfile(userData)
          await loadFullProfile(user.uid, userData.role)
        } else {
          await createUserDoc(user)
        }
      } else {
        setUserProfile(null)
        setUserFullProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  // ── Context Value ──────────────────────────────────────────────────────────

  const value = {
    currentUser,
    userProfile,
    userFullProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    setupRecaptcha,
    sendOTP,
    verifyOTP,
    logOut,
    refreshProfile: () => currentUser && userProfile && loadFullProfile(currentUser.uid, userProfile.role)
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
