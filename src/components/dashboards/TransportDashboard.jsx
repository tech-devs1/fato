import React, { useState } from 'react'
import { Truck, MapPin, DollarSign, Clock, CheckCircle, AlertCircle, Settings, Route, Fuel, Wrench, Calendar, ChevronRight, Navigation, ShoppingBag, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import ReputationCard from '../reputation/ReputationCard'
import MapboxView from '../MapboxView'
import SettingsDropdown from './SettingsDropdown'
import { useToast } from '../ui/Toast'
import ChatModal from '../chat/ChatModal'

export default function TransportDashboard({ onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('jobs')
  const { userFullProfile, userProfile, logOut } = useAuth()
  const { toast } = useToast()

  const [startLoc, setStartLoc] = useState('ho')
  const [endLoc, setEndLoc] = useState('keta')
  const [activeNavigationJob, setActiveNavigationJob] = useState(null)
  const [customRouteInfo, setCustomRouteInfo] = useState(null)
  
  // Chat modal state
  const [chatRecipient, setChatRecipient] = useState(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const mockProfile = {
    user: { displayName: 'Kofi Mensah' },
    verification: {
      phone_verified: true,
      email_verified: true,
      national_id_verified: true,
      location_verified: true,
      vehicle_verified: true
    },
    reputation: {
      completed_transactions: 25,
      successful_transactions: 24,
      average_rating: 4.85,
      response_rate: 0.96,
      reputation_level: 'Trusted Member'
    },
    roleProfile: {
      vehicle_type: 'Light Truck',
      vehicle_capacity: '2 tons',
      verification_status: 'Reliable Transporter',
      completed_deliveries: 25,
      average_rating: 4.85,
      on_time_delivery_rate: 0.94,
      joined_date: '2024-02-15T10:30:00Z'
    }
  }

  const profile = {
    user: {
      displayName: userProfile?.displayName || userFullProfile?.user?.displayName || mockProfile.user.displayName,
      email: userProfile?.email || userFullProfile?.user?.email || null,
      phone: userProfile?.phone || userFullProfile?.user?.phone || null,
    },
    verification: userFullProfile?.verification || mockProfile.verification,
    reputation: userFullProfile?.reputation || mockProfile.reputation,
    roleProfile: userFullProfile?.roleProfile || mockProfile.roleProfile
  }
  const displayName = profile.user?.displayName || 'Kofi'

  async function handleLogout() {
    await logOut()
    if (onLogout) onLogout()
  }

  const tabs = [
    { id: 'jobs', label: 'Available Jobs', icon: <Truck className="w-5 h-5" /> },
    { id: 'deliveries', label: 'Deliveries', icon: <Navigation className="w-5 h-5" /> },
    { id: 'routes', label: 'Routes', icon: <Route className="w-5 h-5" /> },
    { id: 'revenue', label: 'Revenue', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'vehicle', label: 'Vehicle', icon: <Wrench className="w-5 h-5" /> },
  ]

  const [jobs, setJobs] = useState([
    { id: 1, from: 'Ho', to: 'Keta', cargo: 'Cassava 200kg', payout: '₵350', status: 'available' },
    { id: 2, from: 'Anloga', to: 'Ho', cargo: 'Maize 300kg', payout: '₵400', status: 'available' },
  ])

  const [deliveries, setDeliveries] = useState([
    { id: 1, order: '#2846', from: 'Anloga', to: 'Ho', cargo: 'Tomatoes 150kg', progress: 40, status: 'in_transit', eta: '1 hour' },
  ])

  const handleAcceptJob = (job) => {
    setJobs(prev => prev.filter(j => j.id !== job.id))
    setDeliveries(prev => [
      {
        id: job.id,
        order: `#${Math.floor(Math.random() * 9000) + 1000}`,
        from: job.from,
        to: job.to,
        cargo: job.cargo,
        progress: 0,
        status: 'loading',
        eta: '3 hours'
      },
      ...prev
    ])
    toast('Job accepted! Head to Deliveries tab.', 'success')
  }

  const routes = [
    { id: 1, name: 'Ho - Keta Highway', distance: '45 km', avgTime: '1h 15m', popularity: 92, condition: 'good' },
    { id: 2, name: 'Anloga - Ho Road', distance: '32 km', avgTime: '55m', popularity: 88, condition: 'good' },
    { id: 3, name: 'Keta - Anloga Route', distance: '28 km', avgTime: '45m', popularity: 75, condition: 'fair' },
  ]

  const revenueData = [
    { period: 'Today', earnings: '₵320', deliveries: 3 },
    { period: 'This Week', earnings: '₵1,840', deliveries: 18 },
    { period: 'This Month', earnings: '₵7,250', deliveries: 72 },
  ]

  const vehicleStatus = {
    plate: 'GV-4521-23',
    type: 'Light Truck',
    capacity: '2 tons',
    fuel: 75,
    condition: 'good',
    lastService: '2 weeks ago',
    nextService: 'in 2 weeks',
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(160deg, #fffbeb 0%, #fef3c7 40%, #fef7f0 100%)' }}>
      {/* Transporter Identity Header */}
      <header className="sticky top-0 z-50 px-6 py-4" style={{ background: 'linear-gradient(135deg, #92400e 0%, #b45309 60%, #d97706 100%)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Nunya AI Logo" 
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div>
              <h1 className="text-xl font-bold text-white">Fleet Hub</h1>
              <p className="text-xs text-amber-200">Transporter Portal</p>
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
      <div className="px-6 py-4 overflow-x-auto bg-white/60 border-b border-amber-100">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-white shadow-md'
                  : 'bg-white text-earth-600 hover:bg-amber-50'
              }`}
              style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #92400e, #d97706)' } : {}}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="px-6 py-6 max-w-7xl mx-auto">
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Reputation Card */}
            <ReputationCard profile={profile} role="transport" />

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Available Jobs" value={jobs.length.toString()} icon={<Truck />} color="terracotta" />
              <StatCard label="Avg Payment" value="₵137" icon={<DollarSign />} color="gold" />
              <StatCard label="Today's Earnings" value="₵320" icon={<DollarSign />} color="forest" />
              <StatCard label="Active Deliveries" value={deliveries.length.toString()} icon={<Navigation />} color="earth" />
            </div>

            {/* Available Jobs */}
            <div className="grid gap-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onNavigateRoute={setActiveNavigationJob}
                  onAccept={() => handleAcceptJob(job.id)}
                  onContact={(recipient) => {
                    setChatRecipient(recipient)
                    setIsChatOpen(true)
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'deliveries' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-earth-900">Current Deliveries</h2>
            
            <div className="grid gap-4">
              {deliveries.map((delivery) => (
                <DeliveryCard
                  key={delivery.id}
                  delivery={delivery}
                  setDeliveries={setDeliveries}
                  onContact={(recipient) => {
                    setChatRecipient(recipient)
                    setIsChatOpen(true)
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'routes' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-earth-900">Interactive Route Calculator</h2>
            
            {/* Interactive Search UI */}
            <div className="glass rounded-3xl p-6 grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-earth-500 mb-1.5">Start Location</label>
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
                  <label className="block text-xs font-semibold text-earth-500 mb-1.5">Destination</label>
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
                {customRouteInfo && (
                  <div className="p-4 bg-terracotta-50 rounded-xl border border-terracotta-100/50 space-y-2">
                    <p className="text-xs text-terracotta-600 font-semibold uppercase tracking-wider">Dynamic Mapbox Stats</p>
                    <div className="grid grid-cols-2 gap-2 text-earth-900 text-sm">
                      <div>Distance: <span className="font-bold">{customRouteInfo.distance}</span></div>
                      <div>ETA: <span className="font-bold text-forest-600">{customRouteInfo.duration}</span></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="lg:col-span-3 h-[300px] min-h-[300px] rounded-2xl overflow-hidden border border-earth-200 shadow-inner">
                <MapboxView
                  startLocation={startLoc}
                  endLocation={endLoc}
                  onRouteCalculated={(info) => setCustomRouteInfo(info)}
                  className="h-full w-full"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-earth-900 pt-4">Recommended Pre-set Routes</h2>
            
            <div className="space-y-4">
              {routes.map((route) => (
                <RouteCard 
                  key={route.id} 
                  route={route} 
                  onSelect={(r) => {
                    const parts = r.name.toLowerCase().split('-');
                    const s = parts[0]?.trim();
                    const e = parts[1]?.trim().split(' ')[0];
                    if (s) setStartLoc(s);
                    if (e) setEndLoc(e);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-earth-900">Revenue Overview</h2>
            
            <div className="grid gap-4">
              {revenueData.map((data, index) => (
                <RevenueCard key={index} data={data} />
              ))}
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-earth-900 mb-4">Earnings Trend</h3>
              <div className="h-48 bg-earth-50 rounded-xl flex items-center justify-center">
                <p className="text-earth-500">Chart visualization would go here</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vehicle' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-earth-900">Vehicle Status</h2>
            
            <VehicleCard vehicle={vehicleStatus} />
          </div>
        )}
      </main>

      {/* Transporter Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-amber-100 px-6 py-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-around">
          <NavItem icon={<Truck className="w-6 h-6" />} label="Jobs" active={activeTab === 'jobs'} color="#b45309" onClick={() => setActiveTab('jobs')} />
          <NavItem icon={<Navigation className="w-6 h-6" />} label="Deliveries" active={activeTab === 'deliveries'} color="#b45309" onClick={() => setActiveTab('deliveries')} />
          <NavItem icon={<Route className="w-6 h-6" />} label="Routes" active={activeTab === 'routes'} color="#b45309" onClick={() => setActiveTab('routes')} />
          <NavItem icon={<DollarSign className="w-6 h-6" />} label="Revenue" active={activeTab === 'revenue'} color="#b45309" onClick={() => setActiveTab('revenue')} />
        </div>
      </nav>

      {/* Navigation Modal overlay */}
      {activeNavigationJob && (
        <div className="fixed inset-0 bg-earth-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-lg w-full max-w-4xl h-[80vh] rounded-3xl overflow-hidden flex flex-col relative animate-scale-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-earth-100 flex items-center justify-between bg-white">
              <div>
                <h3 className="font-bold text-earth-900 text-lg flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-terracotta-600 animate-pulse" />
                  <span>Navigating Cargo Shipment</span>
                </h3>
                <p className="text-xs text-earth-500">
                  Route: {activeNavigationJob.from} → {activeNavigationJob.to} • Cargo: {activeNavigationJob.cargo} • Payment: {activeNavigationJob.payment}
                </p>
              </div>
              <button 
                onClick={() => setActiveNavigationJob(null)}
                className="p-2 rounded-xl hover:bg-earth-100 transition-colors"
              >
                <X className="w-6 h-6 text-earth-600" />
              </button>
            </div>
            
            {/* Modal Map Body */}
            <div className="flex-1 relative">
              <MapboxView
                startLocation={activeNavigationJob.from}
                endLocation={activeNavigationJob.to}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
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
      )}
    </div>
  )
}

function StatCard({ label, value, icon, color }) {
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
      <span className="text-2xl font-bold text-earth-900">{value}</span>
    </div>
  )
}

function JobCard({ job, onNavigateRoute, onAccept, onContact }) {
  const urgencyColors = {
    high: 'bg-sunset-100 text-sunset-700',
    medium: 'bg-gold-100 text-gold-700',
    low: 'bg-forest-100 text-forest-700',
  }

  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-terracotta-100 rounded-xl flex items-center justify-center">
            <Truck className="w-6 h-6 text-terracotta-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-earth-900 font-semibold">
              <MapPin className="w-4 h-4 text-terracotta-600" />
              <span>{job.from}</span>
              <ChevronRight className="w-4 h-4" />
              <span>{job.to}</span>
            </div>
            <p className="text-sm text-earth-500">{job.farmer}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${urgencyColors[job.urgency]}`}>
            {job.urgency}
          </span>
          <button
            onClick={() => onContact({ name: job.farmer, role: 'farmer', phone: '+233240123456' })}
            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg text-[10px] transition-colors"
          >
            Chat Farmer
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-earth-500 mb-1">Cargo</p>
          <p className="font-medium text-earth-900">{job.cargo}</p>
        </div>
        <div>
          <p className="text-xs text-earth-500 mb-1">Distance</p>
          <p className="font-medium text-earth-900">{job.distance}</p>
        </div>
        <div>
          <p className="text-xs text-earth-500 mb-1">Payment</p>
          <p className="font-bold text-terracotta-600">{job.payment}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => onNavigateRoute(job)}
          className="flex-1 px-4 py-3 bg-white border border-earth-200 text-earth-800 rounded-xl font-medium hover:bg-earth-50 transition-colors flex items-center justify-center gap-2"
        >
          <Navigation className="w-5 h-5 text-terracotta-600" />
          <span>View Route</span>
        </button>
        <button 
          onClick={onAccept}
          className="flex-1 px-4 py-3 bg-terracotta-600 text-white rounded-xl font-medium hover:bg-terracotta-700 transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Accept Job</span>
        </button>
      </div>
    </div>
  )
}

function DeliveryCard({ delivery, setDeliveries, onContact }) {
  const { toast } = useToast()
  const statusColors = {
    loading: 'bg-gold-100 text-gold-700',
    in_transit: 'bg-terracotta-100 text-terracotta-700',
    delivered: 'bg-forest-100 text-forest-700',
  }

  const statusIcons = {
    loading: <Clock className="w-4 h-4" />,
    in_transit: <Navigation className="w-4 h-4" />,
    delivered: <CheckCircle className="w-4 h-4" />,
  }

  const handleUpdateProgress = () => {
    setDeliveries(prev => prev.map(d => {
      if (d.id === delivery.id) {
        let newProgress = d.progress + 25
        let newStatus = d.status
        let newEta = d.eta

        if (newProgress >= 100) {
          newProgress = 100
          newStatus = 'delivered'
          newEta = '-'
          toast(`Delivery for order ${d.order} completed successfully! 🎉`, 'success')
        } else if (newProgress > 0) {
          newStatus = 'in_transit'
          newEta = '1 hour'
          toast(`Delivery progress updated to ${newProgress}%`, 'info')
        }
        return { ...d, progress: newProgress, status: newStatus, eta: newEta }
      }
      return d
    }))
  }

  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-earth-500 mb-1">{delivery.order}</p>
          <div className="flex items-center gap-2 text-earth-900 font-semibold">
            <MapPin className="w-4 h-4 text-terracotta-600" />
            <span>{delivery.from}</span>
            <ChevronRight className="w-4 h-4" />
            <span>{delivery.to}</span>
          </div>
        </div>
        <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusColors[delivery.status]}`}>
          {statusIcons[delivery.status]}
          <span>{delivery.status.replace('_', ' ')}</span>
        </span>
      </div>
      
      <p className="text-sm text-earth-600 mb-4">{delivery.cargo}</p>
      
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

      <div className="flex items-center justify-between text-sm text-earth-600 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>ETA: {delivery.eta}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onContact({ name: 'Client/Farmer (Emmanuel A.)', role: 'farmer', phone: '+233240123456' })}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors text-xs"
          >
            Chat
          </button>
          {delivery.status !== 'delivered' && (
            <button 
              onClick={handleUpdateProgress}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl transition-colors text-xs"
            >
              Update Progress
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function RouteCard({ route, onSelect }) {
  const conditionColors = {
    good: 'bg-forest-100 text-forest-700',
    fair: 'bg-gold-100 text-gold-700',
    poor: 'bg-sunset-100 text-sunset-700',
  }

  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-earth-900">{route.name}</h3>
          <div className="flex items-center gap-2 text-sm text-earth-600 mt-1">
            <Route className="w-4 h-4" />
            <span>{route.distance}</span>
            <span>•</span>
            <Clock className="w-4 h-4" />
            <span>{route.avgTime}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${conditionColors[route.condition]}`}>
          {route.condition}
        </span>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-earth-500 mb-1">Popularity</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 w-32 h-2 bg-earth-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-forest-500 to-forest-600 rounded-full"
                style={{ width: `${route.popularity}%` }}
              />
            </div>
            <span className="text-sm font-medium text-earth-900">{route.popularity}%</span>
          </div>
        </div>
        <button 
          onClick={() => onSelect && onSelect(route)}
          className="px-4 py-2 bg-terracotta-600 text-white rounded-xl font-medium hover:bg-terracotta-700 transition-colors flex items-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          <span>Navigate</span>
        </button>
      </div>
    </div>
  )
}

