import React, { useState, useRef, useEffect } from 'react'
import {
  Sparkles, Mail, Lock, Eye, EyeOff, Phone, ArrowRight,
  ChevronLeft, Loader2, User, CheckCircle, AlertCircle, MapPin, Truck, ShoppingBag, Shield,
  FileText, Upload, CreditCard, Navigation, Route, DollarSign
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

// ── Role Definitions ─────────────────────────────────────────────────────────
const ROLES = [
  { id: 'farmer',    label: 'Farmer',            emoji: '🌾', desc: 'List produce & track harvests', icon: <Shield className="w-5 h-5" /> },
  { id: 'buyer',     label: 'Buyer / Trader',     emoji: '🛒', desc: 'Browse market & place orders',  icon: <ShoppingBag className="w-5 h-5" /> },
  { id: 'transport', label: 'Transport Provider', emoji: '🚛', desc: 'Offer haulage services',         icon: <Truck className="w-5 h-5" /> },
]

const TRANSPORT_TABS = [
  { id: 'jobs', label: 'Available Jobs', icon: <Truck className="w-5 h-5" /> },
  { id: 'deliveries', label: 'Deliveries', icon: <Navigation className="w-5 h-5" /> },
  { id: 'routes', label: 'Routes', icon: <Route className="w-5 h-5" /> },
  { id: 'revenue', label: 'Revenue', icon: <DollarSign className="w-5 h-5" /> },
]

// ── Common Shared Components ─────────────────────────────────────────────────
function ErrorBanner({ msg }) {
  if (!msg) return null
  return (
    <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{msg}</span>
    </div>
  )
}

function SuccessBanner({ msg }) {
  if (!msg) return null
  return (
    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
      <CheckCircle className="w-4 h-4 shrink-0" />
      <span>{msg}</span>
    </div>
  )
}

function GoogleBtn({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-earth-200 rounded-xl font-medium text-earth-800 hover:bg-earth-50 transition-all duration-200 shadow-sm disabled:opacity-50"
    >
      <svg width="20" height="20" viewBox="0 0 48 48">
        <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 29.9 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
        <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.1 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.6 7.4 6.3 14.7z"/>
        <path fill="#FBBC05" d="M24 46c5.8 0 10.8-1.9 14.7-5.2l-6.8-5.6C29.9 36.6 27.1 37 24 37c-5.8 0-10.7-3.1-11.8-7.5l-7 5.4C8.3 41.6 15.6 46 24 46z"/>
        <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.6 2.6-2.2 4.8-4.5 6.3l6.8 5.6C42.6 36.7 46 30.6 46 24c0-1.3-.2-2.7-.5-4z"/>
      </svg>
      Continue with Google
    </button>
  )
}

function Divider({ text = 'or' }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-earth-200" />
      <span className="text-xs text-earth-400 font-medium">{text}</span>
      <div className="flex-1 h-px bg-earth-200" />
    </div>
  )
}

function Input({ icon, type = 'text', rightIcon, ...props }) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400">{icon}</span>
      )}
      <input
        type={type}
        className={`w-full py-3 pr-4 bg-white border border-earth-200 rounded-xl text-earth-900 placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent transition ${icon ? 'pl-11' : 'pl-4'}`}
        {...props}
      />
      {rightIcon && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-earth-400 cursor-pointer">
          {rightIcon}
        </span>
      )}
    </div>
  )
}

export default function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [selectedRole, setSelectedRole] = useState('farmer')

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-terracotta-50 to-forest-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta-400 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-forest-500 rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-terracotta-500 to-terracotta-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-earth-900">Nunya AI</span>
          </div>
          <p className="text-earth-500 text-sm">Smart Agricultural Commerce · Volta Region</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-8 animate-fade-in">
          {mode === 'login' && (
            <LoginForm onSwitch={setMode} onDone={onAuthenticated} />
          )}
          
          {mode === 'register_role' && (
            <RegisterRoleForm
              onSelect={(role) => {
                setSelectedRole(role)
                setMode('signup')
              }}
              onSwitch={setMode}
            />
          )}

          {mode === 'signup' && (
            <SignupForm
              role={selectedRole}
              onSwitch={setMode}
              onDone={onAuthenticated}
            />
          )}

          {mode === 'phone' && (
            <PhoneForm
              role={selectedRole}
              onSwitch={setMode}
              onDone={onAuthenticated}
            />
          )}

          {mode === 'forgot_password' && (
            <ResetPasswordForm onSwitch={setMode} />
          )}
        </div>

        <p className="text-center text-earth-400 text-xs mt-6">
          © 2024 Nunya AI · Secure authentication by Firebase
        </p>
      </div>
    </div>
  )
}

