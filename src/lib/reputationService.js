import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from './firebase'

// ── Role Constants & Statuses ────────────────────────────────────────────────
export const VERIFICATION_STATUSES = {
  farmer: ['New Farmer', 'Verified Farmer', 'Growing Reputation', 'Trusted Farmer'],
  buyer: ['New Buyer', 'Verified Buyer', 'Frequent Buyer', 'Trusted Buyer'],
  transporter: ['New Transporter', 'Verified Transporter', 'Reliable Transporter', 'Trusted Transporter'],
}

export const REPUTATION_LEVELS = [
  'New Member',
  'Active Member',
  'Reliable Member',
  'Trusted Member',
  'Top Performer'
]

// Helper to calculate reputation level internally
export function calculateReputationLevel(stats) {
  const { completed = 0, successRate = 1, rating = 5, disputes = 0 } = stats
  
  if (completed >= 50 && successRate >= 0.98 && rating >= 4.8 && disputes === 0) {
    return 'Top Performer'
  }
  if (completed >= 25 && successRate >= 0.95 && rating >= 4.6 && disputes <= 1) {
    return 'Trusted Member'
  }
  if (completed >= 10 && successRate >= 0.90 && rating >= 4.2 && disputes <= 2) {
    return 'Reliable Member'
  }
  if (completed >= 3 && successRate >= 0.80) {
    return 'Active Member'
  }
  return 'New Member'
}

// ── Profile Creation Helpers ────────────────────────────────────────────────
export async function initializeUserProfile(userId, role, displayName, extraData = {}) {
  const joinedDate = new Date().toISOString()

  // 1. Create base verification doc
  const verificationRef = doc(db, 'verifications', userId)
  await setDoc(verificationRef, {
    verification_id: userId,
    user_id: userId,
    phone_verified: !!extraData.phone,
    email_verified: !!extraData.email,
    national_id_verified: false,
    location_verified: false,
    vehicle_verified: false,
    verification_date: joinedDate
  })

  // 2. Create base internal user reputation doc
  const reputationRef = doc(db, 'user_reputation', userId)
  await setDoc(reputationRef, {
    reputation_id: userId,
    user_id: userId,
    completed_transactions: 0,
    successful_transactions: 0,
    cancelled_transactions: 0,
    average_rating: 5.0,
    response_rate: 1.0,
    dispute_count: 0,
    reputation_level: 'New Member'
  })

  // 3. Create specific role profile doc
  if (role === 'farmer') {
    const farmerRef = doc(db, 'farmers', userId)
    await setDoc(farmerRef, {
      farmer_id: userId,
      user_id: userId,
      farm_name: extraData.farmName || `${displayName || 'New'}'s Farm`,
      region: extraData.region || 'Volta Region',
      district: extraData.district || 'Ho Municipal',
      community: extraData.community || 'Ho',
      farm_size: extraData.farmSize || '1-5 acres',
      years_experience: extraData.yearsExperience || 1,
      verification_status: 'New Farmer',
      completed_orders: 0,
      average_rating: 5.0,
      response_rate: 1.0,
      joined_date: joinedDate
    })
  } else if (role === 'buyer') {
    const buyerRef = doc(db, 'buyers', userId)
    await setDoc(buyerRef, {
      buyer_id: userId,
      user_id: userId,
      business_name: extraData.businessName || `${displayName || 'New'} Enterprises`,
      buyer_type: extraData.buyerType || 'Retailer',
      location: extraData.location || 'Ho',
      verification_status: 'New Buyer',
      completed_purchases: 0,
      average_rating: 5.0,
      response_rate: 1.0,
      joined_date: joinedDate
    })
  } else if (role === 'transport') {
    const transporterRef = doc(db, 'transporters', userId)
    await setDoc(transporterRef, {
      transporter_id: userId,
      user_id: userId,
      vehicle_type: extraData.vehicleType || 'Light Truck',
      vehicle_capacity: extraData.vehicleCapacity || '2 tons',
      license_number: extraData.licenseNumber || '',
      verification_status: 'New Transporter',
      completed_deliveries: 0,
      average_rating: 5.0,
      on_time_delivery_rate: 1.0,
      joined_date: joinedDate
    })
  }
}

