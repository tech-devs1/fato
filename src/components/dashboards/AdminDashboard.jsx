import React, { useState } from 'react'
import { Users, Package, Truck, TrendingUp, BarChart3, Settings, AlertTriangle, CheckCircle, Clock, MapPin, ArrowUpRight, ArrowDownRight, Activity, Shield, FileText, Check, X, Phone, Mail, Award, Map } from 'lucide-react'
import { adminUpdateVerification } from '../../lib/reputationService'

export default function AdminDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview')

  const [usersPending, setUsersPending] = useState([
    {
      id: 'usr_1',
      name: 'Emmanuel A.',
      role: 'farmer',
      farmName: "Emmanuel's Organic Farm",
      verifications: {
        phone_verified: true,
        email_verified: true,
        national_id_verified: false,
        location_verified: true,
      }
    },
    {
      id: 'usr_2',
      name: 'Grace K.',
      role: 'farmer',
      farmName: "Grace's Cassava Hub",
      verifications: {
        phone_verified: true,
        email_verified: false,
        national_id_verified: false,
        location_verified: false,
      }
    },
    {
      id: 'usr_3',
      name: 'Kofi Mensah',
      role: 'transport',
      vehicleType: 'Light Truck',
      verifications: {
        phone_verified: true,
        email_verified: true,
        national_id_verified: true,
        location_verified: true,
        vehicle_verified: false,
      }
    },
    {
      id: 'usr_4',
      name: 'Keta Market Co.',
      role: 'buyer',
      businessName: 'Keta Market Co.',
      verifications: {
        phone_verified: true,
        email_verified: true,
        national_id_verified: false,
        location_verified: false,
      }
    }
  ])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" /> },
    { id: 'verifications', label: 'Verifications', icon: <Shield className="w-5 h-5" /> },

    { id: 'supply', label: 'Supply Chain', icon: <Truck className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> },
  ]

  const overviewStats = [
    { label: 'Total Users', value: '2,847', change: '+12%', icon: <Users />, color: 'terracotta' },
    { label: 'Active Listings', value: '1,247', change: '+8%', icon: <Package />, color: 'forest' },
    { label: 'Transport Jobs', value: '156', change: '+15%', icon: <Truck />, color: 'gold' },
    { label: 'Monthly Revenue', value: '₵45,230', change: '+22%', icon: <TrendingUp />, color: 'earth' },
  ]

  const recentUsers = [
    { id: 1, name: 'Emmanuel A.', role: 'Farmer', location: 'Ho', status: 'active', joined: 'Today' },
    { id: 2, name: 'Keta Market Co.', role: 'Buyer', location: 'Keta', status: 'active', joined: 'Yesterday' },
    { id: 3, name: 'Kofi Mensah', role: 'Transporter', location: 'Ho', status: 'active', joined: '2 days ago' },
    { id: 4, name: 'Grace K.', role: 'Farmer', location: 'Anloga', status: 'pending', joined: '3 days ago' },
  ]

  const produceListings = [
    { id: 1, name: 'Cassava', quantity: '500 kg', price: '₵2.50/kg', farmer: 'Emmanuel A.', location: 'Ho', status: 'listed' },
    { id: 2, name: 'Tomatoes', quantity: '300 kg', price: '₵4.20/kg', farmer: 'Grace K.', location: 'Anloga', status: 'listed' },
    { id: 3, name: 'Maize', quantity: '750 kg', price: '₵3.10/kg', farmer: 'Kofi M.', location: 'Keta', status: 'pending' },
  ]

  const supplyChainActivity = [
    { id: 1, type: 'order', from: 'Ho', to: 'Keta', status: 'in_transit', progress: 65 },
    { id: 2, type: 'order', from: 'Anloga', to: 'Ho', status: 'loading', progress: 30 },
    { id: 3, type: 'order', from: 'Keta', to: 'Anloga', status: 'delivered', progress: 100 },
  ]

  const alerts = [
    { id: 1, type: 'warning', message: 'High spoilage risk for tomatoes in Anloga', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'New transport route available: Ho - Keta', time: '4 hours ago' },
    { id: 3, type: 'success', message: 'Weekly revenue target exceeded by 15%', time: '6 hours ago' },
  ]

  const regionData = [
    { region: 'Ho', users: 847, listings: 423, revenue: '₵18,500', growth: '+12%' },
    { region: 'Anloga', users: 623, listings: 312, revenue: '₵12,300', growth: '+18%' },
    { region: 'Keta', users: 512, listings: 287, revenue: '₵10,200', growth: '+15%' },
  ]

  return (
    <div className="min-h-screen bg-ivory-50 pb-24">
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-earth-900">Admin Dashboard</h1>
            <p className="text-sm text-earth-500">Platform Overview</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-earth-100 transition-colors">
              <AlertTriangle className="w-6 h-6 text-earth-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-sunset-500 rounded-full" />
            </button>
            <button className="p-2 rounded-xl hover:bg-earth-100 transition-colors">
              <Settings className="w-6 h-6 text-earth-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-6 py-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-terracotta-600 text-white'
                  : 'bg-white text-earth-600 hover:bg-earth-100'
              }`}
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
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {overviewStats.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>

            {/* Alerts */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-earth-900 mb-4">Recent Alerts</h2>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <AlertItem key={alert.id} alert={alert} />
                ))}
              </div>
            </div>

            {/* Region Performance */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-earth-900 mb-4">Region Performance</h2>
              <div className="space-y-4">
                {regionData.map((region, index) => (
                  <RegionCard key={index} region={region} />
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-earth-900 mb-4">Platform Activity</h2>
              <div className="space-y-3">
                <ActivityItem message="New farmer registered in Ho" time="10 min ago" type="user" />
                <ActivityItem message="Order #2847 completed successfully" time="25 min ago" type="order" />
                <ActivityItem message="Transport route optimized for Keta" time="1 hour ago" type="system" />
                <ActivityItem message="Market price alert: Cassava +12%" time="2 hours ago" type="alert" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-earth-900">User Management</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white rounded-xl font-medium hover:bg-earth-100 transition-colors">
                  Filter
                </button>
                <button className="px-4 py-2 bg-terracotta-600 text-white rounded-xl font-medium hover:bg-terracotta-700 transition-colors">
                  Add User
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {recentUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'verifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-earth-900">Document Verification Queue</h2>
              <div className="px-3 py-1 bg-terracotta-100 text-terracotta-800 rounded-full text-xs font-semibold">
                {usersPending.filter(u => u.role === 'transport').length} Pending Actions
              </div>
            </div>

            <div className="grid gap-6">
              {usersPending.filter(u => u.role === 'transport').map((user) => {
                const checklistItems = [
                  { key: 'phone_verified', label: 'Phone Verification', icon: <Phone className="w-4 h-4" /> },
                  { key: 'email_verified', label: 'Email Verification', icon: <Mail className="w-4 h-4" /> },
                  { key: 'national_id_verified', label: 'National Identity ID', icon: <Award className="w-4 h-4" /> },
                  { key: 'location_verified', label: 'Farming/Business Location', icon: <Map className="w-4 h-4" /> },
                ]
                if (user.role === 'transport') {
                  checklistItems.push({ key: 'vehicle_verified', label: 'Vehicle Condition Audit', icon: <Truck className="w-4 h-4" /> })
                }

                // Helper to approve a pending transporter (set all verification flags true)
                const handleApproveTransporter = async (user) => {
                  const fields = ['phone_verified','email_verified','national_id_verified','location_verified','vehicle_verified'];
                  for (const f of fields) {
                    try { await adminUpdateVerification(user.id, f, true, user.role); } catch(e){ console.warn('Approve error',e); }
                  }
                  try { await adminUpdateVerification(user.id, 'verification_status', 'verified_transport', user.role); } catch(e){ console.warn('Status error',e); }
                  setUsersPending(prev=>prev.filter(u=>u.id!==user.id));
                };

                const handleRejectTransporter = async (user) => {
                  try { await adminUpdateVerification(user.id, 'verification_status', 'rejected', user.role); } catch(e){ console.warn('Reject error',e); }
                  setUsersPending(prev=>prev.filter(u=>u.id!==user.id));
                };

                const handleToggle = async (field, currentValue) => {
                  const updatedValue = !currentValue
                  try {
                    await adminUpdateVerification(user.id, field, updatedValue, user.role)
                  } catch (e) {
                    console.warn("Firestore update skipped or offline. Updating local state.", e)
                  }

                  setUsersPending(prev => prev.map(u => {
                    if (u.id === user.id) {
                      return {
                        ...u,
                        verifications: {
                          ...u.verifications,
                          [field]: updatedValue
                        }
                      }
                    }
                    return u
                  }))
                }

                return (
                  <div key={user.id} className="glass rounded-3xl p-6 hover:shadow-md transition duration-300">
                    <div className="flex justify-between items-start border-b border-earth-100 pb-4 mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-earth-900">{user.name}</h3>
                        <p className="text-xs font-semibold text-terracotta-600 capitalize">
                          {user.role} · {user.farmName || user.businessName || 'Transporter Partner'}
                        </p>
                      </div>
                      <span className="px-2.5 py-0.5 bg-earth-100 text-earth-800 rounded-full text-xs capitalize font-medium">
                        ID: {user.id}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-bold text-earth-400 uppercase tracking-wider">Credential Verification Checks</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {checklistItems.map(item => {
                          const isVerified = user.verifications[item.key]
                          return (
                            <div key={item.key} className="flex items-center justify-between p-3 bg-earth-50/50 rounded-2xl border border-earth-100">
                              <div className="flex items-center gap-2">
                                <div className="text-earth-500">
                                  {item.icon}
                                </div>
                                <span className="text-xs text-earth-700 font-medium">{item.label}</span>
                              </div>
                              
                              <button
                                onClick={() => handleToggle(item.key, isVerified)}
                                className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all duration-300 ${
                                  isVerified
                                    ? 'bg-forest-100 hover:bg-forest-200 text-forest-700'
                                    : 'bg-terracotta-100 hover:bg-terracotta-200 text-terracotta-700'
                                }`}
                              >
                                {isVerified ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Verified</span>
                                  </>
                                ) : (
                                  <>
                                    <X className="w-3.5 h-3.5" />
                                    <span>Unverified</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div className="flex gap-3 pt-6">
                      <button onClick={() => handleApproveTransporter(user)} className="flex-1 px-4 py-2 bg-forest-600 text-white rounded-xl hover:bg-forest-700 transition">Approve</button>
                      <button onClick={() => handleRejectTransporter(user)} className="flex-1 px-4 py-2 bg-terracotta-600 text-white rounded-xl hover:bg-terracotta-700 transition">Reject</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-earth-900">Platform Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-earth-900 mb-4">User Growth</h3>
                <div className="h-48 bg-earth-50 rounded-xl flex items-center justify-center">
                  <p className="text-earth-500">Growth chart</p>
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-earth-900 mb-4">Revenue Trends</h3>
                <div className="h-48 bg-earth-50 rounded-xl flex items-center justify-center">
                  <p className="text-earth-500">Revenue chart</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-earth-900 mb-4">Key Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Avg Order Value" value="₵850" change="+8%" />
                <MetricCard label="Completion Rate" value="94%" change="+2%" />
                <MetricCard label="Active Users" value="1,847" change="+12%" />
                <MetricCard label="Satisfaction" value="4.8/5" change="+0.2" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-earth-900">Reports</h2>
            
            <div className="grid gap-4">
              <ReportCard 
                title="Weekly Performance Report" 
                date="This week" 
                status="ready"
                icon={<Activity />}
              />
              <ReportCard 
                title="Monthly Revenue Summary" 
                date="This month" 
                status="ready"
                icon={<TrendingUp />}
              />
              <ReportCard 
                title="Supply Chain Analysis" 
                date="Last month" 
                status="ready"
                icon={<Truck />}
              />
              <ReportCard 
                title="User Engagement Report" 
                date="Last month" 
                status="processing"
                icon={<Users />}
              />
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-earth-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-around">
          <NavItem icon={<BarChart3 className="w-6 h-6" />} label="Home" onClick={() => onNavigate('home')} />
          <NavItem icon={<Users className="w-6 h-6" />} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <NavItem icon={<Shield className="w-6 h-6" />} label="Verify" active={activeTab === 'verifications'} onClick={() => setActiveTab('verifications')} />
        </div>
      </nav>
    </div>
  )
}

