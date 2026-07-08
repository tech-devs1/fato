import React, { useState } from 'react'
import { Sprout, Package, Truck, TrendingUp, Heart, Settings, Plus, Search, Filter, ChevronRight, AlertCircle, CheckCircle, Clock, Thermometer, Droplets, LogOut, Bell } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import ReputationCard from '../reputation/ReputationCard'

export default function FarmerDashboard({ onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview')
  const { userFullProfile, userProfile, logOut } = useAuth()

  const mockProfile = {
    user: { displayName: 'Emmanuel A.' },
    verification: {
      phone_verified: true,
      email_verified: true,
      national_id_verified: true,
      location_verified: true
    },
    reputation: {
      completed_transactions: 12,
      successful_transactions: 12,
      average_rating: 4.9,
      response_rate: 0.98,
      reputation_level: 'Active Member'
    },
    roleProfile: {
      farm_name: "Emmanuel's Organic Farm",
      verification_status: 'Verified Farmer',
      completed_orders: 12,
      average_rating: 4.9,
      response_rate: 0.98,
      joined_date: '2024-01-10T12:00:00Z'
    }
  }

  const profile = userFullProfile || mockProfile
  const displayName = profile.user?.displayName || userProfile?.displayName || 'Emmanuel'

  async function handleLogout() {
    await logOut()
    if (onLogout) onLogout()
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Sprout className="w-5 h-5" /> },
    { id: 'produce', label: 'My Produce', icon: <Package className="w-5 h-5" /> },
    { id: 'orders', label: 'Orders', icon: <CheckCircle className="w-5 h-5" /> },
    { id: 'transport', label: 'Transport', icon: <Truck className="w-5 h-5" /> },
    { id: 'insights', label: 'Insights', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'health', label: 'Post-Harvest', icon: <Heart className="w-5 h-5" /> },
  ]

  const myProduce = [
    { id: 1, name: 'Cassava', quantity: '500 kg', price: '₵2.50/kg', freshness: 95, status: 'listed', location: 'Ho' },
    { id: 2, name: 'Tomatoes', quantity: '300 kg', price: '₵4.20/kg', freshness: 88, status: 'listed', location: 'Ho' },
    { id: 3, name: 'Maize', quantity: '750 kg', price: '₵3.10/kg', freshness: 92, status: 'pending', location: 'Anloga' },
  ]

  const orders = [
    { id: 2847, buyer: 'Keta Market Co.', items: 'Cassava 200kg', amount: '₵500', status: 'confirmed', date: 'Today' },
    { id: 2846, buyer: 'Ho Foods Ltd', items: 'Tomatoes 150kg', amount: '₵630', status: 'delivering', date: 'Yesterday' },
    { id: 2845, buyer: 'Anloga Export', items: 'Maize 400kg', amount: '₵1,240', status: 'completed', date: '2 days ago' },
  ]

  const transportRequests = [
    { id: 1, from: 'Ho', to: 'Keta', cargo: 'Cassava 200kg', status: 'matched', driver: 'Kofi Mensah' },
    { id: 2, from: 'Anloga', to: 'Ho', cargo: 'Maize 300kg', status: 'pending', driver: null },
  ]

  const postHarvestHealth = [
    { produce: 'Cassava', freshness: 95, spoilageRisk: 'low', storageTemp: '25°C', humidity: '65%', recommendation: 'Optimal' },
    { produce: 'Tomatoes', freshness: 88, spoilageRisk: 'medium', storageTemp: '22°C', humidity: '70%', recommendation: 'Sell within 3 days' },
    { produce: 'Maize', freshness: 92, spoilageRisk: 'low', storageTemp: '20°C', humidity: '60%', recommendation: 'Optimal' },
  ]

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(160deg, #f0f9f4 0%, #fef7f0 100%)' }}>
      {/* Farmer Identity Header */}
      <header className="sticky top-0 z-50 px-6 py-4" style={{ background: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 60%, #52b788 100%)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">My Farm</h1>
              <p className="text-xs text-green-100">Farmer Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-white/20 rounded-full">
              <p className="text-xs font-semibold text-white">{displayName}</p>
            </div>
            <button onClick={handleLogout} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-6 py-4 overflow-x-auto bg-white/60 border-b border-green-100">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-white shadow-md'
                  : 'bg-white text-earth-600 hover:bg-green-50'
              }`}
              style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #2d6a4f, #52b788)' } : {}}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="px-6 py-6 max-w-7xl mx-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Reputation & Verification System */}
            <ReputationCard profile={profile} role="farmer" />

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Produce" value="1,550 kg" change="+12%" icon={<Package />} color="terracotta" />
              <StatCard label="Active Orders" value="3" change="+1" icon={<CheckCircle />} color="forest" />
              <StatCard label="Revenue" value="₵2,370" change="+18%" icon={<TrendingUp />} color="gold" />
              <StatCard label="Avg Freshness" value="92%" change="+2%" icon={<Heart />} color="earth" />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickAction icon={<Plus />} label="Add Produce" color="terracotta" />
              <QuickAction icon={<Truck />} label="Request Transport" color="forest" />
              <QuickAction icon={<Search />} label="Find Buyers" color="gold" />
              <QuickAction icon={<TrendingUp />} label="View Prices" color="earth" />
            </div>

            {/* Recent Activity */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-earth-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <ActivityItem message="Order #2847 confirmed by Keta Market Co." time="2 hours ago" type="success" />
                <ActivityItem message="Cassava freshness updated to 95%" time="4 hours ago" type="info" />
                <ActivityItem message="Transport request matched with Kofi Mensah" time="6 hours ago" type="success" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'produce' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-earth-900">My Produce</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-terracotta-600 text-white rounded-xl font-medium hover:bg-terracotta-700 transition-colors">
                <Plus className="w-5 h-5" />
                <span>Add Produce</span>
              </button>
            </div>

            <div className="grid gap-4">
              {myProduce.map((produce) => (
                <ProduceCard key={produce.id} produce={produce} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-earth-900">Orders</h2>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl font-medium hover:bg-earth-100 transition-colors">
                  <Filter className="w-5 h-5" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transport' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-earth-900">Transport Requests</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-terracotta-600 text-white rounded-xl font-medium hover:bg-terracotta-700 transition-colors">
                <Plus className="w-5 h-5" />
                <span>New Request</span>
              </button>
            </div>

            <div className="grid gap-4">
              {transportRequests.map((request) => (
                <TransportCard key={request.id} request={request} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-earth-900">Market Insights</h2>
            
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-earth-900 mb-4">Price Trends</h3>
              <div className="space-y-4">
                <PriceTrend product="Cassava" current="₵2.50/kg" trend="+12%" status="up" />
                <PriceTrend product="Tomatoes" current="₵4.20/kg" trend="+8%" status="up" />
                <PriceTrend product="Maize" current="₵3.10/kg" trend="-3%" status="down" />
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-earth-900 mb-4">Demand Forecast</h3>
              <p className="text-earth-600 mb-4">AI predicts high demand for cassava in Keta over the next 7 days.</p>
              <div className="flex items-center gap-2 text-forest-600">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">45% above average</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-earth-900">Post-Harvest Health</h2>
            
            <div className="grid gap-4">
              {postHarvestHealth.map((item, index) => (
                <HealthCard key={index} health={item} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Farmer Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-green-100 px-6 py-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-around">
          <NavItem icon={<Sprout className="w-6 h-6" />} label="Dashboard" active={true} color="#2d6a4f" onClick={() => setActiveTab('overview')} />
          <NavItem icon={<Package className="w-6 h-6" />} label="Produce" onClick={() => setActiveTab('produce')} />
          <NavItem icon={<CheckCircle className="w-6 h-6" />} label="Orders" onClick={() => setActiveTab('orders')} />
          <NavItem icon={<Heart className="w-6 h-6" />} label="Health" onClick={() => setActiveTab('health')} />
        </div>
      </nav>
    </div>
  )
}

function StatCard({ label, value, change, icon, color }) {
  const colorClasses = {
    terracotta: 'from-terracotta-500 to-terracotta-600 bg-terracotta-50',
    forest: 'from-forest-500 to-forest-600 bg-forest-50',
    gold: 'from-gold-500 to-gold-600 bg-gold-50',
    earth: 'from-earth-500 to-earth-600 bg-earth-50',
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-earth-600 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-earth-900">{value}</span>
        <span className="text-sm font-medium text-forest-600">{change}</span>
      </div>
    </div>
  )
}

function QuickAction({ icon, label, color }) {
  const colorClasses = {
    terracotta: 'bg-terracotta-50 text-terracotta-600 hover:bg-terracotta-100',
    forest: 'bg-forest-50 text-forest-600 hover:bg-forest-100',
    gold: 'bg-gold-50 text-gold-600 hover:bg-gold-100',
    earth: 'bg-earth-50 text-earth-600 hover:bg-earth-100',
  }

  return (
    <button className={`glass rounded-2xl p-6 flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 ${colorClasses[color]}`}>
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  )
}

function ActivityItem({ message, time, type }) {
  const typeColors = {
    success: 'bg-forest-100 text-forest-600',
    info: 'bg-gold-100 text-gold-600',
    warning: 'bg-sunset-100 text-sunset-600',
  }

  const typeIcons = {
    success: <CheckCircle className="w-4 h-4" />,
    info: <Clock className="w-4 h-4" />,
    warning: <AlertCircle className="w-4 h-4" />,
  }

  return (
    <div className="flex items-center gap-4">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeColors[type]}`}>
        {typeIcons[type]}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-earth-900">{message}</p>
        <p className="text-xs text-earth-500">{time}</p>
      </div>
    </div>
  )
}