function LoginForm({ onSwitch, onDone }) {
  const { signIn, signInWithGoogle } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [busy, setBusy]         = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  async function handleEmail(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signIn(email, password)
      onDone()
    } catch (err) {
      const code = err?.code
      // If the email is not registered, auto-redirect to registration
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        setRedirecting(true)
        setError('')
        setTimeout(() => {
          onSwitch('register_role')
        }, 2500)
      } else {
        setError(friendlyError(err))
      }
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setBusy(true)
    try {
      await new Promise((resolve, reject) => {
        if (!navigator.geolocation) reject(new Error('Geolocation not supported'))
        navigator.geolocation.getCurrentPosition(resolve, () => reject(new Error('Location access required')), { enableHighAccuracy: true })
      })
      await signInWithGoogle()
      onDone()
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-earth-900">Welcome back</h2>
        <p className="text-earth-500 text-sm mt-1">Sign in to your account</p>
      </div>

      {redirecting && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-800 text-sm animate-fade-in">
          <Loader2 className="w-5 h-5 animate-spin text-amber-600 shrink-0" />
          <div>
            <p className="font-semibold">No account found with that email</p>
            <p className="text-xs text-amber-600 mt-0.5">Redirecting you to create a new account...</p>
          </div>
        </div>
      )}
      <ErrorBanner msg={error} />

      <GoogleBtn onClick={handleGoogle} loading={busy} />

      <Divider />

      <form onSubmit={handleEmail} className="space-y-4">
        <Input
          icon={<Mail className="w-4 h-4" />}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          icon={<Lock className="w-4 h-4" />}
          type={showPw ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          rightIcon={
            showPw
              ? <EyeOff className="w-4 h-4" onClick={() => setShowPw(false)} />
              : <Eye className="w-4 h-4" onClick={() => setShowPw(true)} />
          }
          required
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onSwitch('forgot_password')}
            className="text-xs font-semibold text-terracotta-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 px-4 bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:from-terracotta-700 hover:to-terracotta-800 transition-all duration-200 disabled:opacity-60"
        >
          {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <Divider text="new here?" />

      <button
        onClick={() => onSwitch('register_role')}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-earth-200 rounded-xl text-earth-700 font-medium hover:bg-earth-50 hover:border-terracotta-400 transition"
      >
        Create Account (Register Role)
      </button>

      <p className="text-center text-sm text-earth-500 pt-2 border-t border-earth-100">
        Sign-in issue? Reset your credentials in dashboard settings.
      </p>
    </div>
  )
}

