import React, { useState, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen'
import LandingPage from './components/LandingPage'
import HomeScreen from './components/HomeScreen'
import FarmerDashboard from './components/dashboards/FarmerDashboard'
import BuyerDashboard from './components/dashboards/BuyerDashboard'
import TransportDashboard from './components/dashboards/TransportDashboard'
import AdminDashboard from './components/dashboards/AdminDashboard'

function App() {
  const [loading, setLoading] = useState(true)
  const [showLanding, setShowLanding] = useState(true)
  const [currentView, setCurrentView] = useState('home')


  const handleContinue = () => {
    setShowLanding(false)
  }

  const handleNavigate = (view) => {
    setCurrentView(view)
  }

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />
  }

  if (showLanding) {
    return <LandingPage onContinue={handleContinue} />
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} />
      case 'farmer':
        return <FarmerDashboard onNavigate={handleNavigate} />
      case 'buyer':
        return <BuyerDashboard onNavigate={handleNavigate} />
      case 'transport':
        return <TransportDashboard onNavigate={handleNavigate} />
      case 'admin':
        return <AdminDashboard onNavigate={handleNavigate} />
      default:
        return <HomeScreen onNavigate={handleNavigate} />
    }
  }

  return renderView()
}

export default App
