import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './components/ui/Toast'
import LandingPage from './components/LandingPage'
import AuthPage from './components/auth/AuthPage'
import HomeScreen from './components/HomeScreen'
import FarmerDashboard from './components/dashboards/FarmerDashboard'
import BuyerDashboard from './components/dashboards/BuyerDashboard'
import TransportDashboard from './components/dashboards/TransportDashboard'
import AdminDashboard from './components/dashboards/AdminDashboard'

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
  const [showLanding, setShowLanding] = useState(true)
  const [showAuth,    setShowAuth]    = useState(false)
  const [currentView, setCurrentView] = useState(null)

  // Once the user profile loads, auto-navigate to their role dashboard
  useEffect(() => {
    if (currentUser && userProfile) {
      const roleHome = ROLE_HOME[userProfile.role] || 'home'
      if (!currentView) {
        setCurrentView(roleHome)
      }
    }
  }, [currentUser, userProfile])

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
        <AppInner />
      </AuthProvider>
    </ToastProvider>
  )
}
