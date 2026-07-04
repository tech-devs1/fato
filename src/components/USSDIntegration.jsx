import React, { useState } from 'react'
import { Phone, MessageSquare, Mic, ArrowRight, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react'

export default function USSDIntegration() {
  const [expandedSection, setExpandedSection] = useState(null)

  const ussdFlow = [
    { step: 1, action: 'User dials *123#', response: 'Welcome to Nunya AI\n1. My Produce\n2. Market Prices\n3. Transport\n4. Orders' },
    { step: 2, action: 'User selects 1', response: 'My Produce\n1. List New Produce\n2. View My Listings\n3. Update Produce' },
    { step: 3, action: 'User selects 1', response: 'Enter produce type:\n1. Cassava\n2. Tomatoes\n3. Maize\n4. Yam' },
    { step: 4, action: 'User selects 1', response: 'Enter quantity (kg):' },
    { step: 5, action: 'User enters 500', response: 'Enter price per kg (₵):' },
    { step: 6, action: 'User enters 2.50', response: 'Confirm listing:\nCassava - 500kg @ ₵2.50/kg\n1. Confirm\n2. Cancel' },
    { step: 7, action: 'User selects 1', response: '✓ Produce listed successfully!\nRef: #LIST-2847\nSMS confirmation sent.' },
  ]

  const smsNotifications = [
    { type: 'order', message: 'Nunya AI: New order received! Order #2847 for 200kg Cassava. Total: ₵500. Reply CONFIRM to accept.', time: '10:30 AM' },
    { type: 'price', message: 'Nunya AI: Price alert! Cassava price increased to ₵2.50/kg (+12%). Good time to sell.', time: '09:15 AM' },
    { type: 'transport', message: 'Nunya AI: Transport matched! Driver Kofi Mensah assigned for Ho-Keta route. ETA: 2 hours.', time: '08:45 AM' },
    { type: 'reminder', message: 'Nunya AI: Reminder: Your tomatoes freshness at 88%. Sell within 3 days for best value.', time: 'Yesterday' },
  ]

  const voiceCommands = [
    { command: 'List my cassava', action: 'Opens produce listing flow for cassava' },
    { command: 'What is the price of tomatoes?', action: 'Retrieves current market price for tomatoes' },
    { command: 'Find transport to Keta', action: 'Searches for available transport to Keta' },
    { command: 'Check my orders', action: 'Displays active orders and status' },
  ]

  return (
    <div className="min-h-screen bg-ivory-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-earth-900 mb-2">USSD & Offline Integration</h1>
          <p className="text-earth-600">Ensuring accessibility for users with limited connectivity or digital literacy</p>
        </header>

        <div className="grid gap-8">
          {/* USSD Flow */}
          <section className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-terracotta-100 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-terracotta-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-earth-900">USSD Menu Flow</h2>
                  <p className="text-sm text-earth-500">Dial *123# to access Nunya AI</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-terracotta-600 text-white rounded-xl font-medium hover:bg-terracotta-700 transition-colors">
                Test USSD
              </button>
            </div>

            <div className="space-y-4">
              {ussdFlow.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-terracotta-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    {index < ussdFlow.length - 1 && (
                      <div className="w-0.5 h-8 bg-terracotta-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-earth-50 rounded-xl">
                      <p className="text-xs text-earth-500 mb-1">User Action</p>
                      <p className="font-medium text-earth-900">{item.action}</p>
                    </div>
                    <div className="p-4 bg-forest-50 rounded-xl">
                      <p className="text-xs text-earth-500 mb-1">System Response</p>
                      <p className="font-medium text-earth-900 whitespace-pre-line">{item.response}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SMS Notifications */}
          <section className="glass rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-forest-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-earth-900">SMS Notifications</h2>
                <p className="text-sm text-earth-500">Real-time updates via SMS</p>
              </div>
            </div>

            <div className="space-y-3">
              {smsNotifications.map((sms, index) => (
                <div key={index} className="p-4 bg-earth-50 rounded-xl border-l-4 border-forest-500">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-forest-600" />
                      <span className="text-xs font-medium text-earth-500 uppercase">{sms.type}</span>
                    </div>
                    <span className="text-xs text-earth-500">{sms.time}</span>
                  </div>
                  <p className="text-sm text-earth-900">{sms.message}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Voice Commands */}
          <section className="glass rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center">
                <Mic className="w-6 h-6 text-gold-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-earth-900">Voice Commands</h2>
                <p className="text-sm text-earth-500">Speak naturally to interact with the system</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {voiceCommands.map((cmd, index) => (
                <div key={index} className="p-4 bg-earth-50 rounded-xl hover:bg-earth-100 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="w-4 h-4 text-gold-600" />
                    <p className="font-medium text-earth-900">"{cmd.command}"</p>
                  </div>
                  <p className="text-sm text-earth-600">{cmd.action}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Integration Benefits */}
          <section className="glass rounded-3xl p-6">
            <h2 className="text-xl font-bold text-earth-900 mb-6">Integration Benefits</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <BenefitCard
                icon={<Phone className="w-6 h-6" />}
                title="No Internet Required"
                description="USSD works on any mobile network without data connection"
                color="terracotta"
              />
              <BenefitCard
                icon={<MessageSquare className="w-6 h-6" />}
                title="Always Reachable"
                description="SMS notifications ensure farmers never miss important updates"
                color="forest"
              />
              <BenefitCard
                icon={<Mic className="w-6 h-6" />}
                title="Natural Interaction"
                description="Voice commands support local languages and low literacy users"
                color="gold"
              />
            </div>
          </section>

          {/* Language Support */}
          <section className="glass rounded-3xl p-6">
            <h2 className="text-xl font-bold text-earth-900 mb-6">Language Support</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <LanguageCard language="Ewe" status="fully_supported" />
              <LanguageCard language="Twi" status="fully_supported" />
              <LanguageCard language="Ga" status="partial" />
              <LanguageCard language="English" status="fully_supported" />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function BenefitCard({ icon, title, description, color }) {
  const colorClasses = {
    terracotta: 'from-terracotta-500 to-terracotta-600 bg-terracotta-50',
    forest: 'from-forest-500 to-forest-600 bg-forest-50',
    gold: 'from-gold-500 to-gold-600 bg-gold-50',
  }

  return (
    <div className="p-6 bg-earth-50 rounded-2xl">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-earth-900 mb-2">{title}</h3>
      <p className="text-sm text-earth-600">{description}</p>
    </div>
  )
}

function LanguageCard({ language, status }) {
  const statusColors = {
    fully_supported: 'bg-forest-100 text-forest-700',
    partial: 'bg-gold-100 text-gold-700',
    coming_soon: 'bg-earth-100 text-earth-700',
  }

  const statusLabels = {
    fully_supported: 'Fully Supported',
    partial: 'Partial',
    coming_soon: 'Coming Soon',
  }

  return (
    <div className="p-4 bg-earth-50 rounded-xl text-center">
      <p className="text-lg font-bold text-earth-900 mb-2">{language}</p>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {statusLabels[status]}
      </span>
    </div>
  )
}
