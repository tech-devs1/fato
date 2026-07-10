import React, { useEffect } from 'react'

// Define the letters for the word "nunyaAi" with individual delays for sequential fall
const LETTERS = [
  { char: 'n', delay: 0.1, isAccent: false },
  { char: 'u', delay: 0.35, isAccent: false },
  { char: 'n', delay: 0.05, isAccent: false },
  { char: 'y', delay: 0.45, isAccent: false },
  { char: 'a', delay: 0.2, isAccent: false },
  { char: 'A', delay: 0.5, isAccent: true },
  { char: 'I', delay: 0.28, isAccent: true }
]

/**
 * LoadingScreen component
 *
 * Concept: Each letter of "nunyaAi" falls from the top, one after another, and assembles
 * into the full word. After the animation completes the screen notifies the parent via
 * onComplete.
 */
export default function LoadingScreen({ onComplete }) {
  // Trigger completion after the last letter has finished its fall animation.
  useEffect(() => {
    // The longest delay among letters plus the animation duration (1.4s) gives the total time.
    const maxDelay = Math.max(...LETTERS.map(l => l.delay))
    const totalDuration = (maxDelay + 1.4) * 1000 + 200 // extra buffer
    const timer = setTimeout(() => {
      onComplete()
    }, totalDuration)
    return () => clearTimeout(timer)
  }, [onComplete])

  // Return the style for each letter based on its delay.
  const getLetterStyle = (letter) => ({
    transform: 'translateY(-120vh)', // start off‑screen above
    opacity: 0,
    animation: `fall 1.4s cubic-bezier(0.175,0.885,0.32,1.275) ${letter.delay}s forwards`,
    // The animation will bring the letter to its final position and set opacity to 1.
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gold-200 via-gold-300 to-sunset-300">
      {/* Ambient glow layer for premium feel */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)] pointer-events-none" />

      {/* Word assembly container */}
      <div className="relative z-10 flex font-display font-black text-7xl md:text-9xl select-none filter drop-shadow-[0_8px_16px_rgba(58,35,18,0.12)]">
        {LETTERS.map((letter, idx) => (
          <span
            key={idx}
            className={`inline-block ${letter.isAccent ? 'text-terracotta-600' : 'text-earth-900'}`}
            style={getLetterStyle(letter)}
          >
            {letter.char}
          </span>
        ))}
      </div>
    </div>
  )
}

/*
 * Animation keyframes (tailwind does not provide a falling keyframe out‑of‑the‑box).
 * This block will be injected by the build step if using a CSS file, but for the
 * sake of completeness we include the CSS here as a comment for the developer.
 *
 * @keyframes fall {
 *   0%   { transform: translateY(-120vh); opacity: 0; }
 *   100% { transform: translateY(0); opacity: 1; }
 * }
 */
