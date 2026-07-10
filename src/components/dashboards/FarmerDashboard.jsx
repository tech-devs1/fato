import React, { useState, useEffect } from 'react'
import {
  Sprout, Package, Truck, TrendingUp, Heart, Settings, Plus, Search,
  Filter, ChevronRight, AlertCircle, CheckCircle, Clock, Thermometer,
  Droplets, Bell, Navigation, X, Loader2
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import ReputationCard from '../reputation/ReputationCard'
import MapboxView from '../MapboxView'
import SettingsDropdown from './SettingsDropdown'
import { useToast } from '../ui/Toast'
import ChatModal from '../chat/ChatModal'

export default function FarmerDashboard({ onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview')
  const { userFullProfile, userProfile, logOut } = useAuth()
  const { toast } = useToast()
  const [startLoc, setStartLoc] = useState('ho')
  const [endLoc, setEndLoc] = useState('keta')
  const [routeInfo, setRouteInfo] = useState(null)
  
  // Produce modal state
  const [produceModalMode, setProduceModalMode] = useState(null) // null | 'add' | 'edit'
  const [selectedProduce, setSelectedProduce] = useState(null)
  
  // Transport request state
  const [showTransportModal, setShowTransportModal] = useState(false)
  
  // Chat modal state
  const [chatRecipient, setChatRecipient] = useState(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const mockProfile = {}

  const profile = {
    user: {
      displayName: userProfile?.displayName || userFullProfile?.user?.displayName || mockProfile.user.displayName,
      email: userProfile?.email || userFullProfile?.user?.email || null,
      phone: userProfile?.phone || userFullProfile?.user?.phone || null,
    },
    verification: userFullProfile?.verification || {
      phone_verified: !!userProfile?.phone,
      email_verified: !!userProfile?.email,
      national_id_verified: false,
      location_verified: true
    },
    reputation: userFullProfile?.reputation || {
      completed_transactions: 0,
      successful_transactions: 0,
      average_rating: 5.0,
      response_rate: 1.0,
      reputation_level: 'New Member'
    },
    roleProfile: userFullProfile?.roleProfile || {
      farm_name: userProfile?.displayName ? `${userProfile.displayName}'s Farm` : mockProfile.roleProfile.farm_name,
      verification_status: 'New Farmer',
      completed_orders: 0,
      average_rating: 5.0,
      response_rate: 1.0,
      joined_date: new Date().toISOString()
    }
  }
  const displayName = profile.user?.displayName || 'Emmanuel'

  async function handleLogout() {
    await logOut()
    if (onLogout) onLogout()
  }

  const tabs = [
    { id: 'overview',  label: 'Overview',     icon: <Sprout className="w-5 h-5" /> },
    { id: 'produce',   label: 'My Produce',   icon: <Package className="w-5 h-5" /> },
    { id: 'orders',    label: 'Orders',        icon: <CheckCircle className="w-5 h-5" /> },
    { id: 'transport', label: 'Transport',     icon: <Truck className="w-5 h-5" /> },
    { id: 'insights',  label: 'Insights',      icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'health',    label: 'Post-Harvest',  icon: <Heart className="w-5 h-5" /> },
  ]

  const [myProduce, setMyProduce] = useState([
    { id: 1, name: 'Fresh Cassava', quantity: '500 kg', price: '₵2.50/kg', status: 'listed', freshness: 95, location: 'Ho' },
    { id: 2, name: 'Red Tomatoes',  quantity: '200 kg', price: '₵4.20/kg', status: 'listed', freshness: 88, location: 'Anloga' },
  ])

  function handleSaveProduce(newItem) {
    if (produceModalMode === 'edit') {
      setMyProduce(prev => prev.map(p => p.id === selectedProduce.id ? { ...p, ...newItem } : p))
      toast(`${newItem.name} updated successfully!`, 'success')
    } else {
      setMyProduce(prev => [{ id: Date.now(), ...newItem, status: 'listed' }, ...prev])
      toast(`${newItem.name} added to listings!`, 'success')
    }
    setProduceModalMode(null)
    setSelectedProduce(null)
    setActiveTab('produce')
  }

  const [orders, setOrders] = useState([
    { id: 2847, buyer: 'Keta Market Co.', items: 'Cassava 200kg',   amount: '₵500',   status: 'confirmed',  date: 'Today' },
    { id: 2846, buyer: 'Ho Foods Ltd',    items: 'Tomatoes 150kg',  amount: '₵630',   status: 'delivering', date: 'Yesterday' },
    { id: 2845, buyer: 'Anloga Export',   items: 'Maize 400kg',     amount: '₵1,240', status: 'completed',  date: '2 days ago' },
  ])

  const [orderFilter, setOrderFilter] = useState('all')
  const filteredOrders = orderFilter === 'all' ? orders : orders.filter(o => o.status === orderFilter)

  const [transportRequests, setTransportRequests] = useState([
    { id: 1, from: 'Ho',     to: 'Keta', cargo: 'Cassava 200kg', status: 'matched', driver: 'Kofi Mensah' },
    { id: 2, from: 'Anloga', to: 'Ho',   cargo: 'Maize 300kg',   status: 'pending', driver: null },
  ])
  const postHarvestHealth = [
    { produce: 'Cassava',  freshness: 95, spoilageRisk: 'low',    storageTemp: '25°C', humidity: '65%', recommendation: 'Optimal' },
    { produce: 'Tomatoes', freshness: 88, spoilageRisk: 'medium', storageTemp: '22°C', humidity: '70%', recommendation: 'Sell within 3 days' },
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
            <SettingsDropdown onLogout={handleLogout} />
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
              <StatCard label="Active Orders" value="3"        change="+1"   icon={<CheckCircle />} color="forest" />
              <StatCard label="Revenue"       value="₵2,370"  change="+18%" icon={<TrendingUp />} color="gold" />
              <StatCard label="Avg Freshness" value="92%"     change="+2%"  icon={<Heart />} color="earth" />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickAction icon={<Plus />}      label="Add Produce"       color="terracotta" onClick={() => setProduceModalMode('add')} />
              <QuickAction icon={<Truck />}     label="Request Transport" color="forest"    onClick={() => setActiveTab('transport')} />
              <QuickAction icon={<Search />}    label="Find Buyers"       color="gold"      onClick={() => setActiveTab('insights')} />
              <QuickAction icon={<TrendingUp />} label="View Prices"      color="earth"     onClick={() => setActiveTab('insights')} />
            </div>

            {/* Recent Activity */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-earth-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <ActivityItem message="Order #2847 confirmed by Keta Market Co." time="2 hours ago" type="success" />
                <ActivityItem message="Cassava freshness updated to 95%"         time="4 hours ago" type="info" />
                <ActivityItem message="Transport request matched with Kofi Mensah" time="6 hours ago" type="success" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'produce' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-earth-900">My Produce</h2>
              <button onClick={() => setProduceModalMode('add')} className="flex items-center gap-2 px-4 py-2 bg-terracotta-600 text-white rounded-xl font-medium hover:bg-terracotta-700 transition-colors">
                <Plus className="w-5 h-5" />
                <span>Add Produce</span>
              </button>
            </div>

            <div className="grid gap-4">
              {myProduce.map((produce) => (
                <ProduceCard key={produce.id} produce={produce} onDelete={(id) => setMyProduce(prev => prev.filter(p => p.id !== id))} onEdit={(p) => { setSelectedProduce(p); setProduceModalMode('edit') }} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-earth-900">Orders</h2>
              <div className="flex gap-2">
                {['all', 'confirmed', 'delivering', 'completed'].map(f => (
                  <button key={f} onClick={() => setOrderFilter(f)} className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    orderFilter === f ? 'bg-forest-600 text-white' : 'bg-white text-earth-600 hover:bg-earth-100 border border-earth-200'
                  }`}>
                    {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} onUpdateStatus={(id, newStatus) => {
                  setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o))
                  toast(`Order #${id} marked as ${newStatus}!`, 'success')
                }} onContact={(recipient) => {
                  setChatRecipient(recipient)
                  setIsChatOpen(true)
                }} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transport' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-earth-900">Transport & Cost Estimator</h2>
              <button onClick={() => setShowTransportModal(true)} className="flex items-center gap-2 px-4 py-2 bg-terracotta-600 text-white rounded-xl font-medium hover:bg-terracotta-700 transition-colors">
                <Plus className="w-5 h-5" />
                <span>New Request</span>
              </button>
            </div>

            {/* Map & Pricing Estimator Card */}
            <div className="glass rounded-3xl p-6 grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-bold text-earth-900 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-terracotta-600 animate-pulse" />
                  <span>Cost Calculator</span>
                </h3>
                <p className="text-xs text-earth-500">
                  Select your pickup and delivery hubs to get a live dynamic quote based on actual Mapbox driving distance.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-earth-500 mb-1.5">Pickup Hub</label>
                  <select
                    value={startLoc}
                    onChange={(e) => setStartLoc(e.target.value)}
                    className="w-full px-4 py-3 bg-earth-50 rounded-xl border border-earth-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-earth-800 font-medium"
                  >
                    <option value="ho">Ho (Hub)</option>
                    <option value="keta">Keta (Coast)</option>
                    <option value="anloga">Anloga (Farming)</option>
                    <option value="sogakope">Sogakope (Transit)</option>
                    <option value="accra">Accra (Capital)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-earth-500 mb-1.5">Delivery Hub</label>
                  <select
                    value={endLoc}
                    onChange={(e) => setEndLoc(e.target.value)}
                    className="w-full px-4 py-3 bg-earth-50 rounded-xl border border-earth-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-earth-800 font-medium"
                  >
                    <option value="keta">Keta (Coast)</option>
                    <option value="ho">Ho (Hub)</option>
                    <option value="anloga">Anloga (Farming)</option>
                    <option value="sogakope">Sogakope (Transit)</option>
                    <option value="accra">Accra (Capital)</option>
                  </select>
                </div>

                {routeInfo && (
                  <div className="p-4 bg-forest-50 border border-forest-100 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">Dynamic Shipping Quote</span>
                      <span className="text-[10px] bg-forest-100 text-forest-700 font-semibold px-2 py-0.5 rounded-full">Guaranteed</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-earth-900 text-xs">
                      <div>Distance: <span className="font-bold">{routeInfo.distance}</span></div>
                      <div>Duration: <span className="font-bold">{routeInfo.duration}</span></div>
                    </div>
                    <div className="pt-2 border-t border-forest-100/50 flex justify-between items-end">
                      <span className="text-xs text-earth-500 font-medium">Estimated Delivery Fee:</span>
                      <span className="text-xl font-bold text-terracotta-600">
                        ₵{(10 + routeInfo.distanceValue * 2.5).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-3 h-[300px] min-h-[300px] rounded-2xl overflow-hidden border border-earth-200 shadow-inner">
                <MapboxView
                  startLocation={startLoc}
                  endLocation={endLoc}
                  onRouteCalculated={(info) => setRouteInfo(info)}
                  className="h-full w-full"
                />
              </div>
            </div>

            <h3 className="text-xl font-bold text-earth-900 pt-4">Recent Transport Logs</h3>
            <div className="grid gap-4">
              {transportRequests.map((request) => (
                <TransportCard
                  key={request.id}
                  request={request}
                  onCancel={(id) => {
                    setTransportRequests(prev => prev.filter(r => r.id !== id))
                    toast('Transport request cancelled.', 'error')
                  }}
                  onContact={(recipient) => {
                    setChatRecipient(recipient)
                    setIsChatOpen(true)
                  }}
                />
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
                <PriceTrend product="Tomatoes" current="₵4.20/kg" trend="+8%"  status="up" />
                <PriceTrend product="Maize"    current="₵3.10/kg" trend="-3%"  status="down" />
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
          <NavItem icon={<Sprout className="w-6 h-6" />}       label="Dashboard" active={activeTab === 'overview'}   color="#2d6a4f" onClick={() => setActiveTab('overview')} />
          <NavItem icon={<Package className="w-6 h-6" />}      label="Produce"   active={activeTab === 'produce'}    color="#2d6a4f" onClick={() => setActiveTab('produce')} />
          <NavItem icon={<CheckCircle className="w-6 h-6" />}  label="Orders"    active={activeTab === 'orders'}     color="#2d6a4f" onClick={() => setActiveTab('orders')} />
          <NavItem icon={<Heart className="w-6 h-6" />}        label="Health"    active={activeTab === 'health'}     color="#2d6a4f" onClick={() => setActiveTab('health')} />
        </div>
      </nav>
      {/* Add/Edit Produce Modal */}
      {produceModalMode && (
        <AddProduceModal
          mode={produceModalMode}
          produce={selectedProduce}
          onClose={() => { setProduceModalMode(null); setSelectedProduce(null) }}
          onSave={handleSaveProduce}
        />
      )}

      {/* Transport Request Modal */}
      {showTransportModal && (
        <TransportRequestModal
          startLoc={startLoc}
          endLoc={endLoc}
          produceList={myProduce}
          onClose={() => setShowTransportModal(false)}
          onSubmit={(req) => {
            setTransportRequests(prev => [
              {
                id: Date.now(),
                from: req.from,
                to: req.to,
                cargo: `${req.produceName} ${req.quantity}`,
                status: 'pending',
                driver: null
              },
              ...prev
            ])
            setShowTransportModal(false)
            toast('Transport request submitted successfully! Matching with drivers...', 'success')
          }}
        />
      )}
      
      {/* In-App Chat Modal */}
      {isChatOpen && chatRecipient && (
        <ChatModal
          isOpen={isChatOpen}
          recipient={chatRecipient}
          onClose={() => {
            setIsChatOpen(false)
            setChatRecipient(null)
          }}
        />
      )}    </div>
  )
}

function StatCard({ label, value, change, icon, color }) {
  const colorClasses = {
    terracotta: 'from-terracotta-500 to-terracotta-600 bg-terracotta-50',
    forest:     'from-forest-500 to-forest-600 bg-forest-50',
    gold:       'from-gold-500 to-gold-600 bg-gold-50',
    earth:      'from-earth-500 to-earth-600 bg-earth-50',
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

function QuickAction({ icon, label, color, onClick }) {
  const colorClasses = {
    terracotta: 'bg-terracotta-50 text-terracotta-600 hover:bg-terracotta-100',
    forest:     'bg-forest-50 text-forest-600 hover:bg-forest-100',
    gold:       'bg-gold-50 text-gold-600 hover:bg-gold-100',
    earth:      'bg-earth-50 text-earth-600 hover:bg-earth-100',
  }

  return (
    <button onClick={onClick} className={`glass rounded-2xl p-6 flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 ${colorClasses[color]}`}>
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  )
}

function ActivityItem({ message, time, type }) {
  const typeColors = {
    success: 'bg-forest-100 text-forest-600',
    info:    'bg-gold-100 text-gold-600',
    warning: 'bg-sunset-100 text-sunset-600',
  }

  const typeIcons = {
    success: <CheckCircle className="w-4 h-4" />,
    info:    <Clock className="w-4 h-4" />,
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

function ProduceCard({ produce, onDelete, onEdit }) {
  const { toast } = useToast();
  const statusColors = {
    listed:  'bg-forest-100 text-forest-700',
    pending: 'bg-gold-100 text-gold-700',
    sold:    'bg-earth-100 text-earth-700',
  };

  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
      {/* Image */}
      {produce.image && (
        <img src={URL.createObjectURL(produce.image)} alt={produce.name} className="w-full h-40 object-cover rounded mb-4" />
      )}
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
        <button
          onClick={() => onEdit(produce)}
          className="flex-1 px-4 py-2 bg-terracotta-600 text-white rounded-xl font-medium hover:bg-terracotta-700 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => { onDelete(produce.id); toast(`${produce.name} removed from listings.`, 'error'); }}
          className="flex-1 px-4 py-2 bg-white text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors border border-red-200"
        >
          Remove
        </button>
      </div>
    </div>
  );
}




function OrderCard({ order, onUpdateStatus, onContact }) {
  const { toast } = useToast()
  const statusColors = {
    confirmed:  'bg-forest-100 text-forest-700',
    delivering: 'bg-gold-100 text-gold-700',
    completed:  'bg-earth-100 text-earth-700',
  }
  const nextStatus = {
    confirmed: 'delivering',
    delivering: 'completed',
  }
  const nextLabel = {
    confirmed: 'Mark Dispatched',
    delivering: 'Mark Delivered',
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
      <div className="flex items-end justify-between mb-4">
        <p className="text-xs text-earth-500">{order.date}</p>
        <p className="text-xl font-bold text-earth-900">{order.amount}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onContact({ name: order.buyer, role: 'buyer', phone: '+233245678901' })}
          className="flex-1 px-3 py-2 bg-white border border-earth-200 text-earth-700 rounded-xl text-sm font-medium hover:bg-earth-50 transition-colors"
        >
          Contact Buyer
        </button>
        {order.status !== 'completed' && (
          <button
            onClick={() => onUpdateStatus(order.id, nextStatus[order.status])}
            className="flex-1 px-3 py-2 bg-forest-600 text-white rounded-xl text-sm font-medium hover:bg-forest-700 transition-colors"
          >
            {nextLabel[order.status]}
          </button>
        )}
      </div>
    </div>
  )
}

function TransportCard({ request, onCancel, onContact }) {
  const { toast } = useToast()
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-earth-600">
            <CheckCircle className="w-4 h-4 text-forest-600" />
            <span className="text-sm">Driver: {request.driver}</span>
          </div>
          <button
            onClick={() => onContact({ name: request.driver, role: 'transport', phone: '+233242233445' })}
            className="px-3 py-1.5 bg-forest-100 text-forest-700 rounded-lg text-xs font-medium hover:bg-forest-200 transition-colors"
          >
            Contact Driver
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-earth-600">
            <Clock className="w-4 h-4 text-gold-600" />
            <span className="text-sm">Searching for driver...</span>
          </div>
          <button
            onClick={() => onCancel(request.id)}
            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
          >
            Cancel
          </button>
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
    low:    'bg-forest-100 text-forest-700',
    medium: 'bg-gold-100 text-gold-700',
    high:   'bg-sunset-100 text-sunset-700',
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

// ── Error Banner ──────────────────────────────────────────────────────────────
function ErrorBanner({ msg }) {
  if (!msg) return null
  return (
    <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{msg}</span>
    </div>
  )
}

// ── Add/Edit Produce Modal ────────────────────────────────────────────────────────
function AddProduceModal({ mode, produce, onClose, onSave }) {
  const [name, setName]           = useState('');
  const [quantity, setQuantity]   = useState('');
  const [unit, setUnit]           = useState('kg');
  const [price, setPrice]         = useState('');
  const [location, setLocation]   = useState('Ho');
  const [freshness, setFreshness] = useState(90);
  const [busy, setBusy]           = useState(false);
  const [error, setError]         = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (mode === 'edit' && produce) {
      setName(produce.name);
      const qtyNum = parseInt(produce.quantity) || '';
      const qtyUnit = produce.quantity.split(' ')[1] || 'kg';
      setQuantity(qtyNum);
      setUnit(qtyUnit);
      const priceNum = produce.price.replace(/[^\\d.]/g, '') || '';
      setPrice(priceNum);
      setLocation(produce.location || 'Ho');
      setFreshness(produce.freshness || 90);
      setImageFile(produce.image || null);
    }
  }, [mode, produce]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!imageFile) {
      setError('Please upload an image of the produce.');
      return;
    }
    setBusy(true);
    setError('');
    // Simulate async save
    setTimeout(() => {
      onSave({
        name,
        quantity: `${quantity} ${unit}`,
        price: `₵${price}/${unit}`,
        freshness: Number(freshness),
        location,
        image: imageFile,
      });
      setBusy(false);
    }, 600);
  }

  return (
    <div className="fixed inset-0 bg-earth-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-earth-100 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #2d6a4f, #52b788)' }}>
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>{mode === 'edit' ? 'Edit Produce Item' : 'Add New Produce'}</span>
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Banner */}
          {error && <ErrorBanner msg={error} />}
          {/* Produce Name */}
          <div>
            <label className="block text-sm font-semibold text-earth-700 mb-1">Produce Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Cassava, Tomatoes, Maize"
              className="w-full px-4 py-3 rounded-xl border border-earth-200 focus:outline-none focus:ring-2 focus:ring-forest-500 text-earth-900"
              required
            />
          </div>

          {/* Quantity + Unit */}
          <div>
            <label className="block text-sm font-semibold text-earth-700 mb-1">Quantity</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="e.g. 500"
                min="1"
                className="flex-1 px-4 py-3 rounded-xl border border-earth-200 focus:outline-none focus:ring-2 focus:ring-forest-500 text-earth-900"
                required
              />
              <select
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="px-3 py-2 rounded-xl border border-earth-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-earth-700 mb-1">Price per Unit</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="e.g. 2.5"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 rounded-xl border border-earth-200 focus:outline-none focus:ring-2 focus:ring-forest-500 text-earth-900"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-earth-700 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Ho"
              className="w-full px-4 py-3 rounded-xl border border-earth-200 focus:outline-none focus:ring-2 focus:ring-forest-500 text-earth-900"
              required
            />
          </div>

          {/* Freshness */}
          <div>
            <label className="block text-sm font-semibold text-earth-700 mb-1">Freshness (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={freshness}
              onChange={e => setFreshness(e.target.value)}
              className="w-full"
            />
            <div className="text-sm text-earth-500 text-center mt-1">{freshness}%</div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-earth-700 mb-1">Produce Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImageFile(e.target.files[0] || null)}
              className="w-full text-earth-500"
            />
            {imageFile && (
              <div className="mt-2">
                <img src={URL.createObjectURL(imageFile)} alt="Produce" className="max-h-32 rounded" />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 bg-terracotta-600 text-white rounded-xl font-medium hover:bg-terracotta-700 transition-colors disabled:opacity-60"
          >
            {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'edit' ? 'Update Produce' : 'Add Produce')}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Transport Request Modal ──────────────────────────────────────────────────
function TransportRequestModal({ startLoc, endLoc, produceList, onClose, onSubmit }) {
  const [from, setFrom] = useState(startLoc.toUpperCase())
  const [to, setTo] = useState(endLoc.toUpperCase())
  const [selectedProduceId, setSelectedProduceId] = useState(produceList[0]?.id || '')
  const [quantity, setQuantity] = useState('200 kg')
  const [busy, setBusy] = useState(false)

  const selectedProduce = produceList.find(p => p.id === Number(selectedProduceId))
  const produceName = selectedProduce ? selectedProduce.name : 'Cassava'

  useEffect(() => {
    if (selectedProduce) {
      setQuantity(selectedProduce.quantity)
    }
  }, [selectedProduceId])

  function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setTimeout(() => {
      onSubmit({
        from,
        to,
        produceName,
        quantity
      })
      setBusy(false)
    }, 600)
  }

  return (
    <div className="fixed inset-0 bg-earth-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-earth-100 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #2d6a4f, #52b788)' }}>
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Truck className="w-5 h-5" />
            <span>New Transport Request</span>
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-earth-800">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-earth-700 mb-1">Pickup Hub</label>
              <select
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-earth-200 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
              >
                <option value="HO">Ho</option>
                <option value="KETA">Keta</option>
                <option value="ANLOGA">Anloga</option>
                <option value="SOGAKOPE">Sogakope</option>
                <option value="ACCRA">Accra</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-earth-700 mb-1">Delivery Hub</label>
              <select
                value={to}
                onChange={e => setTo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-earth-200 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
              >
                <option value="HO">Ho</option>
                <option value="KETA">Keta</option>
                <option value="ANLOGA">Anloga</option>
                <option value="SOGAKOPE">Sogakope</option>
                <option value="ACCRA">Accra</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-earth-700 mb-1">Select Produce to Ship</label>
            <select
              value={selectedProduceId}
              onChange={e => setSelectedProduceId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-earth-200 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
              required
            >
              <option value="" disabled>-- Select Produce --</option>
              {produceList.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.quantity} available)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-earth-700 mb-1">Shipment Quantity</label>
            <input
              type="text"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              placeholder="e.g. 200 kg"
              className="w-full px-4 py-3 rounded-xl border border-earth-200 focus:outline-none focus:ring-2 focus:ring-forest-500 text-earth-900"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-earth-200 rounded-xl text-earth-700 font-semibold hover:bg-earth-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex-1 py-3 bg-gradient-to-r from-forest-600 to-forest-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Truck className="w-4 h-4" /> Request</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