function StatCard({ stat }) {
  const colorClasses = {
    terracotta: 'from-terracotta-500 to-terracotta-600 bg-terracotta-50',
    forest: 'from-forest-500 to-forest-600 bg-forest-50',
    gold: 'from-gold-500 to-gold-600 bg-gold-50',
    earth: 'from-earth-500 to-earth-600 bg-earth-50',
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClasses[stat.color]} flex items-center justify-center text-white mb-3`}>
        {stat.icon}
      </div>
      <p className="text-sm text-earth-600 mb-1">{stat.label}</p>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-earth-900">{stat.value}</span>
        <span className="text-sm font-medium text-forest-600">{stat.change}</span>
      </div>
    </div>
  )
}

function AlertItem({ alert }) {
  const typeColors = {
    warning: 'bg-sunset-100 text-sunset-700',
    info: 'bg-forest-100 text-forest-700',
    success: 'bg-gold-100 text-gold-700',
  }

  const typeIcons = {
    warning: <AlertTriangle className="w-4 h-4" />,
    info: <Activity className="w-4 h-4" />,
    success: <CheckCircle className="w-4 h-4" />,
  }

  return (
    <div className="flex items-center gap-4 p-3 bg-earth-50 rounded-xl">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeColors[alert.type]}`}>
        {typeIcons[alert.type]}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-earth-900">{alert.message}</p>
        <p className="text-xs text-earth-500">{alert.time}</p>
      </div>
    </div>
  )
}

