import React from 'react'
import { Star } from 'lucide-react'

export default function RatingStars({ rating = 0, onChange = null, max = 5, size = 4 }) {
  const stars = Array.from({ length: max }, (_, i) => i + 1)
  const isInteractive = onChange !== null

  const sizeClasses = {
    3: 'w-3 h-3',
    4: 'w-4 h-4',
    5: 'w-5 h-5',
    6: 'w-6 h-6',
  }

  const starSize = sizeClasses[size] || 'w-4 h-4'

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((index) => {
        // Calculate fill percentage for partial stars
        const diff = rating - (index - 1)
        const fillPercent = Math.max(0, Math.min(100, diff * 100))

        return (
          <button
            key={index}
            type="button"
            disabled={!isInteractive}
            onClick={() => isInteractive && onChange(index)}
            className={`focus:outline-none transition ${isInteractive ? 'hover:scale-125 duration-150 cursor-pointer' : 'cursor-default'}`}
          >
            <div className="relative">
              {/* Empty Star base */}
              <Star className={`${starSize} text-earth-200 fill-earth-100`} />
              
              {/* Filled Star overlay */}
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <Star className={`${starSize} text-gold-500 fill-gold-400`} />
              </div>
            </div>
          </button>
        )
      })}
      {!isInteractive && rating > 0 && (
        <span className="text-xs font-semibold text-earth-700 ml-1">
          {parseFloat(rating).toFixed(1)}
        </span>
      )}
    </div>
  )
}
