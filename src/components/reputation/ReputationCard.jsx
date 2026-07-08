import React from 'react'
import { Calendar, CheckCircle2, MessageSquare, AlertCircle, TrendingUp, HelpCircle } from 'lucide-react'
import VerificationBadge from './VerificationBadge'
import RatingStars from './RatingStars'

export default function ReputationCard({ profile, role }) {
  if (!profile) return null

  const {
    verification = {},
    reputation = {},
    roleProfile = {}
  } = profile

  // Format dates
  const joinedDate = roleProfile.joined_date
    ? new Date(roleProfile.joined_date).toLocaleDateString('en-GH', { year: 'numeric', month: 'long' })
    : 'Recently'

  // Verification Checklist percentage
  const checklist = [
    { label: 'Phone Number', checked: !!verification.phone_verified },
    { label: 'Email Address', checked: !!verification.email_verified },
    { label: 'National ID', checked: !!verification.national_id_verified },
    { label: 'Location Map', checked: !!verification.location_verified },
  ]
  if (role === 'transport') {
    checklist.push({ label: 'Vehicle Inspected', checked: !!verification.vehicle_verified })
  }

  const verifiedCount = checklist.filter(item => item.checked).length
  const completionPercentage = Math.round((verifiedCount / checklist.length) * 100)

  // Compute rates/stats depending on role
  let transactionLabel = 'Completed Transactions'
  let transactionCount = reputation.completed_transactions || 0
  let primaryRateLabel = 'Response Rate'
  let primaryRateValue = reputation.response_rate !== undefined ? `${Math.round(reputation.response_rate * 100)}%` : '100%'

  if (role === 'farmer') {
    transactionLabel = 'Completed Orders'
    transactionCount = roleProfile.completed_orders || 0
  } else if (role === 'buyer') {
    transactionLabel = 'Completed Purchases'
    transactionCount = roleProfile.completed_purchases || 0
  } else if (role === 'transport') {
    transactionLabel = 'Completed Deliveries'
    transactionCount = roleProfile.completed_deliveries || 0
    primaryRateLabel = 'On-Time Rate'
    primaryRateValue = roleProfile.on_time_delivery_rate !== undefined 
      ? `${Math.round(roleProfile.on_time_delivery_rate * 100)}%` 
      : '100%'
  }

  return (
    <div className="glass-lg rounded-3xl p-6 border border-white/60 bg-white/70 shadow-sm space-y-6">
      {/* Profile Header & Badge */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-earth-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-earth-900">
            {roleProfile.farm_name || roleProfile.business_name || 'My Profile Credentials'}
          </h3>
          <p className="text-sm text-earth-500 capitalize">{role} Account</p>
        </div>
        <VerificationBadge status={roleProfile.verification_status} role={role} />
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-earth-50/50 rounded-2xl border border-earth-100">
          <p className="text-xs text-earth-500 mb-1">Reputation Score</p>
          <RatingStars rating={roleProfile.average_rating || reputation.average_rating || 5.0} size={4} />
        </div>

        <div className="p-4 bg-earth-50/50 rounded-2xl border border-earth-100">
          <p className="text-xs text-earth-500 mb-1">{transactionLabel}</p>
          <p className="text-lg font-bold text-earth-900">{transactionCount}</p>
        </div>

        <div className="p-4 bg-earth-50/50 rounded-2xl border border-earth-100 col-span-2 sm:col-span-1">
          <p className="text-xs text-earth-500 mb-1">{primaryRateLabel}</p>
          <p className="text-lg font-bold text-forest-600">{primaryRateValue}</p>
        </div>
      </div>

      {/* Verification Level & Checklist */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm font-medium text-earth-800">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-forest-600" />
            Verification Level
          </span>
          <span className="text-forest-600">{completionPercentage}% Completed</span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 w-full bg-earth-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-terracotta-500 to-forest-500 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Verification Checkboxes */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {checklist.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              {item.checked ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-600 shrink-0" />
              ) : (
                <HelpCircle className="w-3.5 h-3.5 text-earth-300 shrink-0" />
              )}
              <span className={item.checked ? 'text-earth-800 font-medium' : 'text-earth-400'}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Internal Rank Info (Only visible to user about themselves to show optimization tip) */}
      <div className="p-3 bg-terracotta-50 border border-terracotta-100 rounded-2xl flex items-start gap-2.5 text-xs text-terracotta-800">
        <TrendingUp className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block mb-0.5">Visibility Rank Booster</span>
          <p>
            {completionPercentage === 100 
              ? "All documents approved! Your products appear with premium ranking in search filters."
              : "Verify your National ID & Location map in Settings to boost search ranking positions by up to 40%."
            }
          </p>
        </div>
      </div>

      {/* Joined Date */}
      <div className="flex items-center gap-2 text-xs text-earth-400 border-t border-earth-100 pt-3">
        <Calendar className="w-3.5 h-3.5" />
        <span>Member since {joinedDate}</span>
      </div>
    </div>
  )
}