function ProduceCard({ produce }) {
  const statusColors = {
    listed: 'bg-forest-100 text-forest-700',
    pending: 'bg-gold-100 text-gold-700',
    sold: 'bg-earth-100 text-earth-700',
  }

  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-earth-900">{produce.name}</h3>
          <p className="text-sm text-earth-500">{produce.location}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[produce.status]}`}>
          {produce.status}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-earth-500 mb-1">Quantity</p>
          <p className="font-semibold text-earth-900">{produce.quantity}</p>
        </div>
        <div>
          <p className="text-xs text-earth-500 mb-1">Price</p>
          <p className="font-semibold text-earth-900">{produce.price}</p>
        </div>
        <div>
          <p className="text-xs text-earth-500 mb-1">Freshness</p>
          <p className="font-semibold text-forest-600">{produce.freshness}%</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex-1 px-4 py-2 bg-terracotta-600 text-white rounded-xl font-medium hover:bg-terracotta-700 transition-colors">
          Edit
        </button>
        <button className="flex-1 px-4 py-2 bg-white text-earth-900 rounded-xl font-medium hover:bg-earth-100 transition-colors border border-earth-200">
          View Details
        </button>
      </div>
    </div>
  )
}

function OrderCard({ order }) {
  const statusColors = {
    confirmed: 'bg-forest-100 text-forest-700',
    delivering: 'bg-gold-100 text-gold-700',
    completed: 'bg-earth-100 text-earth-700',
  }

  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-earth-500 mb-1">Order #{order.id}</p>
          <h3 className="text-lg font-bold text-earth-900">{order.buyer}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>
      
      <p className="text-sm text-earth-600 mb-2">{order.items}</p>
      <div className="flex items-end justify-between">
        <p className="text-xs text-earth-500">{order.date}</p>
        <p className="text-xl font-bold text-earth-900">{order.amount}</p>
      </div>
    </div>
  )
}

function TransportCard({ request }) {
  const statusColors = {
    matched: 'bg-forest-100 text-forest-700',
    pending: 'bg-gold-100 text-gold-700',
  }

  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-terracotta-600" />
          <div>
            <p className="font-semibold text-earth-900">{request.from} → {request.to}</p>
            <p className="text-sm text-earth-500">{request.cargo}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
          {request.status}
        </span>
      </div>
      
      {request.driver ? (
        <div className="flex items-center gap-2 text-earth-600">
          <CheckCircle className="w-4 h-4 text-forest-600" />
          <span className="text-sm">Driver: {request.driver}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-earth-600">
          <Clock className="w-4 h-4 text-gold-600" />
          <span className="text-sm">Waiting for driver...</span>
        </div>
      )}
    </div>
  )
}

function PriceTrend({ product, current, trend, status }) {
  return (
    <div className="flex items-center justify-between p-4 bg-earth-50 rounded-xl">
      <div>
        <p className="font-medium text-earth-900">{product}</p>
        <p className="text-sm text-earth-500">{current}</p>
      </div>
      <span className={`text-sm font-medium ${status === 'up' ? 'text-forest-600' : 'text-terracotta-600'}`}>
        {trend}
      </span>
    </div>
  )
}

function HealthCard({ health }) {
  const riskColors = {
    low: 'bg-forest-100 text-forest-700',
    medium: 'bg-gold-100 text-gold-700',
    high: 'bg-sunset-100 text-sunset-700',
  }

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-earth-900">{health.produce}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${riskColors[health.spoilageRisk]}`}>
          {health.spoilageRisk} risk
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-terracotta-600" />
          <div>
            <p className="text-xs text-earth-500">Temperature</p>
            <p className="font-medium text-earth-900">{health.storageTemp}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-forest-600" />
          <div>
            <p className="text-xs text-earth-500">Humidity</p>
            <p className="font-medium text-earth-900">{health.humidity}</p>
          </div>
        </div>
      </div>

      <div className="p-3 bg-earth-50 rounded-xl">
        <p className="text-sm text-earth-600">
          <span className="font-medium text-earth-900">AI Recommendation:</span> {health.recommendation}
        </p>
      </div>
    </div>
  )
}

function NavItem({ icon, label, active, onClick, color = '#c1440e' }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all duration-300 ${
        active ? 'scale-105' : 'text-earth-400 hover:text-earth-600'
      }`}
      style={active ? { color } : {}}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