function RegionCard({ region }) {
  return (
    <div className="flex items-center justify-between p-4 bg-earth-50 rounded-xl hover:bg-earth-100 transition-colors">
      <div>
        <p className="font-semibold text-earth-900">{region.region}</p>
        <p className="text-sm text-earth-500">{region.users} users • {region.listings} listings</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-earth-900">{region.revenue}</p>
        <p className="text-sm font-medium text-forest-600">{region.growth}</p>
      </div>
    </div>
  )
}

function ActivityItem({ message, time, type }) {
  const typeColors = {
    user: 'bg-terracotta-100 text-terracotta-600',
    order: 'bg-forest-100 text-forest-600',
    system: 'bg-gold-100 text-gold-600',
    alert: 'bg-sunset-100 text-sunset-600',
  }

  return (
    <div className="flex items-center gap-4">
      <div className={`w-2 h-2 rounded-full ${typeColors[type]}`} />
      <div className="flex-1">
        <p className="text-sm font-medium text-earth-900">{message}</p>
        <p className="text-xs text-earth-500">{time}</p>
      </div>
    </div>
  )
}

function UserCard({ user }) {
  const statusColors = {
    active: 'bg-forest-100 text-forest-700',
    pending: 'bg-gold-100 text-gold-700',
    suspended: 'bg-sunset-100 text-sunset-700',
  }

  const roleColors = {
    Farmer: 'bg-terracotta-100 text-terracotta-700',
    Buyer: 'bg-forest-100 text-forest-700',
    Transporter: 'bg-gold-100 text-gold-700',
  }

  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-earth-900">{user.name}</h3>
          <div className="flex items-center gap-2 text-sm text-earth-600 mt-1">
            <MapPin className="w-4 h-4" />
            <span>{user.location}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
            {user.role}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
            {user.status}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-earth-500">Joined {user.joined}</p>
        <button className="px-4 py-2 bg-white text-earth-900 rounded-xl font-medium hover:bg-earth-100 transition-colors border border-earth-200">
          View Details
        </button>
      </div>
    </div>
  )
}

