import React, { useState, useEffect } from 'react'
import { ArrowRight, Sprout, Truck, ShoppingBag, MapPin, Shield, Sparkles } from 'lucide-react'

const SLIDES = [
  {
    id: 0,
    icon: Sparkles,
    iconBg: 'from-terracotta-400 to-terracotta-600',
    emoji: '🌾',
    title: 'Welcome to Nunya AI',
    subtitle: 'Smart Agricultural Commerce',
    description:
      'Your all-in-one platform for Volta Region farmers, buyers, and transporters. Connect, trade, and grow together.',
    accentColor: 'terracotta',
    blob1: 'bg-terracotta-300',
    blob2: 'bg-gold-300',
    tagBg: 'bg-terracotta-100 text-terracotta-700',
    tag: 'Volta Region · Ghana',
  },
  {
    id: 1,
    icon: Sprout,
    iconBg: 'from-forest-400 to-forest-600',
    emoji: '🌿',
    title: 'Farmers First',
    subtitle: 'List, track & sell your harvest',
    description:
      'Upload your produce, set prices, and reach verified buyers directly. Real-time market prices at your fingertips.',
    accentColor: 'forest',
    blob1: 'bg-forest-200',
    blob2: 'bg-forest-400',
    tagBg: 'bg-forest-100 text-forest-700',
    tag: 'For Farmers',
  },
  {
    id: 2,
    icon: ShoppingBag,
    iconBg: 'from-gold-400 to-gold-600',
    emoji: '🛒',
    title: 'Buy Smarter',
    subtitle: 'Browse & order fresh produce',
    description:
      'Connect with verified farmers, compare prices, and place orders with confidence. Quality guaranteed.',
    accentColor: 'gold',
    blob1: 'bg-gold-200',
    blob2: 'bg-terracotta-200',
    tagBg: 'bg-gold-100 text-gold-700',
    tag: 'For Buyers & Traders',
  },
  {
    id: 3,
    icon: Truck,
    iconBg: 'from-earth-500 to-earth-700',
    emoji: '🚛',
    title: 'Move It Fast',
    subtitle: 'Haulage & delivery services',
    description:
      'Transport providers can find jobs, plan routes with live maps, and grow their logistics business.',
    accentColor: 'earth',
    blob1: 'bg-earth-200',
    blob2: 'bg-forest-200',
    tagBg: 'bg-earth-100 text-earth-700',
    tag: 'For Transporters',
  },
  {
    id: 4,
    icon: Shield,
    iconBg: 'from-forest-500 to-terracotta-500',
    emoji: '✅',
    title: 'Safe & Trusted',
    subtitle: 'Verified accounts & secure payments',
    description:
      'Every user is verified. Trade with confidence knowing every farmer, buyer, and transporter on the platform is authenticated.',
    accentColor: 'forest',
    blob1: 'bg-terracotta-200',
    blob2: 'bg-forest-300',
    tagBg: 'bg-forest-100 text-forest-700',
    tag: 'Powered by Firebase',
  },
]

export default function WelcomeScreen({ onContinue }) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState('forward') // 'forward' | 'back'
  const [visible, setVisible] = useState(false)

  // Fade in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  // Auto-advance slides every 4 seconds (stops on last slide)
  useEffect(() => {
    if (activeSlide >= SLIDES.length - 1) return
    const t = setTimeout(() => goTo(activeSlide + 1, 'forward'), 4000)
    return () => clearTimeout(t)
  }, [activeSlide])

  function goTo(idx, dir = 'forward') {
    if (animating || idx === activeSlide) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setActiveSlide(idx)
      setAnimating(false)
    }, 300)
  }

  const slide = SLIDES[activeSlide]
  const isLast = activeSlide === SLIDES.length - 1

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease',
        background: 'linear-gradient(135deg, #fdf6e3 0%, #fff8ed 40%, #f0faf4 100%)',
      }}
    >
      {/* Animated ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-20 transition-all duration-1000 ${slide.blob1}`}
          style={{ transform: `translate(${activeSlide * 8}px, ${activeSlide * -4}px)` }}
        />
        <div
          className={`absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-1000 ${slide.blob2}`}
          style={{ transform: `translate(${activeSlide * -6}px, ${activeSlide * 5}px)` }}
        />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-white rounded-full blur-2xl opacity-30" />
      </div>

      {/* Skip button */}
      <div className="relative z-10 flex justify-end px-6 pt-6">
        <button
          onClick={onContinue}
          className="text-earth-400 text-sm font-medium hover:text-earth-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-earth-100"
        >
          Skip
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-4">
        {/* Icon bubble */}
        <div
          className="relative mb-8"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating
              ? `translateY(${direction === 'forward' ? '-20px' : '20px'})`
              : 'translateY(0)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        >
          {/* Outer ring pulse */}
          <div
            className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${slide.iconBg} opacity-20 scale-125`}
            style={{ animation: 'pulse 2.5s ease-in-out infinite' }}
          />
          <div
            className={`relative w-28 h-28 rounded-3xl bg-gradient-to-br ${slide.iconBg} flex items-center justify-center shadow-2xl`}
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
          >
            <span className="text-5xl select-none" role="img">{slide.emoji}</span>
          </div>
        </div>

        {/* Tag pill */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${slide.tagBg}`}
          style={{
            opacity: animating ? 0 : 1,
            transition: 'opacity 0.3s ease 0.05s',
          }}
        >
          {slide.tag}
        </div>

        {/* Title + description */}
        <div
          className="text-center max-w-sm"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating
              ? `translateX(${direction === 'forward' ? '30px' : '-30px'})`
              : 'translateX(0)',
            transition: 'opacity 0.3s ease 0.05s, transform 0.35s ease 0.05s',
          }}
        >
          <h1 className="text-3xl font-black text-earth-900 mb-1 leading-tight">
            {slide.title}
          </h1>
          <p className="text-base font-semibold text-terracotta-600 mb-4">
            {slide.subtitle}
          </p>
          <p className="text-earth-500 text-sm leading-relaxed">
            {slide.description}
          </p>
        </div>
      </div>

      {/* Bottom section: dots + button */}
      <div className="relative z-10 px-6 pb-10 flex flex-col items-center gap-6">
        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > activeSlide ? 'forward' : 'back')}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === activeSlide ? '28px' : '8px',
                height: '8px',
                background: i === activeSlide
                  ? '#C05621' // terracotta-600
                  : '#D6C4A8', // earth-300
              }}
            />
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={isLast ? onContinue : () => goTo(activeSlide + 1, 'forward')}
          className="w-full max-w-sm py-4 px-6 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #C05621 0%, #9C4221 100%)',
            boxShadow: '0 8px 32px rgba(192, 86, 33, 0.35)',
          }}
        >
          {isLast ? (
            <>Get Started <ArrowRight className="w-5 h-5" /></>
          ) : (
            <>Next <ArrowRight className="w-5 h-5" /></>
          )}
        </button>

        {/* Already have account — only on last slide */}
        {isLast && (
          <p className="text-sm text-earth-400">
            Already have an account?{' '}
            <button
              onClick={onContinue}
              className="text-terracotta-600 font-semibold hover:underline"
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