// ── Profile Updates & Fetches ───────────────────────────────────────────────
export async function getCompleteProfile(userId, role) {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) return null

    const userData = userSnap.data()
    const verificationSnap = await getDoc(doc(db, 'verifications', userId))
    const reputationSnap = await getDoc(doc(db, 'user_reputation', userId))
    
    let roleData = null
    const roleCollection = role === 'transport' ? 'transporters' : `${role}s`
    if (roleCollection) {
      const roleSnap = await getDoc(doc(db, roleCollection, userId))
      if (roleSnap.exists()) {
        roleData = roleSnap.data()
      }
    }

    return {
      user: userData,
      verification: verificationSnap.exists() ? verificationSnap.data() : null,
      reputation: reputationSnap.exists() ? reputationSnap.data() : null,
      roleProfile: roleData
    }
  } catch (error) {
    console.error('Error fetching complete profile:', error)
    return null
  }
}

// Verification toggle by admin
export async function adminUpdateVerification(userId, field, verifiedValue, role) {
  const verificationRef = doc(db, 'verifications', userId)
  await updateDoc(verificationRef, {
    [field]: verifiedValue,
    verification_date: new Date().toISOString()
  })

  // Refresh status
  const verificationSnap = await getDoc(verificationRef)
  const v = verificationSnap.data()

  // Calculate new verification status for the role
  let newStatus = ''
  if (role === 'farmer') {
    const farmerRef = doc(db, 'farmers', userId)
    const fSnap = await getDoc(farmerRef)
    if (fSnap.exists()) {
      const f = fSnap.data()
      const isVerified = v.phone_verified && v.email_verified && v.national_id_verified && v.location_verified
      
      if (f.completed_orders >= 20 && f.average_rating >= 4.5 && isVerified) {
        newStatus = 'Trusted Farmer'
      } else if (f.completed_orders >= 5 && f.average_rating >= 4.0 && isVerified) {
        newStatus = 'Growing Reputation'
      } else if (isVerified) {
        newStatus = 'Verified Farmer'
      } else {
        newStatus = 'New Farmer'
      }
      await updateDoc(farmerRef, { verification_status: newStatus })
    }
  } else if (role === 'buyer') {
    const buyerRef = doc(db, 'buyers', userId)
    const bSnap = await getDoc(buyerRef)
    if (bSnap.exists()) {
      const b = bSnap.data()
      const isVerified = v.phone_verified && v.email_verified && v.national_id_verified && v.location_verified
      
      if (b.completed_purchases >= 20 && b.average_rating >= 4.5 && isVerified) {
        newStatus = 'Trusted Buyer'
      } else if (b.completed_purchases >= 5 && isVerified) {
        newStatus = 'Frequent Buyer'
      } else if (isVerified) {
        newStatus = 'Verified Buyer'
      } else {
        newStatus = 'New Buyer'
      }
      await updateDoc(buyerRef, { verification_status: newStatus })
    }
  } else if (role === 'transport') {
    const transporterRef = doc(db, 'transporters', userId)
    const tSnap = await getDoc(transporterRef)
    if (tSnap.exists()) {
      const t = tSnap.data()
      const isVerified = v.phone_verified && v.email_verified && v.national_id_verified && v.location_verified && v.vehicle_verified
      
      if (t.completed_deliveries >= 30 && t.average_rating >= 4.5 && t.on_time_delivery_rate >= 0.90 && isVerified) {
        newStatus = 'Trusted Transporter'
      } else if (t.completed_deliveries >= 10 && t.on_time_delivery_rate >= 0.85 && isVerified) {
        newStatus = 'Reliable Transporter'
      } else if (isVerified) {
        newStatus = 'Verified Transporter'
      } else {
        newStatus = 'New Transporter'
      }
      await updateDoc(transporterRef, { verification_status: newStatus })
    }
  }
}

// Update stats after a transaction completes / gets rated
export async function updateTransactionStats(userId, role, rating, success = true) {
  const repRef = doc(db, 'user_reputation', userId)
  const repSnap = await getDoc(repRef)
  
  if (repSnap.exists()) {
    const r = repSnap.data()
    const newCompleted = r.completed_transactions + 1
    const newSuccess = r.successful_transactions + (success ? 1 : 0)
    const newCancelled = r.cancelled_transactions + (success ? 0 : 1)
    
    // Welford's algorithm or simple moving average
    const newAvgRating = ((r.average_rating * r.completed_transactions) + rating) / newCompleted
    
    const stats = {
      completed: newCompleted,
      successRate: newSuccess / newCompleted,
      rating: newAvgRating,
      disputes: r.dispute_count
    }
    
    const newLevel = calculateReputationLevel(stats)
    
    await updateDoc(repRef, {
      completed_transactions: newCompleted,
      successful_transactions: newSuccess,
      cancelled_transactions: newCancelled,
      average_rating: parseFloat(newAvgRating.toFixed(2)),
      reputation_level: newLevel
    })

    // Also update role table
    if (role === 'farmer') {
      const fRef = doc(db, 'farmers', userId)
      await updateDoc(fRef, {
        completed_orders: newCompleted,
        average_rating: parseFloat(newAvgRating.toFixed(2))
      })
    } else if (role === 'buyer') {
      const bRef = doc(db, 'buyers', userId)
      await updateDoc(bRef, {
        completed_purchases: newCompleted,
        average_rating: parseFloat(newAvgRating.toFixed(2))
      })
    } else if (role === 'transport') {
      const tRef = doc(db, 'transporters', userId)
      await updateDoc(tRef, {
        completed_deliveries: newCompleted,
        average_rating: parseFloat(newAvgRating.toFixed(2))
      })
    }
  }
}