function ProduceListingCard({ produce }) {
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
          <p className="text-sm text-earth-500">{produce.farmer} • {produce.location}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[produce.status]}`}>
          {produce.status}
        </span>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-earth-500">{produce.quantity}</p>
          <p className="text-xl font-bold text-terracotta-600">{produce.price}</p>
        </div>
        <button className="px-4 py-2 bg-white text-earth-900 rounded-xl font-medium hover:bg-earth-100 transition-colors border border-earth-200">
          Manage
        </button>
      </div>
    </div>
  )
}

function SupplyChainCard({ activity }) {
  const statusColors = {
    loading: 'bg-gold-100 text-gold-700',
    in_transit: 'bg-terracotta-100 text-terracotta-700',
    delivered: 'bg-forest-100 text-forest-700',
  }

  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-terracotta-600" />
          <div className="flex items-center gap-2 text-earth-900 font-semibold">
            <span>{activity.from}</span>
            <ArrowUpRight className="w-4 h-4" />
            <span>{activity.to}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[activity.status]}`}>
          {activity.status.replace('_', ' ')}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-earth-600">Progress</span>
          <span className="text-sm font-medium text-earth-900">{activity.progress}%</span>
        </div>
        <div className="h-2 bg-earth-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-terracotta-500 to-forest-500 rounded-full"
            style={{ width: `${activity.progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, change }) {
  return (
    <div className="p-4 bg-earth-50 rounded-xl">
      <p className="text-xs text-earth-500 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <span className="text-xl font-bold text-earth-900">{value}</span>
        <span className="text-sm font-medium text-forest-600">{change}</span>
      </div>
    </div>
  )
}

function ReportCard({ title, date, status, icon }) {
  const statusColors = {
    ready: 'bg-forest-100 text-forest-700',
    processing: 'bg-gold-100 text-gold-700',
    pending: 'bg-earth-100 text-earth-700',
  }

  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-terracotta-100 rounded-xl flex items-center justify-center text-terracotta-600">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-earth-900">{title}</h3>
            <p className="text-sm text-earth-500">{date}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status}
        </span>
      </div>
      
      <button className="w-full px-4 py-2 bg-terracotta-600 text-white rounded-xl font-medium hover:bg-terracotta-700 transition-colors">
        Download Report
      </button>
    </div>
  )
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all duration-300 ${
        active ? 'text-terracotta-600' : 'text-earth-400 hover:text-earth-600'
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
