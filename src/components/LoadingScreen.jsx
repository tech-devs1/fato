import React, { useEffect, useState } from 'react'

const LETTERS = [
  { char: 'n', delay: 0.1,  scatteredX: -130, scatteredY: 60,   scatteredRot: -45, isAccent: false },
  { char: 'u', delay: 0.35, scatteredX: -60,  scatteredY: -110, scatteredRot: 55,  isAccent: false },
  { char: 'n', delay: 0.05, scatteredX: 20,   scatteredY: 120,  scatteredRot: -25, isAccent: false },
  { char: 'y', delay: 0.45, scatteredX: -40,  scatteredY: 70,   scatteredRot: 35,  isAccent: false },
  { char: 'a', delay: 0.2,  scatteredX: 90,   scatteredY: -80,  scatteredRot: -30, isAccent: false },
  { char: 'A', delay: 0.5,  scatteredX: 150,  scatteredY: 100,  scatteredRot: 40,  isAccent: true },
  { char: 'I', delay: 0.28, scatteredX: -180, scatteredY: -50,  scatteredRot: -60, isAccent: true }
]

const SHARDS = [
  { id: 1, delay: 0.15, x: -200, y: 150, r: 120, size: 'w-6 h-6',     color: 'bg-terracotta-400', shape: 'polygon(0% 0%, 100% 20%, 70% 100%, 20% 80%)' },
  { id: 2, delay: 0.3,  x: -110, y: 190, r: -90, size: 'w-4 h-5',     color: 'bg-forest-400',     shape: 'polygon(20% 0%, 100% 40%, 80% 100%, 0% 60%)' },
  { id: 3, delay: 0.05, x: 70,   y: 180, r: 150, size: 'w-8 h-4',     color: 'bg-earth-300',      shape: 'polygon(10% 20%, 90% 0%, 100% 80%, 20% 100%)' },
  { id: 4, delay: 0.45, x: 160,  y: 140, r: -60, size: 'w-5 h-5',     color: 'bg-terracotta-500', shape: 'polygon(0% 40%, 80% 0%, 100% 70%, 30% 100%)' },
  { id: 5, delay: 0.22, x: -250, y: 100, r: 80,  size: 'w-5 h-3',     color: 'bg-forest-500',     shape: 'polygon(0% 0%, 100% 0%, 50% 100%)' },
  { id: 6, delay: 0.5,  x: 240,  y: 170, r: -110, size: 'w-4 h-4',     color: 'bg-earth-400',      shape: 'polygon(30% 0%, 100% 30%, 70% 100%, 0% 80%)' },
]

export default function LoadingScreen({ onComplete }) {
  // Animation phases: 'blank' -> 'falling' -> 'reshaping' -> 'vanishing' -> complete
  const [phase, setPhase] = useState('falling')
  
  useEffect(() => {
    // 1. Letters fall and scatter for 2.5 seconds
    const timerReshaping = setTimeout(() => {
      setPhase('reshaping')
    }, 2500)

    // 2. Letters reshape and hold for 2.0 seconds
    const timerVanishing = setTimeout(() => {
      setPhase('vanishing')
    }, 4500)

    // 3. Fade out completely and trigger callback
    const timerComplete = setTimeout(() => {
      onComplete()
    }, 5100)

    return () => {
      clearTimeout(timerReshaping)
      clearTimeout(timerVanishing)
      clearTimeout(timerComplete)
    }
  }, [onComplete])

  const getLetterStyle = (letter) => {
    if (phase === 'blank') {
      return {
        transform: 'translateY(-120vh) rotate(-90deg)',
        opacity: 0,
        transition: 'none'
      }
    }

    if (phase === 'falling') {
      return {
        transform: `translate(${letter.scatteredX}px, ${letter.scatteredY}px) rotate(${letter.scatteredRot}deg)`,
        opacity: 1,
        transition: 'transform 1.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.6s ease-out',
        transitionDelay: `${letter.delay}s`
      }
    }

    // 'reshaping' or 'vanishing' -> fly back to home center layout
    return {
      transform: 'translate(0px, 0px) rotate(0deg)',
      opacity: 1,
      transition: 'transform 1.0s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.5s ease-out'
    }
  }

  const getShardStyle = (shard) => {
    if (phase === 'blank') {
      return {
        transform: 'translateY(-120vh) rotate(-90deg)',
        opacity: 0,
        transition: 'none'
      }
    }

    if (phase === 'falling') {
      return {
        transform: `translate(${shard.x}px, ${shard.y}px) rotate(${shard.r}deg)`,
        opacity: 0.8,
        transition: 'transform 1.3s cubic-bezier(0.175, 0.885, 0.32, 1.25), opacity 0.6s ease-out',
        transitionDelay: `${shard.delay}s`
      }
    }

    // 'reshaping' or 'vanishing' -> shards disperse outward and dissolve
    return {
      transform: `translate(${shard.x * 1.6}px, ${shard.y + 120}px) rotate(${shard.r * 1.5}deg)`,
      opacity: 0,
      transition: 'transform 1.0s ease-in, opacity 0.8s ease-in'
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gold-200 via-gold-300 to-sunset-300 transition-all duration-700 ease-in-out ${
        phase === 'vanishing' ? 'opacity-0 scale-98 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Premium organic ambient glow layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)] pointer-events-none" />

      {/* Main visual container */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-lg h-64">
        {/* Shard particles container (scattered fragments) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {SHARDS.map((shard) => (
            <div
              key={shard.id}
              className={`absolute ${shard.size} ${shard.color}`}
              style={{
                clipPath: shard.shape,
                ...getShardStyle(shard),
              }}
            />
          ))}
        </div>

        {/* Word assembly container */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="flex font-display font-black text-7xl md:text-9xl select-none filter drop-shadow-[0_8px_16px_rgba(58,35,18,0.12)]">
            {LETTERS.map((letter, idx) => (
              <span
                key={idx}
                className={`inline-block transition-all ${
                  letter.isAccent ? 'text-terracotta-600' : 'text-earth-900'
                }`}
                style={getLetterStyle(letter)}
              >
                {letter.char}
              </span>
            ))}
          </div>
        </div>

        {/* Subtle tagline that fades in only when fully reshaped */}
        <div
          className={`absolute bottom-4 text-center transition-all duration-1000 transform ${
            phase === 'reshaping'
              ? 'opacity-70 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          <p className="text-earth-800 text-sm font-medium tracking-widest uppercase">
            Smart Ag Commerce
          </p>
        </div>
      </div>
    </div>
  )
}
