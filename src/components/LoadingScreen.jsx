import React, { useEffect, useState } from 'react'
import { Sprout, Wheat, Leaf } from 'lucide-react'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => onComplete(), 500)
          return 100
        }
        return prev + 2
      })
    }, 40)

    return () => clearInterval(interval)
  }, [onComplete])

  useEffect(() => {
    const phases = [2000, 3500, 5000]
    phases.forEach((time, index) => {
      setTimeout(() => setPhase(index + 1), time)
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-terracotta-50 to-forest-50 flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-terracotta-500 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-forest-500 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gold-500 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Geometric Pattern Overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-3" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="kente" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="none" />
            <path d="M0 50 L100 50 M50 0 L50 100" stroke="#C05621" strokeWidth="1" />
            <rect x="25" y="25" width="50" height="50" fill="none" stroke="#2D8B5C" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kente)" />
      </svg>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo Animation */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto relative">
            <div className={`absolute inset-0 bg-gradient-to-br from-terracotta-500 to-terracotta-700 rounded-3xl rotate-0 animate-scale-in ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`absolute inset-2 bg-gradient-to-br from-forest-500 to-forest-700 rounded-2xl rotate-3 animate-scale-in ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }} />
            <div className={`absolute inset-4 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl -rotate-3 animate-scale-in ${phase >= 3 ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }} />
            <div className={`absolute inset-6 bg-white rounded-lg flex items-center justify-center animate-scale-in ${phase >= 3 ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
              <Sprout className="w-12 h-12 text-terracotta-600" />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-5xl font-bold text-earth-900 mb-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          Nunya AI
        </h1>
        <p className="text-lg text-earth-600 mb-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          Smart Agricultural Commerce
        </p>

        {/* Loading Progress */}
        <div className="w-64 mx-auto animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <div className="h-2 bg-earth-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-terracotta-500 via-gold-500 to-forest-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-earth-500 font-medium">
            {progress < 30 ? 'Initializing...' : progress < 60 ? 'Loading intelligence...' : progress < 90 ? 'Connecting to markets...' : 'Almost ready...'}
          </p>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <Wheat className="absolute top-10 left-20 w-8 h-8 text-terracotta-400 animate-float" style={{ animationDelay: '0s' }} />
          <Leaf className="absolute top-20 right-16 w-8 h-8 text-forest-400 animate-float" style={{ animationDelay: '1s' }} />
          <Sprout className="absolute bottom-32 left-16 w-8 h-8 text-gold-400 animate-float" style={{ animationDelay: '2s' }} />
          <Wheat className="absolute bottom-20 right-24 w-8 h-8 text-terracotta-400 animate-float" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
    </div>
  )
}
