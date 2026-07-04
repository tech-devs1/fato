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
    visual: 'volta'
  },
  {
    id: 'growth-pulse',
    title: 'THE GROWTH PULSE',
    tagline: 'Every harvest feeds the future.',
    description: 'Analyzing markets • Optimizing opportunities',
    gradient: 'from-gold-500 via-forest-500 to-terracotta-500',
    bgGradient: 'from-earth-900 via-forest-900 to-earth-950',
    visual: 'growth'
  },
  {
    id: 'market-network',
    title: 'THE MARKET NETWORK',
    tagline: 'Stronger together. Smarter together.',
    description: 'Connecting the agricultural ecosystem',
    gradient: 'from-terracotta-500 via-gold-500 to-forest-500',
    bgGradient: 'from-forest-950 via-earth-900 to-forest-900',
    visual: 'network'
  },
  {
    id: 'african-essence',
    title: 'THE AFRICAN ESSENCE',
    tagline: 'Rooted in culture. Powered by intelligence.',
    description: 'Honoring tradition • Building the future',
    gradient: 'from-gold-400 via-gold-500 to-terracotta-500',
    bgGradient: 'from-earth-950 via-terracotta-950 to-earth-900',
    visual: 'african'
  },
  {
    id: 'ai-insight',
    title: 'THE AI INSIGHT',
    tagline: 'Turning data into abundance.',
    description: 'AI is gathering insights for you...',
    gradient: 'from-forest-500 via-gold-500 to-terracotta-500',
    bgGradient: 'from-forest-950 via-earth-900 to-forest-900',
    visual: 'ai'
  },
  {
    id: 'harvest-journey',
    title: 'THE HARVEST JOURNEY',
    tagline: 'From farm to table, we make it possible.',
    description: 'Building better routes • Delivering prosperity',
    gradient: 'from-terracotta-500 via-forest-500 to-gold-500',
    bgGradient: 'from-earth-900 via-forest-950 to-earth-950',
    visual: 'harvest'
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

  const renderVisual = () => {
    switch (concept.visual) {
      case 'volta':
        return <VoltaFlowVisual />
      case 'growth':
        return <GrowthPulseVisual />
      case 'network':
        return <MarketNetworkVisual />
      case 'african':
        return <AfricanEssenceVisual />
      case 'ai':
        return <AIInsightVisual />
      case 'harvest':
        return <HarvestJourneyVisual />
      default:
        return <VoltaFlowVisual />
    }
  }

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
        <div className="mb-8 relative flex justify-center">
          {renderVisual()}
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

// Visual Components for each concept

function VoltaFlowVisual() {
  return (
    <div className="w-48 h-48 relative">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* River flow */}
        <path 
          d="M20,100 Q50,60 80,100 T140,100 T180,100" 
          stroke="url(#riverGradient)" 
          strokeWidth="8" 
          fill="none"
          className="animate-pulse"
        />
        <path 
          d="M20,120 Q50,80 80,120 T140,120 T180,120" 
          stroke="url(#riverGradient)" 
          strokeWidth="4" 
          fill="none"
          opacity="0.6"
          className="animate-pulse"
          style={{ animationDelay: '0.5s' }}
        />
        
        {/* Sun */}
        <circle cx="160" cy="40" r="25" fill="url(#sunGradient)" className="animate-pulse" />
        
        {/* Landscapes */}
        <path d="M0,150 Q40,120 80,150 T160,150 T200,150 L200,200 L0,200 Z" fill="url(#landGradient)" opacity="0.8" />
        
        {/* Trees */}
        <circle cx="40" cy="130" r="8" fill="#2D8B5C" />
        <circle cx="60" cy="125" r="6" fill="#2D8B5C" />
        <circle cx="100" cy="128" r="7" fill="#2D8B5C" />
        
        <defs>
          <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2D8B5C" />
            <stop offset="50%" stopColor="#C05621" />
            <stop offset="100%" stopColor="#E6A800" />
          </linearGradient>
          <radialGradient id="sunGradient">
            <stop offset="0%" stopColor="#E6A800" />
            <stop offset="100%" stopColor="#C05621" />
          </radialGradient>
          <linearGradient id="landGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2D8B5C" />
            <stop offset="100%" stopColor="#1C563A" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

function GrowthPulseVisual() {
  return (
    <div className="w-48 h-48 relative">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Central circle */}
        <circle cx="100" cy="100" r="60" fill="none" stroke="url(#growthGradient)" strokeWidth="3" className="animate-pulse" />
        <circle cx="100" cy="100" r="45" fill="none" stroke="url(#growthGradient)" strokeWidth="2" opacity="0.7" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
        <circle cx="100" cy="100" r="30" fill="none" stroke="url(#growthGradient)" strokeWidth="1.5" opacity="0.5" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
        
        {/* Plant growing from center */}
        <path d="M100,100 Q100,70 100,50" stroke="#2D8B5C" strokeWidth="4" fill="none" />
        <path d="M100,70 Q85,60 80,50" stroke="#2D8B5C" strokeWidth="3" fill="none" />
        <path d="M100,70 Q115,60 120,50" stroke="#2D8B5C" strokeWidth="3" fill="none" />
        
        {/* Orbiting icons */}
        <g transform="translate(100, 40)">
          <circle r="12" fill="#E6A800" />
          <BarChart3 size={16} x={-8} y={-8} stroke="white" strokeWidth={2} />
        </g>
        <g transform="translate(145, 100)">
          <circle r="12" fill="#C05621" />
          <Users size={16} x={-8} y={-8} stroke="white" strokeWidth={2} />
        </g>
        <g transform="translate(100, 160)">
          <circle r="12" fill="#2D8B5C" />
          <Truck size={16} x={-8} y={-8} stroke="white" strokeWidth={2} />
        </g>
        <g transform="translate(55, 100)">
          <circle r="12" fill="#E6A800" />
          <ShoppingBasket size={16} x={-8} y={-8} stroke="white" strokeWidth={2} />
        </g>
        
        {/* Soil */}
        <ellipse cx="100" cy="175" rx="80" ry="15" fill="#947055" opacity="0.6" />
        
        <defs>
          <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E6A800" />
            <stop offset="50%" stopColor="#2D8B5C" />
            <stop offset="100%" stopColor="#C05621" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

function MarketNetworkVisual() {
  return (
    <div className="w-48 h-48 relative">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Network connections */}
        <line x1="50" y1="50" x2="100" y2="100" stroke="url(#networkGradient)" strokeWidth="2" opacity="0.6" />
        <line x1="150" y1="50" x2="100" y2="100" stroke="url(#networkGradient)" strokeWidth="2" opacity="0.6" />
        <line x1="50" y1="150" x2="100" y2="100" stroke="url(#networkGradient)" strokeWidth="2" opacity="0.6" />
        <line x1="150" y1="150" x2="100" y2="100" stroke="url(#networkGradient)" strokeWidth="2" opacity="0.6" />
        <line x1="50" y1="50" x2="150" y2="50" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.4" />
        <line x1="50" y1="150" x2="150" y2="150" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.4" />
        <line x1="50" y1="50" x2="50" y2="150" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.4" />
        <line x1="150" y1="50" x2="150" y2="150" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.4" />
        
        {/* Nodes */}
        <circle cx="100" cy="100" r="20" fill="url(#nodeGradient)" className="animate-pulse" />
        <circle cx="50" cy="50" r="15" fill="#2D8B5C" />
        <circle cx="150" cy="50" r="15" fill="#C05621" />
        <circle cx="50" cy="150" r="15" fill="#E6A800" />
        <circle cx="150" cy="150" r="15" fill="#2D8B5C" />
        
        {/* Icons in nodes */}
        <Network size={20} x={90} y={90} stroke="white" strokeWidth={2} />
        <Sprout size={14} x={43} y={43} stroke="white" strokeWidth={2} />
        <ShoppingBasket size={14} x={143} y={43} stroke="white" strokeWidth={2} />
        <Truck size={14} x={43} y={143} stroke="white" strokeWidth={2} />
        <Users size={14} x={143} y={143} stroke="white" strokeWidth={2} />
        
        <defs>
          <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C05621" />
            <stop offset="50%" stopColor="#E6A800" />
            <stop offset="100%" stopColor="#2D8B5C" />
          </linearGradient>
          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="#E6A800" />
            <stop offset="100%" stopColor="#C05621" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}

function AfricanEssenceVisual() {
  return (
    <div className="w-48 h-48 relative">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Golden mask/bust silhouette */}
        <ellipse cx="100" cy="100" rx="50" ry="60" fill="url(#goldGradient)" opacity="0.9" />
        
        {/* Intricate patterns */}
        <path d="M70,80 Q100,70 130,80" stroke="#C05621" strokeWidth="2" fill="none" />
        <path d="M70,100 Q100,90 130,100" stroke="#C05621" strokeWidth="2" fill="none" />
        <path d="M70,120 Q100,110 130,120" stroke="#C05621" strokeWidth="2" fill="none" />
        
        {/* Geometric patterns */}
        <rect x="85" y="60" width="30" height="4" fill="#C05621" opacity="0.8" />
        <rect x="85" y="140" width="30" height="4" fill="#C05621" opacity="0.8" />
        
        {/* Side patterns */}
        <circle cx="65" cy="90" r="4" fill="#2D8B5C" />
        <circle cx="135" cy="90" r="4" fill="#2D8B5C" />
        <circle cx="65" cy="110" r="4" fill="#2D8B5C" />
        <circle cx="135" cy="110" r="4" fill="#2D8B5C" />
        
        {/* Glow effect */}
        <circle cx="100" cy="100" r="70" fill="none" stroke="url(#goldGradient)" strokeWidth="2" opacity="0.3" className="animate-pulse" />
        
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE999" />
            <stop offset="50%" stopColor="#E6A800" />
            <stop offset="100%" stopColor="#C05621" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

function AIInsightVisual() {
  return (
    <div className="w-48 h-48 relative">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Holographic interface background */}
        <rect x="30" y="30" width="140" height="140" rx="10" fill="none" stroke="url(#aiGradient)" strokeWidth="2" opacity="0.5" />
        
        {/* Data points */}
        <text x="45" y="55" fill="#2D8B5C" fontSize="10" className="animate-pulse">Yield Prediction</text>
        <text x="45" y="70" fill="#E6A800" fontSize="12" fontWeight="bold">92%</text>
        
        <text x="45" y="95" fill="#2D8B5C" fontSize="10" className="animate-pulse" style={{ animationDelay: '0.2s' }}>Market Demand</text>
        <text x="45" y="110" fill="#C05621" fontSize="12" fontWeight="bold">High</text>
        
        <text x="45" y="135" fill="#2D8B5C" fontSize="10" className="animate-pulse" style={{ animationDelay: '0.4s' }}>Transport</text>
        <text x="45" y="150" fill="#E6A800" fontSize="12" fontWeight="bold">Optimal</text>
        
        {/* Glowing plant icon at bottom */}
        <g transform="translate(140, 150)">
          <circle r="25" fill="url(#aiGradient)" opacity="0.3" className="animate-pulse" />
          <Sprout size={30} x={-15} y={-15} stroke="#E6A800" strokeWidth={2} />
        </g>
        
        {/* Scanning line */}
        <line x1="30" y1="80" x2="170" y2="80" stroke="url(#aiGradient)" strokeWidth="1" opacity="0.3" className="animate-pulse" />
        <line x1="30" y1="120" x2="170" y2="120" stroke="url(#aiGradient)" strokeWidth="1" opacity="0.3" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
        
        <defs>
          <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D8B5C" />
            <stop offset="50%" stopColor="#E6A800" />
            <stop offset="100%" stopColor="#C05621" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

function HarvestJourneyVisual() {
  return (
    <div className="w-48 h-48 relative">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Multi-tiered landscape */}
        {/* Farm tier */}
        <rect x="10" y="140" width="60" height="50" fill="#2D8B5C" opacity="0.8" rx="5" />
        <circle cx="25" cy="130" r="8" fill="#E6A800" />
        <circle cx="40" cy="125" r="6" fill="#E6A800" />
        <circle cx="55" cy="130" r="7" fill="#E6A800" />
        <text x="20" y="170" fill="white" fontSize="8">Farm</text>
        
        {/* Transport tier */}
        <rect x="75" y="120" width="50" height="70" fill="#C05621" opacity="0.8" rx="5" />
        <Truck size={30} x={85} y={130} stroke="white" strokeWidth={2} />
        <text x="80" y="180" fill="white" fontSize="8">Transport</text>
        
        {/* Market tier */}
        <rect x="130" y="100" width="60" height="90" fill="#E6A800" opacity="0.8" rx="5" />
        <ShoppingBasket size={30} x={145} y={110} stroke="white" strokeWidth={2} />
        <text x="140" y="180" fill="white" fontSize="8">Market</text>
        
        {/* Connecting arrows */}
        <path d="M70,165 L75,165" stroke="white" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <path d="M125,155 L130,155" stroke="white" strokeWidth="2" markerEnd="url(#arrowhead)" />
        
        {/* Road/path */}
        <path d="M40,190 Q100,180 160,190" stroke="#947055" strokeWidth="4" fill="none" opacity="0.6" />
        
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="white" />
          </marker>
        </defs>
      </svg>
    </div>
  )
}
