// Firebase configuration and initialization
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import {
  getAuth,
  GoogleAuthProvider,
  PhoneAuthProvider,
  RecaptchaVerifier,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAcTkzk1YUaq6Amx6qZ1t42UIFmf75vu-o',
  authDomain: 'agro-aii.firebaseapp.com',
  projectId: 'agro-aii',
  storageBucket: 'agro-aii.firebasestorage.app',
  messagingSenderId: '357216244363',
  appId: '1:357216244363:web:cd41285988b5c4f41dba8e',
  measurementId: 'G-HXESXYKGKG',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

// Auth
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

// Firestore
export const db = getFirestore(app)

// Phone / OTP helpers
export { PhoneAuthProvider, RecaptchaVerifier }

export default app
