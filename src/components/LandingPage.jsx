import React, { useState, useEffect } from 'react'
import { ArrowRight, Download, Smartphone, MapPin, TrendingUp, Truck, Shield, Sparkles, X, Apple } from 'lucide-react'

export default function LandingPage({ onContinue }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)
  const [showDesktopInstructions, setShowDesktopInstructions] = useState(false)
  const [canInstall, setCanInstall] = useState(false)

  useEffect(() => {
    // Detect iOS device
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIOS(isIOSDevice)

    // Listen for beforeinstallprompt event (Chrome/Edge/Android)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setCanInstall(false)
    }

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
        setCanInstall(false)
      }
    } else {
      // Show desktop instructions for Chrome/Edge users
      setShowDesktopInstructions(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-terracotta-50 to-forest-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-forest-500 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-terracotta-500 to-terracotta-700 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-earth-900">Nunya AI</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 px-6 pt-12 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-terracotta-100 text-terracotta-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>The Future of African Agriculture</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-earth-900 mb-6 leading-tight">
              Smart Agricultural
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-600 via-gold-500 to-forest-600">
                Commerce
              </span>
            </h1>
            
            <p className="text-xl text-earth-600 max-w-2xl mx-auto mb-12">
              AI-powered post-harvest management, logistics, and marketplace for the Volta Region of Ghana.
              <br />
              <span className="text-earth-500">Starting with Ho, Anloga, and Keta.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleInstall}
                className="group relative px-8 py-4 bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 min-w-[280px] justify-center"
              >
                {isIOS ? <Apple className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                <span>{isIOS ? 'Add to Home Screen' : 'Install App'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={onContinue}
                className="group px-8 py-4 bg-white text-earth-900 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 min-w-[280px] justify-center border border-earth-200"
              >
                <Smartphone className="w-5 h-5" />
                <span>Continue in Browser</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <FeatureCard
              icon={<MapPin className="w-6 h-6" />}
              title="Live Supply Map"
              description="Real-time visibility of produce availability across the Volta Region"
              color="terracotta"
            />
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Market Intelligence"
              description="AI-powered price trends, demand forecasts, and insights"
              color="gold"
            />
            <FeatureCard
              icon={<Truck className="w-6 h-6" />}
              title="Smart Logistics"
              description="Route optimization, transport matching, and delivery tracking"
              color="forest"
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Post-Harvest AI"
              description="Freshness indicators, spoilage risk, and storage recommendations"
              color="earth"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 px-6 py-8 border-t border-earth-200">
        <div className="max-w-7xl mx-auto text-center text-earth-500 text-sm">
          <p>© 2024 Nunya AI. Smart Agricultural Commerce for Growing Communities.</p>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
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
                <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-terracotta-700 font-bold text-sm">1</span>
                </div>
                <p className="text-earth-700">Tap the <strong>Share</strong> button in Safari's bottom toolbar</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-terracotta-700 font-bold text-sm">2</span>
                </div>
                <p className="text-earth-700">Scroll down and tap <strong>"Add to Home Screen"</strong></p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-terracotta-700 font-bold text-sm">3</span>
                </div>
                <p className="text-earth-700">Tap <strong>"Add"</strong> in the top right corner</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-terracotta-700 font-bold text-sm">4</span>
                </div>
                <p className="text-earth-700">The Nunya AI icon will appear on your home screen!</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-ivory-50 rounded-xl">
              <p className="text-sm text-earth-600 text-center">
                <Apple className="w-4 h-4 inline mr-1" />
                This will add Nunya AI to your home screen for quick access, just like a native app.
              </p>
            </div>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="mt-6 w-full py-3 bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Desktop Instructions Modal */}
      {showDesktopInstructions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
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
                <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-terracotta-700 font-bold text-sm">1</span>
                </div>
                <p className="text-earth-700">Look for the <strong>install icon (⊕)</strong> in your browser's address bar</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-terracotta-700 font-bold text-sm">2</span>
                </div>
                <p className="text-earth-700">Or click the <strong>three-dot menu</strong> and select "Install Nunya AI" or "Add to desktop"</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-terracotta-700 font-bold text-sm">3</span>
                </div>
                <p className="text-earth-700">Follow the prompts to complete installation</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-ivory-50 rounded-xl">
              <p className="text-sm text-earth-600 text-center">
                <Download className="w-4 h-4 inline mr-1" />
                This will install Nunya AI as a desktop application for quick access.
              </p>
            </div>

            <button
              onClick={() => setShowDesktopInstructions(false)}
              className="mt-6 w-full py-3 bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
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
    terracotta: 'from-terracotta-500 to-terracotta-600 bg-terracotta-50',
    gold: 'from-gold-500 to-gold-600 bg-gold-50',
    forest: 'from-forest-500 to-forest-600 bg-forest-50',
    earth: 'from-earth-500 to-earth-600 bg-earth-50',
  }

  return (
    <div className="glass-lg rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-earth-900 mb-2">{title}</h3>
      <p className="text-earth-600 text-sm">{description}</p>
    </div>
  )
}