// ── Search & Ranking Engine ─────────────────────────────────────────────────
/**
 * Ranks listings using a weighted multi-factor formula.
 * Solves the cold start problem: new verified farmers (completed orders = 0)
 * get a boost so they are visible alongside seasoned sellers.
 * 
 * Factors:
 * 1. Distance (25% weight)
 * 2. Price Competitiveness (20% weight)
 * 3. Product Availability (15% weight)
 * 4. Average Rating (20% weight)
 * 5. Response Rate (10% weight)
 * 6. Verification Status (10% weight)
 */
export function rankListings(listings, userLocation = 'Ho') {
  return listings
    .map(item => {
      // 1. Distance Factor (shorter = higher score)
      let distanceScore = 0.5
      if (item.location && userLocation) {
        if (item.location.toLowerCase() === userLocation.toLowerCase()) {
          distanceScore = 1.0
        } else {
          // Assume neighbouring towns in Volta region
          const distMap = {
            'ho-anloga': 0.6,
            'ho-keta': 0.5,
            'anloga-keta': 0.9,
          }
          const key1 = `${item.location.toLowerCase()}-${userLocation.toLowerCase()}`
          const key2 = `${userLocation.toLowerCase()}-${item.location.toLowerCase()}`
          distanceScore = distMap[key1] || distMap[key2] || 0.3
        }
      }

      // 2. Price Competitiveness Factor (lower price = higher score)
      // Extract numeric value from "₵2.50/kg" -> 2.5
      let priceVal = 3.0
      if (item.price) {
        const match = item.price.match(/[\d.]+/)
        if (match) priceVal = parseFloat(match[0])
      }
      // Simple scaling relative to a standard base price (lower is better, cap at 1.0)
      const priceScore = Math.max(0.1, Math.min(1.0, 5.0 / (priceVal || 1.0)))

      // 3. Product Availability (more quantity = slightly better, cap at 1.0)
      let qtyVal = 100
      if (item.quantity) {
        const match = item.quantity.match(/[\d.]+/)
        if (match) qtyVal = parseFloat(match[0])
      }
      const availabilityScore = Math.min(1.0, qtyVal / 1000)

      // 4. Average Rating Factor
      // Cold-start fix: if no reviews yet (or 0 average rating), give a baseline default 4.5 rating
      const rating = item.rating || 4.5
      const ratingScore = rating / 5.0

      // 5. Response Rate Factor
      const responseRate = item.responseRate !== undefined ? item.responseRate : 0.90
      const responseScore = responseRate

      // 6. Verification Status Factor
      // Map verification status to numerical value
      let verificationScore = 0.25
      const vStatus = item.verification_status || item.verificationStatus || 'New Farmer'
      if (vStatus.includes('Trusted')) {
        verificationScore = 1.0
      } else if (vStatus.includes('Growing') || vStatus.includes('Frequent') || vStatus.includes('Reliable')) {
        verificationScore = 0.8
      } else if (vStatus.includes('Verified')) {
        verificationScore = 0.6
      } else {
        // Cold start boost if verified details exist in another way or user is verified
        if (item.isVerified) {
          verificationScore = 0.6
        }
      }

      // Multi-factor Weighted Sum
      const totalScore = (
        (distanceScore * 0.25) +
        (priceScore * 0.20) +
        (availabilityScore * 0.15) +
        (ratingScore * 0.20) +
        (responseScore * 0.10) +
        (verificationScore * 0.10)
      )

      return {
        ...item,
        _internalScore: totalScore,
        // Cold-start flag for debugging or special UI hints
        isColdStartEligible: !item.rating && (vStatus.includes('Verified') || item.isVerified)
      }
    })
    .sort((a, b) => b._internalScore - a._internalScore)
}
