import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LandingPage from './components/LandingPage'
import AuthPage from './components/auth/AuthPage'
import HomeScreen from './components/HomeScreen'
import FarmerDashboard from './components/dashboards/FarmerDashboard'
import BuyerDashboard from './components/dashboards/BuyerDashboard'
import TransportDashboard from './components/dashboards/TransportDashboard'
import AdminDashboard from './components/dashboards/AdminDashboard'

// ── Inner app — has access to auth context ─────────────────────────────────────
function AppInner() {
  const { currentUser } = useAuth()
  const [showLanding, setShowLanding] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [currentView, setCurrentView] = useState('home')

  const handleContinue = () => {
    setShowLanding(false)
    if (!currentUser) {
      setShowAuth(true)
    }
  }

  const handleAuthenticated = () => {
    setShowAuth(false)
  }

  const handleNavigate = (view) => {
    setCurrentView(view)
  }

  // 1. Landing / marketing page
  if (showLanding) {
    return <LandingPage onContinue={handleContinue} />
  }

  // 3. Auth gate — show if not authenticated
  if (!currentUser || showAuth) {
    return <AuthPage onAuthenticated={handleAuthenticated} />
  }

  // 4. Authenticated app views
  const renderView = () => {
    switch (currentView) {
      case 'home':      return <HomeScreen        onNavigate={handleNavigate} />
      case 'farmer':    return <FarmerDashboard   onNavigate={handleNavigate} />
      case 'buyer':     return <BuyerDashboard    onNavigate={handleNavigate} />
      case 'transport': return <TransportDashboard onNavigate={handleNavigate} />
      case 'admin':     return <AdminDashboard    onNavigate={handleNavigate} />
      default:          return <HomeScreen        onNavigate={handleNavigate} />
    }
  }

  return renderView()
}

// ── Root — wraps everything in AuthProvider ────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
