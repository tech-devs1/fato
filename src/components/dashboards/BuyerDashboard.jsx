import React, { useState } from 'react'
import { ShoppingBag, Search, Heart, Package, Truck, TrendingUp, Filter, MapPin, Star, ChevronRight, Clock, CheckCircle, AlertCircle, LogOut } from 'lucide-react'
import { rankListings } from '../../lib/reputationService'
import VerificationBadge from '../reputation/VerificationBadge'
import { useAuth } from '../../contexts/AuthContext'

export default function BuyerDashboard({ onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('marketplace')
  const { userProfile, logOut } = useAuth()

  const displayName = userProfile?.displayName || 'Buyer'

  async function handleLogout() {
    await logOut()
    if (onLogout) onLogout()
  }

  const tabs = [
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'orders', label: 'Orders', icon: <Package className="w-5 h-5" /> },
    { id: 'saved', label: 'Saved', icon: <Heart className="w-5 h-5" /> },
    { id: 'delivery', label: 'Delivery', icon: <Truck className="w-5 h-5" /> },
    { id: 'insights', label: 'Insights', icon: <TrendingUp className="w-5 h-5" /> },
  ]

  const marketplaceItems = [
    { id: 1, name: 'Fresh Cassava', farmer: 'Emmanuel A.', location: 'Ho', quantity: '500 kg', price: '₵2.50/kg', freshness: 95, rating: 4.8, image: 'cassava', verification_status: 'Verified Farmer', responseRate: 0.95 },
    { id: 2, name: 'Organic Tomatoes', farmer: 'Grace K.', location: 'Anloga', quantity: '300 kg', price: '₵4.20/kg', freshness: 92, rating: 4.9, image: 'tomatoes', verification_status: 'Growing Reputation', responseRate: 0.98 },
    { id: 3, name: 'Yellow Maize', farmer: 'Kofi M.', location: 'Keta', quantity: '750 kg', price: '₵3.10/kg', freshness: 88, rating: 4.7, image: 'maize', verification_status: 'Verified Farmer', responseRate: 0.90 },
    { id: 4, name: 'Puna Yams', farmer: 'Comfort D.', location: 'Ho', quantity: '400 kg', price: '₵5.80/kg', freshness: 94, rating: 4.6, image: 'yam', verification_status: 'Trusted Farmer', responseRate: 0.99 },
    { id: 5, name: 'Sweet Potatoes', farmer: 'Samuel T.', location: 'Anloga', quantity: '250 kg', price: '₵3.50/kg', freshness: 90, rating: 4.5, image: 'potato', verification_status: 'New Farmer', responseRate: 0.85 },
    { id: 6, name: 'Hot Peppers', farmer: 'Beatrice A.', location: 'Keta', quantity: '150 kg', price: '₵6.00/kg', freshness: 96, rating: 4.8, image: 'pepper', verification_status: 'Trusted Farmer', responseRate: 1.00 },
    { id: 7, name: 'White Yam (New User)', farmer: 'Sena Y.', location: 'Ho', quantity: '200 kg', price: '₵4.50/kg', freshness: 98, rating: 0, verification_status: 'Verified Farmer', isVerified: true, responseRate: 0.95 }
  ]

  const rankedItems = rankListings(marketplaceItems, 'Ho')

  const orders = [
    { id: 2847, items: 'Cassava 200kg, Tomatoes 100kg', amount: '₵920', status: 'processing', date: 'Today', eta: '2 days' },
    { id: 2846, items: 'Maize 400kg', amount: '₵1,240', status: 'shipped', date: 'Yesterday', eta: '1 day' },
    { id: 2845, items: 'Yam 300kg', amount: '₵1,740', status: 'delivered', date: '3 days ago', eta: '-' },
  ]

  const savedSuppliers = [
    { id: 1, name: 'Emmanuel A.', location: 'Ho', products: 12, rating: 4.8, reliability: 98 },
    { id: 2, name: 'Grace K.', location: 'Anloga', products: 8, rating: 4.9, reliability: 99 },
    { id: 3, name: 'Kofi M.', location: 'Keta', products: 15, rating: 4.7, reliability: 95 },
  ]

  const deliveries = [
    { id: 1, order: '#2846', from: 'Ho', to: 'Keta', status: 'in_transit', progress: 65, driver: 'Kofi Mensah', eta: 'Tomorrow' },
    { id: 2, order: '#2847', from: 'Anloga', to: 'Ho', status: 'preparing', progress: 25, driver: 'Pending', eta: '2 days' },
  ]

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(160deg, #eef2ff 0%, #fef7f0 100%)' }}>
      {/* Buyer Identity Header */}
      <header className="sticky top-0 z-50 px-6 py-4" style={{ background: 'linear-gradient(135deg, #312e81 0%, #4338ca 60%, #6366f1 100%)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Marketplace</h1>
              <p className="text-xs text-indigo-200">Buyer Portal</p>
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
      <div className="px-6 py-4 overflow-x-auto bg-white/60 border-b border-indigo-100">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-white shadow-md'
                  : 'bg-white text-earth-600 hover:bg-indigo-50'
              }`}
              style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #312e81, #6366f1)' } : {}}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="px-6 py-6 max-w-7xl mx-auto">
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
              <input
                type="text"
                placeholder="Search produce, farmers, or locations..."
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-earth-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent shadow-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <FilterButton label="All" active />
              <FilterButton label="Vegetables" />
              <FilterButton label="Root Crops" />
              <FilterButton label="Fruits" />
              <FilterButton label="Grains" />
            </div>

            {/* Marketplace Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rankedItems.map((item) => (
                <MarketplaceCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-earth-900">My Orders</h2>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl font-medium hover:bg-earth-100 transition-colors">
                  <Filter className="w-5 h-5" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {orders.map((order) => (
                <BuyerOrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-earth-900">Saved Suppliers</h2>
            
            <div className="grid gap-4">
              {savedSuppliers.map((supplier) => (
                <SupplierCard key={supplier.id} supplier={supplier} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-earth-900">Delivery Tracking</h2>
            
            <div className="grid gap-4">
              {deliveries.map((delivery) => (
                <DeliveryCard key={delivery.id} delivery={delivery} />
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
              <h3 className="text-lg font-semibold text-earth-900 mb-4">Supply Forecast</h3>
              <p className="text-earth-600 mb-4">AI predicts increased cassava supply from Ho region next week.</p>
              <div className="flex items-center gap-2 text-forest-600">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">25% increase expected</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Buyer Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-indigo-100 px-6 py-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-around">
          <NavItem icon={<ShoppingBag className="w-6 h-6" />} label="Market" active={activeTab === 'marketplace'} color="#4338ca" onClick={() => setActiveTab('marketplace')} />
          <NavItem icon={<Package className="w-6 h-6" />} label="Orders" active={activeTab === 'orders'} color="#4338ca" onClick={() => setActiveTab('orders')} />
          <NavItem icon={<Truck className="w-6 h-6" />} label="Delivery" active={activeTab === 'delivery'} color="#4338ca" onClick={() => setActiveTab('delivery')} />
          <NavItem icon={<Heart className="w-6 h-6" />} label="Saved" active={activeTab === 'saved'} color="#4338ca" onClick={() => setActiveTab('saved')} />
        </div>
      </nav>
    </div>
  )
}

function FilterButton({ label, active }) {
  return (
    <button className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
      active ? 'bg-terracotta-600 text-white' : 'bg-white text-earth-600 hover:bg-earth-100'
    }`}>
      {label}
    </button>
  )
}

