import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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
    const role = extra.role || 'farmer'
    const displayName = extra.displayName || firebaseUser.displayName || 'Demo User'

    const fallbackUserData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? null,
      phone: firebaseUser.phoneNumber ?? null,
      displayName: displayName,
      photoURL: firebaseUser.photoURL ?? null,
      role: role,
    }

    try {
      const ref = doc(db, 'users', firebaseUser.uid)
      const snap = await getDoc(ref)
      const finalRole = extra.role ?? (snap.exists() ? snap.data().role : 'farmer')
      const finalName = extra.displayName ?? (snap.exists() ? snap.data().displayName : (firebaseUser.displayName || 'Demo User'))

      if (!snap.exists()) {
        await setDoc(ref, {
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? null,
          phone: firebaseUser.phoneNumber ?? null,
          displayName: finalName,
          photoURL: firebaseUser.photoURL ?? null,
          role: finalRole,
          createdAt: serverTimestamp(),
          ...extra,
        })
        
        // Initialize reputation & role sub-documents
        await initializeUserProfile(firebaseUser.uid, finalRole, finalName, {
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber,
          ...extra
        })
      } else {
        // Ensure subdocs exist (fallback for legacy or half-created accounts)
        const repRef = doc(db, 'user_reputation', firebaseUser.uid)
        const repSnap = await getDoc(repRef)
        if (!repSnap.exists()) {
          await initializeUserProfile(firebaseUser.uid, finalRole, finalName, {
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
    } catch (dbError) {
      console.warn("Firestore database write failed. Falling back to local profile state.", dbError)
      setUserProfile(fallbackUserData)
      setUserFullProfile({
        user: fallbackUserData,
        verification: {
          phone_verified: !!firebaseUser.phoneNumber,
          email_verified: !!firebaseUser.email,
          national_id_verified: false,
          location_verified: true,
        },
        reputation: {
          completed_transactions: 0,
          successful_transactions: 0,
          average_rating: 5.0,
          response_rate: 1.0,
          reputation_level: 'New Member'
        },
        roleProfile: {
          farm_name: role === 'farmer' ? `${displayName}'s Farm` : undefined,
          business_name: role === 'buyer' ? `${displayName} Enterprises` : undefined,
          verification_status: role === 'farmer' ? 'New Farmer' : role === 'buyer' ? 'New Buyer' : 'New Transporter',
          completed_orders: 0,
          average_rating: 5.0,
          response_rate: 1.0,
          joined_date: new Date().toISOString()
        }
      })
    }
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

  async function signInWithGoogle(role = 'farmer') {
    // Store chosen role in localStorage so we can retrieve it after redirect completes
    localStorage.setItem('agro_registration_role', role)
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      await createUserDoc(cred.user, { role })
      return cred
    } catch (err) {
      // Fallback to redirect if popup fails or gets blocked due to browser COOP policies
      const isPopupBlocked = 
        err.code === 'auth/popup-blocked' || 
        err.code === 'auth/popup-closed-by-user' || 
        err.code === 'auth/cancelled-popup-request' ||
        err.message?.includes('Cross-Origin-Opener-Policy')
        
      if (isPopupBlocked) {
        console.warn("Google Sign-In Popup blocked or failed. Attempting Redirect fallback...")
        await signInWithRedirect(auth, googleProvider)
      } else {
        throw err
      }
    }
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

  async function verifyOTP(confirmationResult, otp, role = 'farmer') {
    const cred = await confirmationResult.confirm(otp)
    await createUserDoc(cred.user, { role })
    return cred
  }

  // ── Sign Out ───────────────────────────────────────────────────────────────

  async function logOut() {
    await signOut(auth)
    setUserProfile(null)
    setUserFullProfile(null)
  }

  // ── Auth State Listener & Redirect handler ─────────────────────────────────

  useEffect(() => {
    // 1. Process Google Sign-in redirect results on load
    getRedirectResult(auth)
      .then(async (cred) => {
        if (cred) {
          const savedRole = localStorage.getItem('agro_registration_role') || 'farmer'
          await createUserDoc(cred.user, { role: savedRole })
        }
      })
      .catch((err) => {
        console.error("Firebase Redirect Sign-in result error:", err)
      })

    // 2. Listen to state changes
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
