import React, { useState, useEffect, useRef } from 'react'
import { X, Send, Phone, MessageSquare, Loader2, Sparkles } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../lib/firebase'
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { useToast } from '../ui/Toast'

export default function ChatModal({ isOpen, onClose, recipient }) {
  const { currentUser, userProfile } = useAuth()
  const { toast } = useToast()
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(true)
  const [offlineMode, setOfflineMode] = useState(false)
  const messagesEndRef = useRef(null)

  // Unique chatId for the two users (sorted alphabetically to guarantee uniqueness)
  const chatId = currentUser && recipient 
    ? [currentUser.uid, recipient.id || recipient.uid || 'unknown'].sort().join('_')
    : null

  useEffect(() => {
    if (!isOpen || !chatId) return

    setLoading(true)
    setOfflineMode(false)

    let unsub = () => {}

    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages')
      const q = query(messagesRef, orderBy('timestamp', 'asc'))

      unsub = onSnapshot(q, (snapshot) => {
        const msgs = []
        snapshot.forEach((doc) => {
          msgs.push({ id: doc.id, ...doc.data() })
        })
        setMessages(msgs)
        setLoading(false)
      }, (error) => {
        console.warn("Firestore subscription failed. Switching to local simulated chat mode.", error)
        setOfflineMode(true)
        loadSimulatedMessages()
        setLoading(false)
      })
    } catch (err) {
      console.warn("Failed to connect to chat database. Switching to offline simulation.", err)
      setOfflineMode(true)
      loadSimulatedMessages()
      setLoading(false)
    }

    return () => unsub()
  }, [isOpen, chatId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function loadSimulatedMessages() {
    // Load some helpful initial messages based on the recipient's role
    const recipientName = recipient.name || recipient.displayName || 'User'
    const recipientRole = recipient.role || 'user'
    
    let initialText = `Hello! This is ${recipientName}. How can I assist you today?`
    if (recipientRole === 'transport') {
      initialText = `Hi there! I'm local transporter ${recipientName}. Let me know if you need assistance with scheduling your delivery or load details.`
    } else if (recipientRole === 'buyer') {
      initialText = `Hello, I'm interested in purchasing your produce. Could you tell me more about the current quality and packaging options?`
    } else if (recipientRole === 'farmer') {
      initialText = `Hello! I have fresh farm produce available for pickup. Let me know what quantity you are looking to secure.`
    }

    setMessages([
      {
        id: 'initial',
        text: initialText,
        senderId: recipient.id || recipient.uid || 'recipient',
        timestamp: { toDate: () => new Date(Date.now() - 60000) }
      }
    ])
  }

  async function handleSend(e) {
    e.preventDefault()
    if (!inputText.trim() || !currentUser) return

    const textToSend = inputText.trim()
    setInputText('')

    if (!offlineMode) {
      try {
        const messagesRef = collection(db, 'chats', chatId, 'messages')
        await addDoc(messagesRef, {
          text: textToSend,
          senderId: currentUser.uid,
          senderName: userProfile?.displayName || 'User',
          timestamp: serverTimestamp()
        })
      } catch (err) {
        console.error("Error sending message to Firestore:", err)
        toast("Message failed to send to database. Switching to offline simulation.", "error")
        setOfflineMode(true)
        sendLocalMessage(textToSend)
      }
    } else {
      sendLocalMessage(textToSend)
    }
  }

  function sendLocalMessage(text) {
    const userMsg = {
      id: Date.now().toString(),
      text,
      senderId: currentUser.uid,
      timestamp: { toDate: () => new Date() }
    }
    setMessages(prev => [...prev, userMsg])

    // Simulate response after 1.5 seconds
    setTimeout(() => {
      const recipientName = recipient.name || recipient.displayName || 'User'
      const recipientRole = recipient.role || 'user'
      let replyText = `Thanks for your message! Let's arrange the details. I am also available on WhatsApp.`
      
      if (text.toLowerCase().includes('price') || text.toLowerCase().includes('cost')) {
        replyText = `I agree on the pricing structure. Let's confirm this delivery order.`
      } else if (text.toLowerCase().includes('where') || text.toLowerCase().includes('location')) {
        replyText = `I am currently located near Ho. Where should we meet?`
      } else if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
        replyText = `Hi! Hope you are doing well. Are you ready to organize this transaction?`
      }

      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        senderId: recipient.id || recipient.uid || 'recipient',
        timestamp: { toDate: () => new Date() }
      }
      setMessages(prev => [...prev, botMsg])
    }, 1500)
  }

  // Get recipient phone number safely
  const rawPhone = recipient.phone || recipient.phoneNumber || ''
  const formattedPhone = rawPhone.replace(/[^\d+]/g, '')

  function handleWhatsAppCall() {
    if (!formattedPhone) {
      toast("No phone number registered for this user.", "error")
      return
    }
    
    // Check if country code starts with +, if not add Ghana default (+233) if it starts with 0
    let cleanPhone = formattedPhone
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '+233' + cleanPhone.substring(1)
    } else if (!cleanPhone.startsWith('+')) {
      cleanPhone = '+' + cleanPhone
    }

    const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}`
    window.open(whatsappUrl, '_blank')
    toast(`Redirecting to WhatsApp with ${recipient.name || recipient.displayName}...`, "info")
  }

  if (!isOpen) return null

  const recipientName = recipient.name || recipient.displayName || 'User'
  const recipientRoleLabel = recipient.role 
    ? recipient.role.charAt(0).toUpperCase() + recipient.role.slice(1)
    : 'User'

  return (
    <div className="fixed inset-0 bg-earth-900/60 backdrop-blur-sm z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-t-3xl sm:rounded-3xl w-full max-w-lg h-[90vh] sm:h-[600px] shadow-2xl flex flex-col overflow-hidden animate-scale-in border border-white/60">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-earth-100 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-400/20">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-tight flex items-center gap-2">
                <span>{recipientName}</span>
                <span className="text-[10px] bg-white/20 text-indigo-100 px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">
                  {recipientRoleLabel}
                </span>
                {(recipient.community || recipient.location) && (
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-100 px-2 py-0.5 rounded-full font-medium border border-emerald-400/20">
                    📍 {recipient.community || recipient.location}
                  </span>
                )}
              </h3>
              <p className="text-xs text-indigo-200 mt-0.5">
                {offlineMode ? 'Local Offline Mode' : 'Connected'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {formattedPhone && (
              <button
                onClick={handleWhatsAppCall}
                title="Start WhatsApp Video Call/Chat"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Call</span>
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-earth-50/50">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <>
              {offlineMode && (
                <div className="p-3 bg-gold-50 border border-gold-200 rounded-2xl flex items-center gap-2.5 text-gold-800 text-xs">
                  <Sparkles className="w-4 h-4 shrink-0 text-gold-600 animate-pulse" />
                  <span>Showing simulated chat session with mock AI replies. WhatsApp calling remains active.</span>
                </div>
              )}
              
              {messages.map((msg) => {
                const isMe = msg.senderId === currentUser?.uid
                const msgDate = msg.timestamp?.toDate ? msg.timestamp.toDate() : new Date()
                const formattedTime = msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                      isMe 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-white text-earth-900 border border-earth-100 rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                      <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-earth-400'}`}>
                        {formattedTime}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Footer Input */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-earth-100 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-earth-50 rounded-xl border border-earth-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-earth-800 text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition-colors shadow-md disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

      </div>
    </div>
  )
}