function RegisterRoleForm({ onSelect, onSwitch }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => onSwitch('login')} className="p-1 rounded-lg hover:bg-earth-100 transition">
          <ChevronLeft className="w-5 h-5 text-earth-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-earth-900">Choose Account Role</h2>
          <p className="text-earth-500 text-sm mt-1">Select profile type to store in database</p>
        </div>
      </div>

      <div className="grid gap-3">
        {ROLES.map(r => (
          <button
            key={r.id}
            onClick={() => onSelect(r.id)}
            className="w-full p-4 rounded-2xl border border-earth-200 bg-white hover:border-terracotta-400 hover:bg-terracotta-50/40 text-left transition-all duration-300 flex items-center gap-4 hover:scale-[1.02] active:scale-100 shadow-sm"
          >
            <div className="text-3xl bg-earth-50 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
              {r.emoji}
            </div>
            <div>
              <p className="font-bold text-earth-900 text-sm capitalize">{r.label}</p>
              <p className="text-xs text-earth-500 mt-0.5">{r.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center text-sm text-earth-500 pt-4 border-t border-earth-100">
        Already have an account?{' '}
        <button onClick={() => onSwitch('login')} className="text-terracotta-600 font-semibold hover:underline">
          Sign in
        </button>
      </div>
    </div>
  )
}

// ── EMAIL REGISTRATION DETAILS FORM ─────────────────────────────────────────────
function SignupForm({ role, onSwitch, onDone }) {
  const { signUp, signInWithGoogle } = useAuth()
  const [name, setName]           = useState('')
  const [phone, setPhone]         = useState('+233')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPw, setShowPw]       = useState(false)
  const [error, setError]         = useState('')
  const [busy, setBusy]           = useState(false)
  // Transport-specific document fields
  const [ghanaCardId, setGhanaCardId]       = useState('')
  const [licenseId, setLicenseId]           = useState('')
  const [ghanaCardFile, setGhanaCardFile]   = useState(null)
  const [licenseFile, setLicenseFile]       = useState(null)
  const [community, setCommunity]           = useState('')

  async function handleSignUp(e) {
    e.preventDefault()
    if (!phone || phone.trim() === '+233' || phone.length < 10) {
      setError('Please enter a valid phone number (e.g. +233241234567).')
      return
    }
    if (!community.trim()) {
      setError('Please enter your community / location.')
      return
    }

    // Ask strictly for location access on signup
    setBusy(true)
    setError('')
    try {
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (err) => reject(new Error('Location access is strictly required to sign up on this platform. Please enable location permissions.')),
          { enableHighAccuracy: true }
        )
      })
    } catch (locErr) {
      setError(locErr.message)
      setBusy(false)
      return
    }

    if (password !== confirm) { setError('Passwords do not match'); setBusy(false); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters'); setBusy(false); return }
    // Transport-specific validation
    if (role === 'transport') {
      if (!ghanaCardId.trim()) { setError('Please enter your Ghana Card ID number.'); setBusy(false); return }
      if (!licenseId.trim())   { setError('Please enter your Driver\'s License number.'); setBusy(false); return }
      if (!ghanaCardFile && !licenseFile) {
        setError('Please upload at least your Ghana Card or Driver\'s License document.')
        setBusy(false)
        return
      }
    }
    try {
      const extra = {
        community: community,
        ...(role === 'transport' ? {
          ghana_card_id: ghanaCardId,
          license_id: licenseId,
          ghana_card_file: ghanaCardFile?.name || null,
          license_file: licenseFile?.name || null,
        } : {})
      }
      await signUp(email, password, name, role, phone, extra)
      onDone()
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setBusy(true)
    try {
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (err) => reject(new Error('Location access is strictly required to sign up on this platform. Please enable location permissions.')),
          { enableHighAccuracy: true }
        )
      })
    } catch (locErr) {
      setError(locErr.message)
      setBusy(false)
      return
    }

    try {
      await signInWithGoogle(role)
      onDone()
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => onSwitch('register_role')} className="p-1 rounded-lg hover:bg-earth-100 transition">
          <ChevronLeft className="w-5 h-5 text-earth-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-earth-900">Complete Profile</h2>
          <p className="text-earth-500 text-sm mt-1 capitalize">Registering credentials for: {role}</p>
        </div>
      </div>

      <ErrorBanner msg={error} />

      <GoogleBtn onClick={handleGoogle} loading={busy} />

      <Divider />

      <form onSubmit={handleSignUp} className="space-y-4">
        <Input
          icon={<User className="w-4 h-4" />}
          placeholder="Full name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <Input
          icon={<Phone className="w-4 h-4" />}
          type="tel"
          placeholder="Phone Number (e.g. +233241234567)"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />
        <Input
          icon={<Mail className="w-4 h-4" />}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          icon={<Lock className="w-4 h-4" />}
          type={showPw ? 'text' : 'password'}
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          rightIcon={
            showPw
              ? <EyeOff className="w-4 h-4" onClick={() => setShowPw(false)} />
              : <Eye className="w-4 h-4" onClick={() => setShowPw(true)} />
          }
          required
        />
        <Input
          icon={<MapPin className="w-4 h-4" />}
          placeholder="Community / Location (e.g., Ho, Anloga)"
          value={community}
          onChange={e => setCommunity(e.target.value)}
          required
        />
        <Input
          icon={<Lock className="w-4 h-4" />}
          type={showPw ? 'text' : 'password'}
          placeholder="Confirm password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
        />

        {/* Transport Document Upload Section */}
        {role === 'transport' && (
          <div className="space-y-3 pt-2 pb-1">
            <div className="flex items-center gap-2 text-xs font-bold text-earth-500 uppercase tracking-wider">
              <CreditCard className="w-4 h-4" />
              <span>Required Documents for Verification</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
              ⚠️ Your account will be reviewed by an admin before you can access the platform.
            </div>

            {/* Ghana Card */}
            <Input
              icon={<CreditCard className="w-4 h-4" />}
              placeholder="Ghana Card ID (e.g. GHA-123456789-0)"
              value={ghanaCardId}
              onChange={e => setGhanaCardId(e.target.value)}
              required
            />
            <label className="flex flex-col gap-1">
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition ${
                  ghanaCardFile ? 'border-forest-400 bg-forest-50' : 'border-earth-200 bg-white hover:border-terracotta-400 hover:bg-terracotta-50/30'
                }`}
              >
                <Upload className={`w-4 h-4 shrink-0 ${ghanaCardFile ? 'text-forest-600' : 'text-earth-400'}`} />
                <span className={`text-sm truncate ${ghanaCardFile ? 'text-forest-700 font-medium' : 'text-earth-400'}`}>
                  {ghanaCardFile ? ghanaCardFile.name : 'Upload Ghana Card (photo/scan)'}
                </span>
              </div>
              <input type="file" accept="image/*,.pdf" className="sr-only" onChange={e => setGhanaCardFile(e.target.files[0] || null)} />
            </label>

            {/* Driver's License */}
            <Input
              icon={<FileText className="w-4 h-4" />}
              placeholder="Driver's License Number"
              value={licenseId}
              onChange={e => setLicenseId(e.target.value)}
              required
            />
            <label className="flex flex-col gap-1">
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition ${
                  licenseFile ? 'border-forest-400 bg-forest-50' : 'border-earth-200 bg-white hover:border-terracotta-400 hover:bg-terracotta-50/30'
                }`}
              >
                <Upload className={`w-4 h-4 shrink-0 ${licenseFile ? 'text-forest-600' : 'text-earth-400'}`} />
                <span className={`text-sm truncate ${licenseFile ? 'text-forest-700 font-medium' : 'text-earth-400'}`}>
                  {licenseFile ? licenseFile.name : "Upload Driver's License (photo/scan)"}
                </span>
              </div>
              <input type="file" accept="image/*,.pdf" className="sr-only" onChange={e => setLicenseFile(e.target.files[0] || null)} />
            </label>
          </div>
        )}
        
        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:from-terracotta-700 hover:to-terracotta-800 transition-all duration-200 disabled:opacity-60"
        >
          {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{role === 'transport' ? 'Submit for Review' : 'Create Account'} <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <Divider text="or" />
      
      <button
        onClick={() => onSwitch('phone')}
        className="w-full flex items-center justify-center gap-2 py-3 border border-earth-200 rounded-xl text-earth-700 font-medium hover:bg-earth-50 transition"
      >
        <Phone className="w-4 h-4" /> Sign up with Phone (OTP)
      </button>
    </div>
  )
}

