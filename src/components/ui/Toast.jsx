import React, { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }) {
  const styles = {
    success: { bg: 'bg-forest-600',    icon: <CheckCircle className="w-5 h-5 text-white" /> },
    error:   { bg: 'bg-terracotta-600', icon: <AlertCircle className="w-5 h-5 text-white" /> },
    info:    { bg: 'bg-indigo-600',     icon: <Info className="w-5 h-5 text-white" /> },
  }
  const s = styles[toast.type] || styles.info

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-white text-sm font-medium ${s.bg} animate-slide-in`}
      style={{ animation: 'slideInRight 0.3s ease' }}
    >
      {s.icon}
      <span className="flex-1">{toast.message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
