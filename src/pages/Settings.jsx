import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../store/userSlice'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  // Line 7-8: Redux dispatch and navigation
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Line 10-12: Settings state
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false
  })

  // Line 15-21: Handle logout
  const handleLogout = () => {
    // Line 17: Dispatch logout action
    dispatch(logout())
    
    // Line 19: Clear localStorage
    localStorage.removeItem('token')
    
    // Line 21: Redirect to login
    navigate('/login')
  }

  // Line 24-30: Handle settings change
  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Line 35-38: Page title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Settings
        </h1>

        {/* Line 40-44: Preferences card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Preferences
          </h2>

          {/* Line 45-55: Notification toggle */}
          <div className="flex items-center justify-between py-4 border-b">
            <div>
              <p className="font-medium text-gray-700">Notifications</p>
              <p className="text-sm text-gray-500">
                Receive trip and eco-score updates
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={() => handleSettingChange('notifications')}
              className="h-6 w-6"
            />
          </div>

          {/* Line 58-68: Email updates toggle */}
          <div className="flex items-center justify-between py-4 border-b">
            <div>
              <p className="font-medium text-gray-700">Email Updates</p>
              <p className="text-sm text-gray-500">
                Receive weekly environmental impact summary
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailUpdates}
              onChange={() => handleSettingChange('emailUpdates')}
              className="h-6 w-6"
            />
          </div>

          {/* Line 71-81: Dark mode toggle */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-gray-700">Dark Mode</p>
              <p className="text-sm text-gray-500">
                Use dark theme for app
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={() => handleSettingChange('darkMode')}
              className="h-6 w-6"
            />
          </div>
        </div>

        {/* Line 85-90: Danger zone card */}
        <div className="bg-red-50 rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-red-900 mb-4">
            Danger Zone
          </h2>

          {/* Line 90-95: Logout button */}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