// ── PHONE REGISTRATION OTP FORM ─────────────────────────────────────────────────
function PhoneForm({ role, onSwitch, onDone }) {
  const { setupRecaptcha, sendOTP, verifyOTP } = useAuth()
  const [step, setStep]                 = useState(1) // 1=phone entry, 2=OTP entry
  const [phone, setPhone]               = useState('+233')
  const [otp, setOtp]                   = useState(['', '', '', '', '', ''])
  const [confirmResult, setConfirmResult] = useState(null)
  const [error, setError]               = useState('')
  const [success, setSuccess]           = useState('')
  const [busy, setBusy]                 = useState(false)
  const [resendTimer, setResendTimer]   = useState(0)
  const otpRefs                         = useRef([])

  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  async function handleSendOTP(e) {
    e.preventDefault()
    setError('')
    if (phone.length < 10) { setError('Enter a valid phone number including country code.'); return }
    setBusy(true)
    try {
      const verifier = setupRecaptcha('recaptcha-container')
      const result   = await sendOTP(phone, verifier)
      setConfirmResult(result)
      setStep(2)
      setResendTimer(30)
      setSuccess(`OTP sent to ${phone}`)
    } catch (err) {
      setError(friendlyError(err))
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear()
        window.recaptchaVerifier = null
      }
    } finally {
      setBusy(false)
    }
  }

  function handleOtpChange(value, index) {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  function handleOtpKeyDown(e, index) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  async function handleVerifyOTP(e) {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) { setError('Enter all 6 digits.'); return }
    setError('')
    setBusy(true)
    try {
      await verifyOTP(confirmResult, code, role)
      onDone()
    } catch (err) {
      setError('Incorrect code. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function handleResend() {
    setOtp(['', '', '', '', '', ''])
    setError('')
    setSuccess('')
    setStep(1)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => (step === 2 ? setStep(1) : onSwitch('signup'))} className="p-1 rounded-lg hover:bg-earth-100 transition">
          <ChevronLeft className="w-5 h-5 text-earth-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-earth-900">
            {step === 1 ? 'Phone Sign-in' : 'Enter OTP'}
          </h2>
          <p className="text-earth-500 text-sm mt-1">
            {step === 1 ? "We'll send a 6-digit code to your phone" : `Code sent to ${phone}`}
          </p>
        </div>
      </div>

      <ErrorBanner msg={error} />
      <SuccessBanner msg={success} />

      <div id="recaptcha-container" />

      {step === 1 && (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Phone Number
            </label>
            <Input
              icon={<Phone className="w-4 h-4" />}
              type="tel"
              placeholder="+233241234567"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
            <p className="text-xs text-earth-400 mt-1">Include country code, e.g. +233 for Ghana</p>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:from-terracotta-700 hover:to-terracotta-800 transition-all duration-200 disabled:opacity-60"
          >
            {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div className="flex gap-3 justify-center">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => (otpRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(e.target.value, i)}
                onKeyDown={e => handleOtpKeyDown(e, i)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:border-terracotta-500 transition bg-white text-earth-900 border-earth-200"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={busy || otp.join('').length < 6}
            className="w-full py-3 bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:from-terracotta-700 hover:to-terracotta-800 transition-all duration-200 disabled:opacity-60"
          >
            {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify & Sign In <CheckCircle className="w-4 h-4" /></>}
          </button>

          <div className="text-center text-sm text-earth-500">
            {resendTimer > 0 ? (
              <span>Resend in <strong className="text-earth-700">{resendTimer}s</strong></span>
            ) : (
              <button type="button" onClick={handleResend} className="text-terracotta-600 font-semibold hover:underline">
                Resend OTP
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  )
}

function friendlyError(err) {
  console.error("Firebase Auth Error Detail:", err)
  const code = err?.code
  const map = {
    'auth/user-not-found':         'No account found with that email. Please click "Create Account" below to register.',
    'auth/wrong-password':         'Incorrect password.',
    'auth/email-already-in-use':   'An account already exists with that email.',
    'auth/invalid-email':          'Please enter a valid email address.',
    'auth/weak-password':          'Password is too weak. Use at least 6 characters.',
    'auth/popup-closed-by-user':   'Google sign-in popup was closed.',
    'auth/popup-blocked':          'Popup was blocked by your browser. Please enable popups.',
    'auth/operation-not-allowed':  'Google sign-in is not enabled in your Firebase console.',
    'auth/unauthorized-domain':    'This domain is not authorized in your Firebase console.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
    'auth/too-many-requests':      'Too many attempts. Please wait and try again.',
    'auth/invalid-phone-number':   'Enter a valid phone number with country code.',
    'auth/invalid-verification-code': 'Incorrect OTP code.',
    'auth/code-expired':           'OTP has expired. Please request a new one.',
    'auth/captcha-check-failed':   'reCAPTCHA failed. Please try again.',
    'auth/invalid-credential':     'Incorrect credentials, or no account found. Please click "Create Account" below to register.',
  }
  return map[code] ?? `${err?.message || 'Something went wrong.'} (${code || 'unknown'})`
}

// ── FORGOT PASSWORD FORM ────────────────────────────────────────────────────────
function ResetPasswordForm({ onSwitch }) {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleReset(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setBusy(true)
    try {
      await resetPassword(email)
      setSuccess('A password reset link has been sent to your email address.')
      setEmail('')
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => onSwitch('login')} className="p-1 rounded-lg hover:bg-earth-100 transition">
          <ChevronLeft className="w-5 h-5 text-earth-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-earth-900">Reset Password</h2>
          <p className="text-earth-500 text-sm mt-1">Reset your password via email</p>
        </div>
      </div>

      <ErrorBanner msg={error} />
      <SuccessBanner msg={success} />

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-2">
            Email Address
          </label>
          <Input
            icon={<Mail className="w-4 h-4" />}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:from-terracotta-700 hover:to-terracotta-800 transition-all duration-200 disabled:opacity-60"
        >
          {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Reset Email <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <div className="text-center text-sm text-earth-500 pt-4 border-t border-earth-100">
        Back to{' '}
        <button onClick={() => onSwitch('login')} className="text-terracotta-600 font-semibold hover:underline">
          Sign In
        </button>
      </div>
    </div>
  )
}
