import React, { useState, useEffect } from 'react'
import {
  ArrowRight, Download, Smartphone, MapPin, TrendingUp,
  Truck, Shield, Sparkles, X, Apple, LogIn, Award, Users, Sprout
} from 'lucide-react'

export default function LandingPage({ onContinue }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)
  const [showDesktopInstructions, setShowDesktopInstructions] = useState(false)

  useEffect(() => {
    // Detect iOS device
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIOS(isIOSDevice)

    // Listen for beforeinstallprompt event (Chrome/Edge/Android)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSInstructions(true)
      return
    }

    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
      }
    } else {
      // Fallback: show desktop instructions when native prompt isn't available
      setShowDesktopInstructions(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-forest-50/40 to-gold-50/30 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-forest-300 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-gold-200 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-terracotta-200 rounded-full blur-[80px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-5 border-b border-earth-100/50 bg-white/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Nunya AI Logo" 
              className="w-11 h-11 rounded-2xl object-cover shadow-md"
            />
            <span className="text-2xl font-black tracking-tight text-earth-900">
              nunya<span className="text-terracotta-600">AI</span>
            </span>
          </div>

          {/* Bold Navbar Sign In Button */}
          <button
            onClick={onContinue}
            className="flex items-center gap-2 py-2.5 px-6 bg-earth-900 text-white rounded-xl font-semibold text-sm hover:bg-earth-800 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 px-6 pt-12 md:pt-20 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Agricultural Badge */}
              <div className="inline-flex items-center gap-2 bg-forest-100/80 text-forest-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm border border-forest-200/50">
                <Sparkles className="w-4 h-4 text-forest-600 animate-pulse" />
                <span>Smart Farm-to-Market Platform</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold text-earth-900 mb-6 leading-tight tracking-tight">
                Empowering Trade,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 via-terracotta-500 to-forest-700">
                  Guided by AI
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-earth-700 max-w-2xl mb-10 leading-relaxed">
                Connecting farmers in the Volta Region directly with commercial buyers, reliable haulage drivers, and smart post-harvest freshness diagnostics.
                <span className="block mt-2 font-medium text-earth-800">Serving Ho, Anloga, and Keta.</span>
              </p>

              {/* BOLD Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={onContinue}
                  className="group py-4 px-10 bg-gradient-to-r from-forest-600 to-forest-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-forest-600/20 hover:shadow-forest-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 min-w-[240px]"
                >
                  <LogIn className="w-5 h-5 text-forest-100" />
                  <span>Sign In / Register</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={handleInstall}
                  className="group py-4 px-8 bg-white hover:bg-earth-50 text-earth-800 border-2 border-earth-200 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 min-w-[240px]"
                >
                  {isIOS ? <Apple className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                  <span>Install App</span>
                </button>
              </div>
            </div>

            {/* Right Hero Image Column */}
            <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
              {/* Glow background behind image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-forest-200 to-gold-200 rounded-3xl blur-[40px] opacity-40 -rotate-3 scale-95" />
              
              <div className="relative">
                {/* Premium Hero Image container */}
                <div className="relative z-10 w-full max-w-md rounded-[32px] overflow-hidden border-8 border-white shadow-2xl transition-transform duration-500 hover:rotate-1">
                  <img
                    src="/agro_hero.png"
                    alt="Nunya AI Agri-Commerce Marketplace"
                    className="w-full h-auto object-cover aspect-[4/5] md:aspect-square lg:aspect-[4/5]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-earth-900/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Hub Badge */}
                <div className="absolute -top-4 -left-4 z-20 bg-white/90 backdrop-blur-md py-3 px-5 rounded-2xl shadow-xl border border-earth-100 flex items-center gap-3 hover:scale-105 transition-transform duration-300">
                  <div className="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center text-gold-600">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-earth-500 font-bold uppercase tracking-wider">Marketplace Hubs</p>
                    <p className="text-sm font-black text-earth-800">Ho • Anloga • Keta</p>
                  </div>
                </div>

                {/* Floating Activity Badge */}
                <div className="absolute -bottom-5 -right-4 z-20 bg-white/90 backdrop-blur-md py-3.5 px-5 rounded-2xl shadow-xl border border-earth-100 flex items-center gap-3 hover:scale-105 transition-transform duration-300">
                  <div className="w-10 h-10 bg-forest-100 rounded-xl flex items-center justify-center text-forest-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-earth-500 font-bold uppercase tracking-wider">Join Over</p>
                    <p className="text-sm font-black text-earth-800">500+ Active Growers</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Features Grid */}
          <div className="mt-28">
            <h2 className="text-center text-2xl font-black text-earth-800 uppercase tracking-widest mb-12">
              Platform Features
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={<MapPin className="w-6 h-6" />}
                title="Live Supply Map"
                description="Real-time visibility of crop listings, stock levels, and farmer locations."
                color="terracotta"
              />
              <FeatureCard
                icon={<TrendingUp className="w-6 h-6" />}
                title="Market Intelligence"
                description="AI-driven price trends, demand forecasts, and regional supply insights."
                color="gold"
              />
              <FeatureCard
                icon={<Truck className="w-6 h-6" />}
                title="Smart Logistics"
                description="Optimized dispatch routing, freight pooling, and delivery tracking."
                color="forest"
              />
              <FeatureCard
                icon={<Shield className="w-6 h-6" />}
                title="Post-Harvest AI"
                description="Image-based quality diagnostics, freshness tracking, and shelf-life forecasts."
                color="earth"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-10 border-t border-earth-150 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-earth-600 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-earth-800">nunya<span className="text-terracotta-600">AI</span></span>
          </div>
          <p>© 2026 Nunya AI. Smart Agricultural Commerce for Growing Communities.</p>
          <div className="flex gap-6 font-semibold text-earth-700">
            <a href="#" className="hover:text-forest-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-forest-600 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      {/* iOS Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-earth-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-earth-900">Add to Home Screen</h3>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="p-2 hover:bg-earth-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-earth-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-forest-750 font-bold text-sm">1</span>
                </div>
                <p className="text-earth-700">Tap the <strong>Share</strong> button in Safari's bottom toolbar</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-forest-750 font-bold text-sm">2</span>
                </div>
                <p className="text-earth-700">Scroll down and tap <strong>"Add to Home Screen"</strong></p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-forest-750 font-bold text-sm">3</span>
                </div>
                <p className="text-earth-700">Tap <strong>"Add"</strong> in the top right corner</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-forest-750 font-bold text-sm">4</span>
                </div>
                <p className="text-earth-700">The Nunya AI icon will appear on your home screen!</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-ivory-50 rounded-xl">
              <p className="text-sm text-earth-600 text-center">
                <Apple className="w-4 h-4 inline mr-1 text-earth-700" />
                This will add Nunya AI to your home screen for quick access, just like a native app.
              </p>
            </div>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="mt-6 w-full py-3 bg-gradient-to-r from-forest-600 to-forest-700 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Desktop Instructions Modal */}
      {showDesktopInstructions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-earth-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-earth-900">Install Nunya AI</h3>
              <button
                onClick={() => setShowDesktopInstructions(false)}
                className="p-2 hover:bg-earth-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-earth-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-forest-750 font-bold text-sm">1</span>
                </div>
                <p className="text-earth-700">Look for the <strong>install icon (⊕)</strong> in your browser's address bar</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-forest-750 font-bold text-sm">2</span>
                </div>
                <p className="text-earth-700">Or click the <strong>three-dot menu</strong> and select "Install Nunya AI" or "Add to desktop"</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-forest-750 font-bold text-sm">3</span>
                </div>
                <p className="text-earth-700">Follow the prompts to complete installation</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-ivory-50 rounded-xl">
              <p className="text-sm text-earth-600 text-center">
                <Download className="w-4 h-4 inline mr-1 text-earth-700" />
                This will install Nunya AI as a desktop application for quick access.
              </p>
            </div>

            <button
              onClick={() => setShowDesktopInstructions(false)}
              className="mt-6 w-full py-3 bg-gradient-to-r from-forest-600 to-forest-700 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function FeatureCard({ icon, title, description, color }) {
  const colorClasses = {
    terracotta: 'from-terracotta-500 to-terracotta-600 bg-terracotta-50 text-terracotta-600 border-terracotta-100',
    gold: 'from-gold-500 to-gold-600 bg-gold-50 text-gold-600 border-gold-100',
    forest: 'from-forest-500 to-forest-600 bg-forest-50 text-forest-600 border-forest-100',
    earth: 'from-earth-500 to-earth-600 bg-earth-50 text-earth-600 border-earth-100',
  }

  return (
    <div className="bg-white/60 border border-earth-100 backdrop-blur-md rounded-3xl p-6 hover:scale-[1.03] hover:shadow-xl transition-all duration-300 flex flex-col items-start text-left">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white mb-5 shadow-sm`}>
        {icon}
      </div>
      <h3 className="text-lg font-extrabold text-earth-900 mb-2">{title}</h3>
      <p className="text-earth-650 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
