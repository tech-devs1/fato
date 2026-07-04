import React, { useEffect, useState } from 'react'
import { Sprout, Wheat, Leaf, Network, Brain, Map, Truck, ShoppingBasket, TrendingUp, Users, Shield, Globe, BarChart3 } from 'lucide-react'

const loadingConcepts = [
  {
    id: 'volta-flow',
    title: 'THE VOLTA FLOW',
    tagline: 'Life. Flow. Growth.',
    description: 'Connecting Farms to Markets • Empowering Communities',
    gradient: 'from-forest-600 via-terracotta-500 to-gold-500',
    bgGradient: 'from-forest-900 via-earth-900 to-forest-950',
    image: '/volta-flow.jpg'
  },
  {
    id: 'growth-pulse',
    title: 'THE GROWTH PULSE',
    tagline: 'Every harvest feeds the future.',
    description: 'Analyzing markets • Optimizing opportunities',
    gradient: 'from-gold-500 via-forest-500 to-terracotta-500',
    bgGradient: 'from-earth-900 via-forest-900 to-earth-950',
    image: '/growth-pulse.jpg'
  },
  {
    id: 'market-network',
    title: 'THE MARKET NETWORK',
    tagline: 'Stronger together. Smarter together.',
    description: 'Connecting the agricultural ecosystem',
    gradient: 'from-terracotta-500 via-gold-500 to-forest-500',
    bgGradient: 'from-forest-950 via-earth-900 to-forest-900',
    image: '/market-network.jpg'
  },
  {
    id: 'african-essence',
    title: 'THE AFRICAN ESSENCE',
    tagline: 'Rooted in culture. Powered by intelligence.',
    description: 'Honoring tradition • Building the future',
    gradient: 'from-gold-400 via-gold-500 to-terracotta-500',
    bgGradient: 'from-earth-950 via-terracotta-950 to-earth-900',
    image: '/african-essence.jpg'
  },
  {
    id: 'ai-insight',
    title: 'THE AI INSIGHT',
    tagline: 'Turning data into abundance.',
    description: 'AI is gathering insights for you...',
    gradient: 'from-forest-500 via-gold-500 to-terracotta-500',
    bgGradient: 'from-forest-950 via-earth-900 to-forest-900',
    image: '/ai-insight.jpg'
  },
  {
    id: 'harvest-journey',
    title: 'THE HARVEST JOURNEY',
    tagline: 'From farm to table, we make it possible.',
    description: 'Building better routes • Delivering prosperity',
    gradient: 'from-terracotta-500 via-forest-500 to-gold-500',
    bgGradient: 'from-earth-900 via-forest-950 to-earth-950',
    image: '/harvest-journey.jpg'
  }
]

const features = [
  { icon: <Brain className="w-5 h-5" />, text: 'AI POWERED Smart Decisions' },
  { icon: <TrendingUp className="w-5 h-5" />, text: 'REAL TIME Live Insights' },
  { icon: <Shield className="w-5 h-5" />, text: 'SECURE Your Data, Safe' },
  { icon: <Users className="w-5 h-5" />, text: 'INCLUSIVE For Every Farmer' },
  { icon: <Globe className="w-5 h-5" />, text: 'SUSTAINABLE For Our Future' }
]

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => onComplete(), 1000)
          return 100
        }
        return prev + 1
      })
    }, 100) // 100ms per increment = 10 seconds total

    return () => clearInterval(interval)
  }, [onComplete])

  // Calculate current concept based on progress
  const conceptIndex = Math.min(Math.floor(progress / (100 / loadingConcepts.length)), loadingConcepts.length - 1)
  const concept = loadingConcepts[conceptIndex]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${concept.bgGradient} flex items-center justify-center relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-terracotta-500 to-gold-500 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-forest-500 to-terracotta-500 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-gold-500 to-forest-500 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Geometric Pattern Overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="kente-dark" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="none" />
            <path d="M0 40 L80 40 M40 0 L40 80" stroke="#C05621" strokeWidth="0.5" />
            <rect x="20" y="20" width="40" height="40" fill="none" stroke="#E6A800" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kente-dark)" />
      </svg>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Concept Image */}
        <div className="mb-8 relative flex justify-center">
          <div className="w-80 h-80 rounded-2xl overflow-hidden animate-scale-in">
            <img 
              src={concept.image} 
              alt={concept.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to gradient if image not found
                e.target.style.display = 'none'
                e.target.parentElement.className = `w-80 h-80 rounded-2xl animate-scale-in bg-gradient-to-br ${concept.gradient} flex items-center justify-center`
                e.target.parentElement.innerHTML = `
                  <div class="text-center p-6">
                    <p class="text-white/60 text-sm mb-2">Image not found</p>
                    <p class="text-white/40 text-xs">Place ${concept.image} in public folder</p>
                  </div>
                `
              }}
            />
          </div>
        </div>

        {/* Loading Progress */}
        <div className="w-full max-w-md mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-earth-400 font-medium">
              {progress < 17 ? 'Initializing...' : progress < 33 ? 'Connecting farms...' : progress < 50 ? 'Analyzing markets...' : progress < 67 ? 'Optimizing routes...' : progress < 83 ? 'Processing insights...' : 'Finalizing...'}
            </span>
            <span className="text-sm text-gold-400 font-bold">{progress}%</span>
          </div>
          <div className="h-2 bg-earth-800 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${concept.gradient} rounded-full transition-all duration-300 ease-out`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Concept Title */}
        <h2 className={`text-sm font-semibold tracking-widest mb-3 animate-fade-in bg-gradient-to-r ${concept.gradient} bg-clip-text text-transparent`}>
          {concept.title}
        </h2>

        {/* Brand Name */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 animate-slide-up">
          Nunya AI
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-gold-300 mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {concept.tagline}
        </p>

        {/* Description */}
        <p className="text-earth-300 mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          {concept.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-earth-400 text-xs md:text-sm">
              <span className="text-gold-400">{feature.icon}</span>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Concept Indicator Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {loadingConcepts.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === conceptIndex ? 'bg-gold-400 w-6' : index < conceptIndex ? 'bg-gold-400' : 'bg-earth-700'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
