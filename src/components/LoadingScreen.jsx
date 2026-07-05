import React, { useEffect, useState } from 'react'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [growthStage, setGrowthStage] = useState(0)

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

  useEffect(() => {
    // Update growth stage based on progress
    const stage = Math.floor(progress / 25) // 4 stages (0-25, 26-50, 51-75, 76-100)
    setGrowthStage(Math.min(stage, 3))
  }, [progress])

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-900 via-terracotta-800 to-gold-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Colorful Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-forest-600/30 via-terracotta-500/20 to-gold-500/30 animate-pulse-slow" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-forest-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gold-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-terracotta-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Rain Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-8 bg-gradient-to-b from-transparent via-blue-300/40 to-blue-400/60 rounded-full animate-rain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`
            }}
          />
        ))}
      </div>

      {/* Growing Plant/Logo */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Soil/Ground */}
        <div className="w-64 h-8 bg-gradient-to-r from-earth-800 via-earth-700 to-earth-800 rounded-full mb-0 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-forest-600/30 via-terracotta-500/30 to-gold-500/30 rounded-full" />
        </div>

        {/* Growing Stem */}
        <div 
          className="w-2 bg-gradient-to-t from-forest-600 via-forest-500 to-forest-400 rounded-full transition-all duration-1000 ease-out"
          style={{ 
            height: `${growthStage * 40 + 20}px`,
            marginBottom: '0px'
          }}
        />

        {/* Growing Leaves */}
        <div className="relative">
          {/* Left Leaf */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[20px] border-t-transparent border-r-[30px] border-r-forest-500 border-b-[20px] border-b-transparent transition-all duration-1000 ease-out"
            style={{ 
              opacity: growthStage >= 1 ? 1 : 0,
              transform: growthStage >= 1 ? 'translateY(-50%) rotate(-30deg)' : 'translateY(-50%) rotate(-30deg) scale(0)'
            }}
          />
          
          {/* Right Leaf */}
          <div 
            className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[20px] border-t-transparent border-l-[30px] border-l-forest-500 border-b-[20px] border-b-transparent transition-all duration-1000 ease-out"
            style={{ 
              opacity: growthStage >= 1 ? 1 : 0,
              transform: growthStage >= 1 ? 'translateY(-50%) rotate(30deg)' : 'translateY(-50%) rotate(30deg) scale(0)'
            }}
          />

          {/* Top Leaves */}
          {growthStage >= 2 && (
            <>
              <div 
                className="absolute -top-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-b-[25px] border-b-forest-400 border-r-[15px] border-r-transparent transition-all duration-1000 ease-out"
                style={{ opacity: 1 }}
              />
              <div 
                className="absolute -top-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-b-[25px] border-b-gold-400 border-r-[15px] border-r-transparent transition-all duration-1000 ease-out"
                style={{ opacity: 1, transform: 'rotate(45deg)' }}
              />
            </>
          )}

          {/* Flower/Bud */}
          {growthStage >= 3 && (
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-pulse">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-terracotta-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xs">AI</span>
              </div>
            </div>
          )}
        </div>

        {/* Brand Name */}
        <div 
          className="mt-8 text-center transition-all duration-1000 ease-out"
          style={{ 
            opacity: growthStage >= 1 ? 1 : 0,
            transform: growthStage >= 1 ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
            Nunya AI
          </h1>
          <p className="text-gold-300 text-lg">
            Growing Agriculture with Intelligence
          </p>
        </div>

        {/* Progress Bar */}
        <div 
          className="w-64 mt-8 transition-all duration-1000 ease-out"
          style={{ 
            opacity: growthStage >= 2 ? 1 : 0
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70">Loading</span>
            <span className="text-sm text-gold-400 font-bold">{progress}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-forest-500 via-terracotta-500 to-gold-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes rain {
          0% {
            transform: translateY(-100vh);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
        .animate-rain {
          animation: rain 2s linear infinite;
        }
      `}</style>
    </div>
  )
}
