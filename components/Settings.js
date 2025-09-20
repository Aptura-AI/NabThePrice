import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Settings() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleResetPassword = async () => {
    setLoading(true)
    setMessage('')
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setMessage('No user found. Please log in again.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/login`,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Password reset instructions sent to your email!')
    }
    setLoading(false)
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
      
      {message && (
        <div className={`p-4 rounded-md mb-6 ${
          message.includes('sent') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Management</h3>
          <p className="text-gray-600 text-sm mb-4">
            Manage your admin account settings and security.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="btn-secondary flex-1"
          >
            {loading ? 'Sending...' : 'Reset Password'}
          </button>
          
          <button
            onClick={handleLogout}
            disabled={loading}
            className="bg-red-100 text-red-700 px-6 py-3 font-semibold rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-red-200 flex-1"
          >
            Logout
          </button>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Application Info</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Environment:</strong> Production</p>
            <p><strong>Database:</strong> Supabase</p>
          </div>
        </div>
      </div>
    </div>
  )
}