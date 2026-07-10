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
  sendPasswordResetEmail,
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
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false)

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
          community: extra.community ?? null,
          createdAt: serverTimestamp(),
          profileComplete: false, // Track if profile is complete
          ...extra,
        })
        
        // Initialize reputation & role sub-documents
        await initializeUserProfile(firebaseUser.uid, finalRole, finalName, {
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber,
          ...extra
        })
        
        // New user needs profile completion
        setNeedsProfileCompletion(true)
      } else {
        // Check if profile is complete
        const userData = snap.data()
        if (!userData.profileComplete) {
          setNeedsProfileCompletion(true)
        }
        
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
      localStorage.setItem(`agro_role_${firebaseUser.uid}`, userData.role)
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

  async function signUp(email, password, displayName, role = 'farmer', phone = '', extra = {}) {
    localStorage.setItem('agro_is_registering', 'true')
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName })
    localStorage.setItem(`agro_role_${cred.user.uid}`, role)
    // For transporters: default to pending_review so admin can approve them
    const transportExtra = role === 'transport'
      ? { verification_status: 'pending_review', ...extra }
      : extra
    await createUserDoc(cred.user, { displayName, role, phone, ...transportExtra })
    localStorage.removeItem('agro_is_registering')
    return cred
  }

  async function signIn(email, password) {
    // ── Admin Persona Bypass ─────────────────────────────────────────────────
    if (email.trim().toLowerCase() === 'admin@nunya.com' && password === 'admin000') {
      const mockAdmin = {
        uid: 'admin_root',
        email: 'admin@nunya.com',
        displayName: 'Root Admin',
        photoURL: null,
        phone: null,
        role: 'admin',
      }
      setCurrentUser(mockAdmin)
      setUserProfile(mockAdmin)
      setUserFullProfile({
        user: mockAdmin,
        verification: { phone_verified: true, email_verified: true, national_id_verified: true, location_verified: true },
        reputation: { average_rating: 5.0, reputation_level: 'Trusted Member', completed_transactions: 0 },
        roleProfile: { verification_status: 'Admin', joined_date: new Date().toISOString() }
      })
      localStorage.setItem('agro_role_admin_root', 'admin')
      return { user: mockAdmin }
    }
    // ── Normal Firebase Sign-In ───────────────────────────────────────────────
    const cred = await signInWithEmailAndPassword(auth, email, password)
    
    // Check if the user document exists in firestore
    const ref = doc(db, 'users', cred.user.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await signOut(auth)
      const err = new Error('No registered account found for this email. Please register first.')
      err.code = 'auth/user-not-found'
      throw err
    }
    
    const savedRole = snap.data().role || 'farmer'
    localStorage.setItem(`agro_role_${cred.user.uid}`, savedRole)
    setUserProfile(snap.data())
    await loadFullProfile(cred.user.uid, savedRole)
    return cred
  }

  // ── Google ─────────────────────────────────────────────────────────────────

  async function signInWithGoogle(role = 'farmer', existingOnly = false, extra = {}) {
    localStorage.setItem('agro_google_login_type', existingOnly ? 'existing' : 'register')
    localStorage.setItem('agro_registration_role', role)
    if (extra.community) {
      localStorage.setItem('agro_registration_community', extra.community)
    }
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      
      // Check if user document exists in firestore
      const ref = doc(db, 'users', cred.user.uid)
      const snap = await getDoc(ref)
      
      if (existingOnly && !snap.exists()) {
        // Don't sign out - let the UI handle the redirect to registration
        const err = new Error('No registered account found for this Google email. Please register first.')
        err.code = 'auth/user-not-found'
        throw err
      }

      const finalRole = snap.exists() ? snap.data().role : role
      localStorage.setItem(`agro_role_${cred.user.uid}`, finalRole)
      await createUserDoc(cred.user, { role: finalRole, ...extra })
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
    localStorage.setItem(`agro_role_${cred.user.uid}`, role)
    await createUserDoc(cred.user, { role })
    return cred
  }

  // ── Sign Out ───────────────────────────────────────────────────────────────

  async function logOut() {
    // Clear mock admin session
    if (userProfile?.uid === 'admin_root') {
      setCurrentUser(null)
      setUserProfile(null)
      setUserFullProfile(null)
      localStorage.removeItem('agro_role_admin_root')
      return
    }
    await signOut(auth)
    setUserProfile(null)
    setUserFullProfile(null)
  }

  // ── Complete Registration for Already Authenticated User ────────────────────────

  async function completeRegistration(extra = {}) {
    if (!currentUser) {
      throw new Error('No authenticated user found')
    }
    localStorage.setItem('agro_is_registering', 'true')
    await createUserDoc(currentUser, extra)
    localStorage.removeItem('agro_is_registering')
  }

  // ── Auth State Listener & Redirect handler ─────────────────────────────────

  useEffect(() => {
    // 1. Process Google Sign-in redirect results on load
    getRedirectResult(auth)
      .then(async (cred) => {
        if (cred) {
          const loginType = localStorage.getItem('agro_google_login_type') || 'register'
          const ref = doc(db, 'users', cred.user.uid)
          const snap = await getDoc(ref)
          
          if (loginType === 'existing' && !snap.exists()) {
            // Don't sign out - let the UI handle the redirect to registration
            alert('No registered account found for this Google email. Please register first.')
            return
          }

          const savedRole = snap.exists() ? snap.data().role : (localStorage.getItem('agro_registration_role') || 'farmer')
          const savedCommunity = snap.exists() ? snap.data().community : (localStorage.getItem('agro_registration_community') || null)
          
          localStorage.setItem(`agro_role_${cred.user.uid}`, savedRole)
          await createUserDoc(cred.user, { role: savedRole, community: savedCommunity })
        }
      })
      .catch((err) => {
        console.error("Firebase Redirect Sign-in result error:", err)
      })

    // 2. Listen to state changes
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user)
        if (user) {
          const ref = doc(db, 'users', user.uid)
          const snap = await getDoc(ref)
          if (snap.exists()) {
            const userData = snap.data()
            // Keep localStorage in sync
            localStorage.setItem(`agro_role_${user.uid}`, userData.role)
            setUserProfile(userData)
            await loadFullProfile(user.uid, userData.role)
          } else {
            const isRegistering = localStorage.getItem('agro_is_registering') === 'true'
            if (!isRegistering) {
              // Don't sign out - let the UI handle the redirect to registration
              // Set a flag so the UI knows to show registration
              localStorage.setItem('agro_needs_registration', 'true')
            }
          }
        } else {
          setUserProfile(null)
          setUserFullProfile(null)
        }
      } catch (err) {
        console.error("Auth state change firestore fetch failed. Falling back to local offline mode:", err)
        if (user) {
          const savedRole = localStorage.getItem(`agro_role_${user.uid}`) || 'farmer'
          const fallbackUserData = {
            uid: user.uid,
            email: user.email || null,
            phone: user.phoneNumber || null,
            displayName: user.displayName || 'Demo User',
            photoURL: user.photoURL || null,
            role: savedRole,
          }
          setUserProfile(fallbackUserData)
          await loadFullProfile(user.uid, savedRole)
        }
      } finally {
        setLoading(false)
      }
    })

    // Safety timeout: if Firebase never calls onAuthStateChanged (offline/network error),
    // force loading=false after 8s so the app doesn't get stuck on the splash screen.
    const safetyTimeout = setTimeout(() => {
      setLoading(false)
    }, 8000)

    return () => {
      unsub()
      clearTimeout(safetyTimeout)
    }
  }, [])

  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email)
  }

  // ── Context Value ──────────────────────────────────────────────────────────

  const value = {
    currentUser,
    userProfile,
    userFullProfile,
    loading,
    needsProfileCompletion,
    setNeedsProfileCompletion,
    signUp,
    signIn,
    signInWithGoogle,
    completeRegistration,
    setupRecaptcha,
    sendOTP,
    verifyOTP,
    logOut,
    resetPassword,
    refreshProfile: () => currentUser && userProfile && loadFullProfile(currentUser.uid, userProfile.role)
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
