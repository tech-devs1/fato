import React, { useState, useRef, useEffect } from 'react'
import { Settings, LogOut, Key, X, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'

export default function SettingsDropdown({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const dropdownRef = useRef(null)
  
  const { currentUser } = useAuth()

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-earth-200 overflow-hidden z-50 animate-fade-in">
            <div className="py-1">
              <button 
                onClick={() => {
                  setIsOpen(false)
                  setShowModal(true)
                }}
                className="w-full text-left px-4 py-3 text-sm text-earth-700 hover:bg-earth-50 flex items-center gap-3 transition-colors"
              >
                <Key className="w-4 h-4 text-earth-500" />
                <span>Change Password</span>
              </button>
              <button 
                onClick={() => {
                  setIsOpen(false)
                  onLogout && onLogout()
                }}
                className="w-full text-left px-4 py-3 text-sm text-terracotta-600 hover:bg-terracotta-50 flex items-center gap-3 transition-colors border-t border-earth-100"
              >
                <LogOut className="w-4 h-4 text-terracotta-500" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <ChangePasswordModal onClose={() => setShowModal(false)} user={currentUser} />
      )}
    </>
  )
}

function ChangePasswordModal({ onClose, user }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }
    setBusy(true)
    try {
      if (user?.email) {
        const credential = EmailAuthProvider.credential(user.email, oldPassword)
        await reauthenticateWithCredential(user, credential)
      } else {
        throw new Error('No email found for user.')
      }
      await updatePassword(user, newPassword)
      setSuccess('Password updated successfully!')
      setTimeout(onClose, 2000)
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Incorrect current password.')
      } else {
        setError(err.message || 'Failed to update password.')
      }
    } finally {
      setBusy(false)
    }
  }

  if (!user || !user.email) {
    return (
      <div className="fixed inset-0 bg-earth-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative p-6 text-center">
          <p className="text-earth-600 mb-4">Password change is not available for this account type.</p>
          <button onClick={onClose} className="px-4 py-2 bg-earth-100 rounded-xl hover:bg-earth-200 transition-colors">Close</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-earth-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-scale-in">
        <div className="px-6 py-4 border-b border-earth-100 flex items-center justify-between">
          <h3 className="font-bold text-earth-900 text-lg flex items-center gap-2">
            <Key className="w-5 h-5 text-terracotta-600" />
            <span>Change Password</span>
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-earth-100 transition-colors">
            <X className="w-5 h-5 text-earth-600" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">{error}</div>}
          {success && <div className="p-3 bg-green-50 text-green-700 text-sm rounded-xl border border-green-200">{success}</div>}
          
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1">Current Password</label>
            <input 
              type="password" 
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-earth-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500" 
              required
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-earth-700 mb-1">New Password</label>
            <input 
              type={showPw ? 'text' : 'password'} 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-earth-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500 pr-12" 
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPw(!showPw)}
              className="absolute right-4 top-[38px] text-earth-400"
            >
              {showPw ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
            </button>
          </div>
          
          <button 
            type="submit" 
            disabled={busy}
            className="w-full py-3 mt-4 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
