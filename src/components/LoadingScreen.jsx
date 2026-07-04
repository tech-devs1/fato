import React, { useEffect, useState } from 'react'
import { Sprout, Wheat, Leaf, Network, Brain, Map, Truck, ShoppingBasket, TrendingUp, Users, Shield, Globe } from 'lucide-react'

const loadingConcepts = [
  {
    id: 'volta-flow',
    title: 'THE VOLTA FLOW',
    tagline: 'Life. Flow. Growth.',
    description: 'Connecting Farms to Markets • Empowering Communities',
    icon: <Sprout className="w-16 h-16" />,
    gradient: 'from-forest-600 via-terracotta-500 to-gold-500',
    bgGradient: 'from-forest-900 via-earth-900 to-forest-950'
  },
  {
    id: 'growth-pulse',
    title: 'THE GROWTH PULSE',
    tagline: 'Every harvest feeds the future.',
    description: 'Analyzing markets • Optimizing opportunities',
    icon: <TrendingUp className="w-16 h-16" />,
    gradient: 'from-gold-500 via-forest-500 to-terracotta-500',
    bgGradient: 'from-earth-900 via-forest-900 to-earth-950'
  },
  {
    id: 'market-network',
    title: 'THE MARKET NETWORK',
    tagline: 'Stronger together. Smarter together.',
    description: 'Connecting the agricultural ecosystem',
    icon: <Network className="w-16 h-16" />,
    gradient: 'from-terracotta-500 via-gold-500 to-forest-500',
    bgGradient: 'from-forest-950 via-earth-900 to-forest-900'
  },
  {
    id: 'african-essence',
    title: 'THE AFRICAN ESSENCE',
    tagline: 'Rooted in culture. Powered by intelligence.',
    description: 'Honoring tradition • Building the future',
    icon: <Globe className="w-16 h-16" />,
    gradient: 'from-gold-400 via-gold-500 to-terracotta-500',
    bgGradient: 'from-earth-950 via-terracotta-950 to-earth-900'
  },
  {
    id: 'ai-insight',
    title: 'THE AI INSIGHT',
    tagline: 'Turning data into abundance.',
    description: 'AI is gathering insights for you...',
    icon: <Brain className="w-16 h-16" />,
    gradient: 'from-forest-500 via-gold-500 to-terracotta-500',
    bgGradient: 'from-forest-950 via-earth-900 to-forest-900'
  },
  {
    id: 'harvest-journey',
    title: 'THE HARVEST JOURNEY',
    tagline: 'From farm to table, we make it possible.',
    description: 'Building better routes • Delivering prosperity',
    icon: <Truck className="w-16 h-16" />,
    gradient: 'from-terracotta-500 via-forest-500 to-gold-500',
    bgGradient: 'from-earth-900 via-forest-950 to-earth-950'
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
  const [currentConcept, setCurrentConcept] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => onComplete(), 800)
          return 100
        }
        return prev + 1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [onComplete])

  useEffect(() => {
    const conceptInterval = setInterval(() => {
      setCurrentConcept(prev => (prev + 1) % loadingConcepts.length)
    }, 3000)

    return () => clearInterval(conceptInterval)
  }, [])

  const concept = loadingConcepts[currentConcept]

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
        {/* Concept Visual */}
        <div className="mb-8 relative">
          <div className="w-40 h-40 mx-auto relative">
            {/* Glowing ring */}
            <div className={`absolute inset-0 bg-gradient-to-br ${concept.gradient} rounded-full opacity-20 animate-pulse-slow`} />
            <div className={`absolute inset-4 bg-gradient-to-br ${concept.gradient} rounded-full opacity-40 animate-pulse-slow`} style={{ animationDelay: '0.5s' }} />
            
            {/* Icon container */}
            <div className={`absolute inset-8 bg-gradient-to-br ${concept.gradient} rounded-full flex items-center justify-center text-white animate-scale-in`}>
              {concept.icon}
            </div>

            {/* Orbiting elements */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-3 h-3 bg-gold-400 rounded-full" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-3 h-3 bg-forest-400 rounded-full" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-3 h-3 bg-terracotta-400 rounded-full" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-3 h-3 bg-gold-400 rounded-full" />
            </div>
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

        {/* Loading Progress */}
        <div className="w-full max-w-md mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-earth-400 font-medium">Loading</span>
            <span className="text-sm text-gold-400 font-bold">{progress}%</span>
          </div>
          <div className="h-2 bg-earth-800 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${concept.gradient} rounded-full transition-all duration-300 ease-out`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

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
              index === currentConcept ? 'bg-gold-400 w-6' : 'bg-earth-700'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
