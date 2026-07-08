import React from 'react'
import { Shield, Sparkles, CheckCircle2, Award } from 'lucide-react'

export default function VerificationBadge({ status, role = 'farmer' }) {
  const normalizedStatus = status || `New ${role.charAt(0).toUpperCase() + role.slice(1)}`

  // Get style details based on badge value
  const getBadgeDetails = (statusVal) => {
    const s = statusVal.toLowerCase()
    
    // Trusted status (Gold / Award)
    if (s.includes('trusted')) {
      return {
        bg: 'bg-gold-50 border-gold-200 text-gold-700',
        icon: <Award className="w-4 h-4 fill-gold-500 text-gold-600 animate-pulse" />,
        label: statusVal,
      }
    }
    
    // Intermediate status (Growing / Frequent / Reliable - Forest/Emerald)
    if (s.includes('growing') || s.includes('frequent') || s.includes('reliable')) {
      return {
        bg: 'bg-forest-50 border-forest-200 text-forest-700',
        icon: <Sparkles className="w-4 h-4 text-forest-600" />,
        label: statusVal,
      }
    }
    
    // Verified status (Blue / Shield)
    if (s.includes('verified')) {
      return {
        bg: 'bg-blue-50 border-blue-200 text-blue-700',
        icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
        label: statusVal,
      }
    }
    
    // Default / New status (Terracotta/Earth)
    return {
      bg: 'bg-terracotta-50 border-terracotta-200 text-terracotta-700',
      icon: <Shield className="w-4 h-4 text-terracotta-600" />,
      label: statusVal,
    }
  }

  const badge = getBadgeDetails(normalizedStatus)

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold shadow-sm transition-all duration-300 ${badge.bg}`}>
      {badge.icon}
      <span>{badge.label}</span>
    </div>
  )
}