function RevenueCard({ data }) {
  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-earth-500 mb-1">{data.period}</p>
          <p className="text-2xl font-bold text-earth-900">{data.earnings}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-earth-500 mb-1">Deliveries</p>
          <p className="text-lg font-semibold text-forest-600">{data.deliveries}</p>
        </div>
      </div>
    </div>
  )
}

function VehicleCard({ vehicle }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-earth-900">{vehicle.plate}</h3>
          <p className="text-sm text-earth-500">{vehicle.type}</p>
        </div>
        <div className="px-4 py-2 bg-forest-100 text-forest-700 rounded-xl font-medium">
          {vehicle.condition}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-earth-50 rounded-xl">
          <p className="text-xs text-earth-500 mb-1">Capacity</p>
          <p className="font-semibold text-earth-900">{vehicle.capacity}</p>
        </div>
        <div className="p-4 bg-earth-50 rounded-xl">
          <p className="text-xs text-earth-500 mb-1">Last Service</p>
          <p className="font-semibold text-earth-900">{vehicle.lastService}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-terracotta-600" />
            <span className="text-sm text-earth-600">Fuel Level</span>
          </div>
          <span className="text-sm font-medium text-earth-900">{vehicle.fuel}%</span>
        </div>
        <div className="h-3 bg-earth-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-terracotta-500 to-gold-500 rounded-full transition-all duration-500"
            style={{ width: `${vehicle.fuel}%` }}
          />
        </div>
      </div>

      <div className="p-4 bg-gold-50 rounded-xl flex items-center gap-3">
        <Calendar className="w-5 h-5 text-gold-600" />
        <div>
          <p className="text-sm text-earth-600">Next Service</p>
          <p className="font-medium text-earth-900">{vehicle.nextService}</p>
        </div>
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