function MarketplaceCard({ item }) {
  return (
    <div className="glass rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300">
      {/* Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-terracotta-100 to-forest-100 flex items-center justify-center">
        <Package className="w-16 h-16 text-terracotta-400" />
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-earth-900">{item.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-sm text-earth-600">{item.farmer}</span>
              <VerificationBadge status={item.verification_status} role="farmer" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
            <span className="text-sm font-medium text-earth-900">{item.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-earth-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{item.location}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-earth-500">Available</p>
            <p className="font-semibold text-earth-900">{item.quantity}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-earth-500">Price</p>
            <p className="text-xl font-bold text-terracotta-600">{item.price}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-2 bg-earth-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-forest-500 to-forest-600 rounded-full"
              style={{ width: `${item.freshness}%` }}
            />
          </div>
          <span className="text-sm font-medium text-forest-600">{item.freshness}% fresh</span>
        </div>

        <button className="w-full px-4 py-3 bg-terracotta-600 text-white rounded-xl font-medium hover:bg-terracotta-700 transition-colors flex items-center justify-center gap-2">
          <span>Add to Order</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function BuyerOrderCard({ order }) {
  const statusColors = {
    processing: 'bg-gold-100 text-gold-700',
    shipped: 'bg-terracotta-100 text-terracotta-700',
    delivered: 'bg-forest-100 text-forest-700',
  }

  const statusIcons = {
    processing: <Clock className="w-4 h-4" />,
    shipped: <Truck className="w-4 h-4" />,
    delivered: <CheckCircle className="w-4 h-4" />,
  }

  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-earth-500 mb-1">Order #{order.id}</p>
          <p className="text-lg font-bold text-earth-900">{order.items}</p>
        </div>
        <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
          {statusIcons[order.status]}
          <span>{order.status}</span>
        </span>
      </div>
      
      <div className="flex items-end justify-between mb-4">
        <p className="text-sm text-earth-500">{order.date}</p>
        <p className="text-xl font-bold text-earth-900">{order.amount}</p>
      </div>

      <div className="flex items-center gap-2 text-sm text-earth-600">
        <Clock className="w-4 h-4" />
        <span>ETA: {order.eta}</span>
      </div>
    </div>
  )
}

function SupplierCard({ supplier }) {
  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-earth-900">{supplier.name}</h3>
          <div className="flex items-center gap-2 text-sm text-earth-600">
            <MapPin className="w-4 h-4" />
            <span>{supplier.location}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
          <span className="text-sm font-medium text-earth-900">{supplier.rating}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-earth-500 mb-1">Products</p>
          <p className="font-semibold text-earth-900">{supplier.products}</p>
        </div>
        <div>
          <p className="text-xs text-earth-500 mb-1">Reliability</p>
          <p className="font-semibold text-forest-600">{supplier.reliability}%</p>
        </div>
      </div>

      <button className="flex-1 px-4 py-2 bg-white text-earth-900 rounded-xl font-medium hover:bg-earth-100 transition-colors border border-earth-200 flex items-center justify-center gap-2">
        <span>View Products</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

function DeliveryCard({ delivery }) {
  const statusColors = {
    preparing: 'bg-gold-100 text-gold-700',
    in_transit: 'bg-terracotta-100 text-terracotta-700',
    delivered: 'bg-forest-100 text-forest-700',
  }

  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-earth-500 mb-1">Order {delivery.order}</p>
          <div className="flex items-center gap-2 text-earth-900 font-semibold">
            <MapPin className="w-4 h-4 text-terracotta-600" />
            <span>{delivery.from}</span>
            <ChevronRight className="w-4 h-4" />
            <span>{delivery.to}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[delivery.status]}`}>
          {delivery.status.replace('_', ' ')}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-earth-600">Progress</span>
          <span className="text-sm font-medium text-earth-900">{delivery.progress}%</span>
        </div>
        <div className="h-2 bg-earth-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-terracotta-500 to-forest-500 rounded-full transition-all duration-500"
            style={{ width: `${delivery.progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-earth-600">
          <Truck className="w-4 h-4" />
          <span>{delivery.driver}</span>
        </div>
        <div className="flex items-center gap-2 text-earth-600">
          <Clock className="w-4 h-4" />
          <span>ETA: {delivery.eta}</span>
        </div>
      </div>
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
