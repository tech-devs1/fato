import React, { useState, useEffect } from 'react'
import { MapPin, Activity, TrendingUp, Truck, Sprout, Bell, Search, User, ChevronRight, Sparkles, AlertCircle, CheckCircle } from 'lucide-react'
import MapboxView from './MapboxView'

export default function HomeScreen({ onNavigate }) {
  const [selectedRegion, setSelectedRegion] = useState('volta')

  const regions = [
    { id: 'volta', name: 'Volta Region', produce: 1247, demand: 892, active: true },
    { id: 'ho', name: 'Ho', produce: 423, demand: 312, active: true },
    { id: 'anloga', name: 'Anloga', produce: 312, demand: 287, active: true },
    { id: 'keta', name: 'Keta', produce: 512, demand: 293, active: true },
  ]

  const liveActivity = [
    { type: 'produce', message: 'New cassava listing in Ho', time: '2m ago', region: 'ho' },
    { type: 'order', message: 'Order #2847 confirmed', time: '5m ago', region: 'anloga' },
    { type: 'transport', message: 'Truck departed for Keta', time: '8m ago', region: 'keta' },
    { type: 'produce', message: 'Tomato price surge detected', time: '12m ago', region: 'volta' },
    { type: 'alert', message: 'High spoilage risk alert', time: '15m ago', region: 'ho' },
  ]

  const marketInsights = [
    { product: 'Cassava', price: '₵2.50/kg', trend: '+12%', status: 'up' },
    { product: 'Tomatoes', price: '₵4.20/kg', trend: '+8%', status: 'up' },
    { product: 'Maize', price: '₵3.10/kg', trend: '-3%', status: 'down' },
    { product: 'Yam', price: '₵5.80/kg', trend: '+5%', status: 'up' },
  ]

  const aiRecommendations = [
    { title: 'Optimal harvest time', insight: 'Cassava in Ho ready for harvest in 2 days', priority: 'high' },
    { title: 'Market opportunity', insight: 'High demand for tomatoes in Keta - 45% above average', priority: 'medium' },
    { title: 'Transport efficiency', insight: 'Consolidate shipments to Anloga for 30% cost savings', priority: 'medium' },
  ]

  return (
    <div className="min-h-screen bg-ivory-50 pb-24">
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-terracotta-500 to-terracotta-700 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-earth-900">Nunya AI</h1>
              <p className="text-xs text-earth-500">Volta Region Command Center</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-earth-100 transition-colors">
              <Bell className="w-6 h-6 text-earth-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-terracotta-500 rounded-full" />
            </button>
            <button className="p-2 rounded-xl hover:bg-earth-100 transition-colors">
              <User className="w-6 h-6 text-earth-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6 max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
          <input
            type="text"
            placeholder="Search produce, markets, or routes..."
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-earth-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* Supply Map Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-earth-900">Live Supply Map</h2>
            <button className="flex items-center gap-2 text-terracotta-600 font-medium hover:text-terracotta-700 transition-colors">
              <span>View Full Map</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="glass-lg rounded-3xl p-6">
            {/* Interactive Map Visualization */}
            <div className="relative h-80 md:h-[400px] bg-white rounded-2xl overflow-hidden mb-6 border border-earth-200 shadow-inner">
              <MapboxView
                startLocation={selectedRegion === 'volta' ? '' : selectedRegion}
                showActiveRoutes={true}
                markers={regions.filter(r => r.id !== 'volta').map(region => ({
                  id: region.id,
                  position: region.id,
                  label: region.name,
                  produce: region.produce,
                  demand: region.demand,
                  type: 'supply'
                }))}
                className="h-full w-full"
              />
            </div>

            {/* Region Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {regions.map((region) => (
                <div
                  key={region.id}
                  onClick={() => setSelectedRegion(region.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                    selectedRegion === region.id
                      ? 'bg-gradient-to-br from-terracotta-500 to-terracotta-600 text-white'
                      : 'bg-white hover:bg-earth-50'
                  }`}
                >
                  <p className="text-sm font-medium mb-1">{region.name}</p>
                  <div className={`text-2xl font-bold ${selectedRegion === region.id ? 'text-white' : 'text-earth-900'}`}>
                    {region.produce}
                  </div>
                  <p className={`text-xs ${selectedRegion === region.id ? 'text-terracotta-100' : 'text-earth-500'}`}>
                    produce listings
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Activity className="w-5 h-5" />}
            label="Live Activity"
            value="847"
            change="+12%"
            color="terracotta"
          />
          <StatCard
            icon={<Sprout className="w-5 h-5" />}
            label="Produce Listed"
            value="1,247"
            change="+8%"
            color="forest"
          />
          <StatCard
            icon={<Truck className="w-5 h-5" />}
            label="Active Transport"
            value="156"
            change="+5%"
            color="gold"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Market Demand"
            value="892"
            change="+15%"
            color="earth"
          />
        </section>

        {/* AI Recommendations */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-earth-900">AI Recommendations</h2>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-500" />
              <span className="text-sm text-earth-500">Powered by Nunya AI</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {aiRecommendations.map((rec, index) => (
              <div key={index} className="glass rounded-2xl p-4 hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    rec.priority === 'high' ? 'bg-terracotta-100' : 'bg-gold-100'
                  }`}>
                    <Sparkles className={`w-5 h-5 ${
                      rec.priority === 'high' ? 'text-terracotta-600' : 'text-gold-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-earth-900 mb-1">{rec.title}</h3>
                    <p className="text-sm text-earth-600">{rec.insight}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rec.priority === 'high' ? 'bg-terracotta-100 text-terracotta-700' : 'bg-gold-100 text-gold-700'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Market Insights */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-earth-900">Market Insights</h2>
            <button className="flex items-center gap-2 text-terracotta-600 font-medium hover:text-terracotta-700 transition-colors">
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {marketInsights.map((item, index) => (
              <div key={index} className="glass rounded-2xl p-4 hover:scale-[1.02] transition-transform duration-300">
                <p className="text-sm text-earth-600 mb-2">{item.product}</p>
                <div className="flex items-end justify-between">
                  <span className="text-xl font-bold text-earth-900">{item.price}</span>
                  <span className={`text-sm font-medium ${item.status === 'up' ? 'text-forest-600' : 'text-terracotta-600'}`}>
                    {item.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Live Activity Feed */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-earth-900">Live Activity</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-forest-500 rounded-full animate-pulse" />
              <span className="text-sm text-earth-500">Real-time</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {liveActivity.map((activity, index) => (
              <ActivityItem key={index} activity={activity} />
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-earth-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-around">
          <NavItem icon={<Activity className="w-6 h-6" />} label="Home" active />
          <NavItem icon={<Sprout className="w-6 h-6" />} label="Market" onClick={() => onNavigate('buyer')} />
          <NavItem icon={<Truck className="w-6 h-6" />} label="Transport" onClick={() => onNavigate('transport')} />
          <NavItem icon={<User className="w-6 h-6" />} label="Profile" onClick={() => onNavigate('farmer')} />
        </div>
      </nav>
    </div>
  )
}

function StatCard({ icon, label, value, change, color }) {
  const colorClasses = {
    terracotta: 'from-terracotta-500 to-terracotta-600 bg-terracotta-50',
    forest: 'from-forest-500 to-forest-600 bg-forest-50',
    gold: 'from-gold-500 to-gold-600 bg-gold-50',
    earth: 'from-earth-500 to-earth-600 bg-earth-50',
  }

  return (
    <div className="glass rounded-2xl p-4 hover:scale-[1.02] transition-transform duration-300">
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

function ActivityItem({ activity }) {
  const typeIcons = {
    produce: <Sprout className="w-4 h-4" />,
    order: <CheckCircle className="w-4 h-4" />,
    transport: <Truck className="w-4 h-4" />,
    alert: <AlertCircle className="w-4 h-4" />,
  }

  const typeColors = {
    produce: 'bg-forest-100 text-forest-600',
    order: 'bg-gold-100 text-gold-600',
    transport: 'bg-terracotta-100 text-terracotta-600',
    alert: 'bg-sunset-100 text-sunset-600',
  }

  return (
    <div className="glass rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.01] transition-transform duration-300">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeColors[activity.type]}`}>
        {typeIcons[activity.type]}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-earth-900">{activity.message}</p>
        <p className="text-xs text-earth-500">{activity.time}</p>
      </div>
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-earth-100 text-earth-600 capitalize">
        {activity.region}
      </span>
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
