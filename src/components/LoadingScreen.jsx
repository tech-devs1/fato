import React, { useEffect, useState } from 'react'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('planting') // planting, growing, harvesting, loading, transportation

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => onComplete(), 1000)
          return 100
        }
        return prev + 100 / 150 // 150 increments = 15 seconds
      })
    }, 100)

    return () => clearInterval(interval)
  }, [onComplete])

  useEffect(() => {
    if (progress < 20) setStage('planting')
    else if (progress < 40) setStage('growing')
    else if (progress < 60) setStage('harvesting')
    else if (progress < 80) setStage('loading')
    else setStage('transportation')
  }, [progress])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Sky Background */}
      <div className="absolute inset-0">
        {/* Sun */}
        <div 
          className="absolute w-24 h-24 bg-yellow-400 rounded-full shadow-lg transition-all duration-3000"
          style={{
            top: stage === 'planting' ? '20%' : stage === 'growing' ? '15%' : stage === 'harvesting' ? '10%' : '8%',
            right: '15%',
            boxShadow: '0 0 60px rgba(255, 200, 0, 0.6)'
          }}
        />
        
        {/* Clouds */}
        <div className="absolute top-10 left-20 w-32 h-12 bg-white rounded-full opacity-80" />
        <div className="absolute top-8 left-28 w-24 h-10 bg-white rounded-full opacity-80" />
        <div className="absolute top-16 right-32 w-40 h-14 bg-white rounded-full opacity-80" />
      </div>

      {/* Ground/Soil */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-amber-800 via-amber-700 to-amber-600" />

      {/* Main Animation Container */}
      <div className="relative z-10 w-full max-w-4xl h-96 flex items-end justify-center pb-32">
        {/* Planting Stage (0-20%) */}
        {stage === 'planting' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Seeds falling */}
              {[...Array(5)].map((_, i) => (
                <circle
                  key={i}
                  cx={80 + i * 60}
                  cy={50 + (progress % 20) * 5}
                  r="4"
                  fill="#8B4513"
                  className="animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
              
              {/* Rain drops */}
              {[...Array(10)].map((_, i) => (
                <line
                  key={i}
                  x1={20 + i * 40}
                  y1={0}
                  x2={20 + i * 40}
                  y2={30}
                  stroke="#87CEEB"
                  strokeWidth="2"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
              
              {/* Small sprouts emerging */}
              {[...Array(5)].map((_, i) => (
                <g key={i} style={{ opacity: progress > 10 ? 1 : 0.3 }}>
                  <line x1={80 + i * 60} y1={250} x2={80 + i * 60} y2={240} stroke="#228B22" strokeWidth="3" />
                  <ellipse cx={80 + i * 60} cy={235} rx="8" ry="4" fill="#32CD32" />
                </g>
              ))}
            </svg>
          </div>
        )}

        {/* Growing Stage (20-40%) */}
        {stage === 'growing' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {[...Array(5)].map((_, i) => (
                <g key={i}>
                  {/* Growing stem */}
                  <line
                    x1={80 + i * 60}
                    y1={250}
                    x2={80 + i * 60}
                    y2={150 + (progress - 20) * 2}
                    stroke="#228B22"
                    strokeWidth="4"
                  />
                  {/* Leaves */}
                  <ellipse
                    cx={70 + i * 60}
                    cy={180 + (progress - 20)}
                    rx="12"
                    ry="6"
                    fill="#32CD32"
                    className="origin-right animate-pulse"
                    style={{ transform: `rotate(${-15 + Math.sin(Date.now() / 500) * 10}deg)` }}
                  />
                  <ellipse
                    cx={90 + i * 60}
                    cy={180 + (progress - 20)}
                    rx="12"
                    ry="6"
                    fill="#32CD32"
                    className="origin-left animate-pulse"
                    style={{ transform: `rotate(${15 + Math.sin(Date.now() / 500) * 10}deg)` }}
                  />
                  {/* Top leaves */}
                  <ellipse
                    cx={80 + i * 60}
                    cy={140 + (progress - 20) * 2}
                    rx="10"
                    ry="5"
                    fill="#228B22"
                  />
                </g>
              ))}
            </svg>
          </div>
        )}

        {/* Harvesting Stage (40-60%) */}
        {stage === 'harvesting' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Mature crops */}
              {[...Array(5)].map((_, i) => (
                <g key={i}>
                  <line x1={80 + i * 60} y1={250} x2={80 + i * 60} y2="130" stroke="#228B22" strokeWidth="4" />
                  <ellipse cx={80 + i * 60} cy="120" rx="15" ry="8" fill="#FFD700" />
                  <ellipse cx={70 + i * 60} cy="160" rx="12" ry="6" fill="#32CD32" />
                  <ellipse cx={90 + i * 60} cy="160" rx="12" ry="6" fill="#32CD32" />
                </g>
              ))}
              
              {/* Baskets moving to bus */}
              {[...Array(3)].map((_, i) => (
                <g
                  key={i}
                  style={{
                    transform: `translateX(${(progress - 40) * 8 + i * 30}px)`,
                    opacity: progress > 45 + i * 5 ? 1 : 0
                  }}
                >
                  <rect x={200 + i * 40} y="200" width="30" height="25" fill="#8B4513" rx="3" />
                  <rect x={205 + i * 40} y="195" width="20" height="5" fill="#A0522D" />
                  {/* Produce in basket */}
                  <circle cx={210 + i * 40} cy="190" r="6" fill="#FF6347" />
                  <circle cx={215 + i * 40} cy="188" r="5" fill="#FFD700" />
                </g>
              ))}
            </svg>
          </div>
        )}

        {/* Loading Stage (60-80%) */}
        {stage === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Bus */}
              <g
                style={{
                  transform: `translateX(${(progress - 60) * 3}px)`,
                  opacity: 1
                }}
              >
                {/* Bus body */}
                <rect x="150" y="150" width="120" height="60" fill="#4169E1" rx="5" />
                {/* Windows */}
                <rect x="160" y="160" width="25" height="20" fill="#87CEEB" rx="2" />
                <rect x="195" y="160" width="25" height="20" fill="#87CEEB" rx="2" />
                <rect x="230" y="160" width="25" height="20" fill="#87CEEB" rx="2" />
                {/* Wheels */}
                <circle cx="175" cy="210" r="12" fill="#333" />
                <circle cx="245" cy="210" r="12" fill="#333" />
                {/* Door */}
                <rect x="250" y="155" width="15" height="40" fill="#333" rx="2" />
                
                {/* Baskets being loaded */}
                {progress > 65 && (
                  <g style={{ transform: `translateY(${(progress - 65) * 2}px)` }}>
                    <rect x="170" y="130" width="25" height="20" fill="#8B4513" rx="2" />
                    <circle cx="182" cy="125" r="5" fill="#FF6347" />
                  </g>
                )}
                {progress > 70 && (
                  <g style={{ transform: `translateY(${(progress - 70) * 2}px)` }}>
                    <rect x="200" y="130" width="25" height="20" fill="#8B4513" rx="2" />
                    <circle cx="212" cy="125" r="5" fill="#FFD700" />
                  </g>
                )}
              </g>
              
              {/* Workers */}
              <g style={{ opacity: progress < 75 ? 1 : 0 }}>
                <circle cx="130" cy="180" r="10" fill="#FFE4C4" />
                <rect x="125" y="190" width="10" height="20" fill="#2E8B57" />
              </g>
            </svg>
          </div>
        )}

        {/* Transportation Stage (80-100%) */}
        {stage === 'transportation' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Bus driving across */}
              <g
                style={{
                  transform: `translateX(${(progress - 80) * 15 - 100}px)`,
                  transition: 'transform 0.1s linear'
                }}
              >
                <rect x="150" y="150" width="120" height="60" fill="#4169E1" rx="5" />
                <rect x="160" y="160" width="25" height="20" fill="#87CEEB" rx="2" />
                <rect x="195" y="160" width="25" height="20" fill="#87CEEB" rx="2" />
                <rect x="230" y="160" width="25" height="20" fill="#87CEEB" rx="2" />
                <circle cx="175" cy="210" r="12" fill="#333" className="animate-spin" style={{ animationDuration: '0.5s' }} />
                <circle cx="245" cy="210" r="12" fill="#333" className="animate-spin" style={{ animationDuration: '0.5s' }} />
                <rect x="250" y="155" width="15" height="40" fill="#333" rx="2" />
                {/* Full baskets visible */}
                <rect x="165" y="125" width="25" height="20" fill="#8B4513" rx="2" />
                <rect x="195" y="125" width="25" height="20" fill="#8B4513" rx="2" />
                <rect x="225" y="125" width="25" height="20" fill="#8B4513" rx="2" />
              </g>
              
              {/* NUNYA AI emerges */}
              {progress > 90 && (
                <g
                  style={{
                    opacity: (progress - 90) / 10,
                    transform: `scale(${(progress - 90) / 10})`,
                    transformOrigin: 'center'
                  }}
                >
                  <text x="200" y="100" textAnchor="middle" fontSize="36" fontWeight="bold" fill="#2E8B57">
                    NUNYA AI
                  </text>
                  <text x="200" y="130" textAnchor="middle" fontSize="14" fill="#228B22">
                    Growing Agriculture with Intelligence
                  </text>
                </g>
              )}
            </svg>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-amber-900 font-medium capitalize">{stage}</span>
          <span className="text-sm text-amber-900 font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-amber-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-green-600 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
