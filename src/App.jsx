import React, { useState, useEffect, Suspense, lazy } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './components/ui/Toast'
import LoadingScreen from './components/LoadingScreen'

// Lazy-loaded pages to reduce initial JavaScript payload size (<200KB startup cost)
const LandingPage = lazy(() => import('./components/LandingPage'))
const AuthPage = lazy(() => import('./components/auth/AuthPage'))
const HomeScreen = lazy(() => import('./components/HomeScreen'))
const FarmerDashboard = lazy(() => import('./components/dashboards/FarmerDashboard'))
const BuyerDashboard = lazy(() => import('./components/dashboards/BuyerDashboard'))
const TransportDashboard = lazy(() => import('./components/dashboards/TransportDashboard'))
const AdminDashboard = lazy(() => import('./components/dashboards/AdminDashboard'))

// Role → default view mapping
const ROLE_HOME = {
  farmer:    'farmer',
  buyer:     'buyer',
  transport: 'transport',
  admin:     'admin',
}

// ── Inner app — has access to auth context ─────────────────────────────────────
function AppInner() {
  const { currentUser, userProfile } = useAuth()
  const [loading,     setLoading]     = useState(true)
  const [showLanding, setShowLanding] = useState(() => {
    const saved = localStorage.getItem('nunya_show_landing')
    return saved !== null ? JSON.parse(saved) : true
  })
  const [showAuth,    setShowAuth]    = useState(() => {
    const saved = localStorage.getItem('nunya_show_auth')
    return saved !== null ? JSON.parse(saved) : false
  })
  const [currentView, setCurrentView] = useState(() => {
    const saved = localStorage.getItem('nunya_current_view')
    return saved || null
  })

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('nunya_show_landing', JSON.stringify(showLanding))
  }, [showLanding])

  useEffect(() => {
    localStorage.setItem('nunya_show_auth', JSON.stringify(showAuth))
  }, [showAuth])

  useEffect(() => {
    localStorage.setItem('nunya_current_view', currentView || '')
  }, [currentView])

  // Once the user profile loads, auto-navigate to their role dashboard
  useEffect(() => {
    if (currentUser && userProfile) {
      const roleHome = ROLE_HOME[userProfile.role] || 'home'
      if (!currentView) {
        setCurrentView(roleHome)
        setShowLanding(false)
      }
    }
  }, [currentUser, userProfile])

  const handleLoadingComplete = () => {
    setLoading(false)
    if (!currentUser) {
      setShowLanding(false)
      setShowAuth(true)
    }
  }

  const handleContinue = () => {
    setShowLanding(false)
    if (!currentUser) setShowAuth(true)
  }

  const handleAuthenticated = () => {
    setShowAuth(false)
    // currentView will be set by useEffect once userProfile loads
  }

  const handleNavigate = (view) => {
    setCurrentView(view)
  }

  const handleLogout = () => {
    setCurrentView(null)
    setShowLanding(true)
    // Clear persisted state on logout
    localStorage.removeItem('nunya_show_landing')
    localStorage.removeItem('nunya_show_auth')
    localStorage.removeItem('nunya_current_view')
  }

  // ── 0. Loading Screen ────────────────────────────────────────────────────────
  if (loading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  // ── 0.5. Profile Completion ───────────────────────────────────────────────────
  if (needsProfileCompletion && currentUser) {
    return <ProfileCompletion onComplete={handleProfileComplete} />
  }

  // ── 1. Landing page ──────────────────────────────────────────────────────────
  if (showLanding) {
    return <LandingPage onContinue={handleContinue} />
  }

  // ── 2. Auth gate ─────────────────────────────────────────────────────────────
  if (!currentUser || showAuth) {
    return <AuthPage onAuthenticated={handleAuthenticated} />
  }

  // ── 3. Role-gated routing ────────────────────────────────────────────────────
  const role = userProfile?.role || 'home'

  const renderView = () => {
    // Farmers only see farmer views
    if (role === 'farmer') {
      switch (currentView) {
        case 'farmer':  return <FarmerDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
        case 'home':    return <HomeScreen onNavigate={handleNavigate} />
        default:        return <FarmerDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
      }
    }

    // Buyers only see buyer views
    if (role === 'buyer') {
      switch (currentView) {
        case 'buyer':   return <BuyerDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
        case 'home':    return <HomeScreen onNavigate={handleNavigate} />
        default:        return <BuyerDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
      }
    }

    // Transporters only see transport views
    if (role === 'transport') {
      switch (currentView) {
        case 'transport': return <TransportDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
        case 'home':      return <HomeScreen onNavigate={handleNavigate} />
        default:          return <TransportDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
      }
    }

    // Admin sees everything
    if (role === 'admin') {
      switch (currentView) {
        case 'admin':     return <AdminDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
        case 'farmer':    return <FarmerDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
        case 'buyer':     return <BuyerDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
        case 'transport': return <TransportDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
        default:          return <AdminDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
      }
    }

    // Fallback: generic home
    return <HomeScreen onNavigate={handleNavigate} />
  }

  return renderView()
}

// ── Root — wraps everything in AuthProvider ────────────────────────────────────
export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Suspense fallback={
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'linear-gradient(to bottom right, #FFE999, #FFF9C2, #FDBA74)',
            zIndex: 9999
          }} />
        }>
          <AppInner />
        </Suspense>
      </AuthProvider>
    </ToastProvider>
  )
}
