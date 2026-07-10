import React, { useState } from 'react'
import { User, Phone, MapPin, Save, ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'

export default function ProfileCompletion({ onComplete }) {
  const { userProfile, userFullProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    phone: userProfile?.phone || '',
    community: userFullProfile?.roleProfile?.community || '',
    // Role-specific fields
    farmName: userFullProfile?.roleProfile?.farm_name || '',
    businessName: userFullProfile?.roleProfile?.business_name || '',
    vehicleType: userFullProfile?.roleProfile?.vehicle_type || '',
  })

  const role = userProfile?.role || 'farmer'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userRef = doc(db, 'users', userProfile.uid)
      
      // Update user document
      await updateDoc(userRef, {
        displayName: formData.displayName,
        phone: formData.phone,
        profileComplete: true
      })

      // Update role-specific document
      if (role === 'farmer') {
        const farmerRef = doc(db, 'farmers', userProfile.uid)
        await updateDoc(farmerRef, {
          farm_name: formData.farmName,
          community: formData.community
        })
      } else if (role === 'buyer') {
        const buyerRef = doc(db, 'buyers', userProfile.uid)
        await updateDoc(buyerRef, {
          business_name: formData.businessName,
          location: formData.community
        })
      } else if (role === 'transport') {
        const transporterRef = doc(db, 'transporters', userProfile.uid)
        await updateDoc(transporterRef, {
          vehicle_type: formData.vehicleType,
          community: formData.community
        })
      }

      onComplete()
    } catch (err) {
      console.error('Profile completion error:', err)
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-terracotta-50 to-forest-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-terracotta-500 to-terracotta-700 rounded-2xl mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-earth-900 mb-2">Complete Your Profile</h1>
          <p className="text-earth-600">Please fill in your details to continue</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400 w-4 h-4" />
                <input
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={e => setFormData({...formData, displayName: e.target.value})}
                  className="w-full py-3 pl-11 pr-4 bg-white border border-earth-200 rounded-xl text-earth-900 placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400 w-4 h-4" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full py-3 pl-11 pr-4 bg-white border border-earth-200 rounded-xl text-earth-900 placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent"
                  placeholder="+233241234567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Community / Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400 w-4 h-4" />
                <input
                  type="text"
                  required
                  value={formData.community}
                  onChange={e => setFormData({...formData, community: e.target.value})}
                  className="w-full py-3 pl-11 pr-4 bg-white border border-earth-200 rounded-xl text-earth-900 placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent"
                  placeholder="e.g., Ho, Anloga, Keta"
                />
              </div>
            </div>

            {role === 'farmer' && (
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Farm Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.farmName}
                  onChange={e => setFormData({...formData, farmName: e.target.value})}
                  className="w-full py-3 px-4 bg-white border border-earth-200 rounded-xl text-earth-900 placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent"
                  placeholder="e.g., Emmanuel's Organic Farm"
                />
              </div>
            )}

            {role === 'buyer' && (
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={e => setFormData({...formData, businessName: e.target.value})}
                  className="w-full py-3 px-4 bg-white border border-earth-200 rounded-xl text-earth-900 placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent"
                  placeholder="e.g., Keta Market Co."
                />
              </div>
            )}

            {role === 'transport' && (
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Vehicle Type
                </label>
                <input
                  type="text"
                  required
                  value={formData.vehicleType}
                  onChange={e => setFormData({...formData, vehicleType: e.target.value})}
                  className="w-full py-3 px-4 bg-white border border-earth-200 rounded-xl text-earth-900 placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent"
                  placeholder="e.g., Light Truck, Van"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:from-terracotta-700 hover:to-terracotta-800 transition-all duration-200 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Complete Profile
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-terracotta-50 rounded-xl border border-terracotta-100">
            <p className="text-sm text-terracotta-700 text-center">
              <CheckCircle className="w-4 h-4 inline mr-1" />
              Complete your profile to access all features
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
