import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/userSlice'

export default function Navbar() {
  // Line 7-10: Redux and router setup
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Line 12: Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Line 15-20: Handle logout
  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        
        {/* Line 25-31: Navbar container */}
        <div className="flex justify-between items-center">
          
          {/* Line 27-30: Logo/Brand */}
          <Link to="/" className="text-2xl font-bold text-green-600">
             BatteryMate
          </Link>

          {/* Line 32-50: Navigation links (hidden on mobile) */}
          {user.isAuthenticated && (
            <div className="hidden md:flex gap-8">
              <Link to="/" className="text-gray-700 hover:text-green-600 font-medium">
                Dashboard
              </Link>
              <Link to="/leaderboard" className="hover:text-green-100 transition flex items-center gap-1">
  Leaderboard
</Link>

              <Link to="/profile" className="text-gray-700 hover:text-green-600 font-medium">
                Profile
              </Link>
              <Link to="/settings" className="text-gray-700 hover:text-green-600 font-medium">
                Settings
              </Link>
            </div>
          )}

          {/* Line 52-65: User menu or auth buttons */}
          <div className="flex items-center gap-4">
            {user.isAuthenticated ? (
              <>
                {/* Line 55-57: User name display */}
                <span className="hidden md:block text-gray-700">
                  {user.name || 'User'}
                </span>

                {/* Line 59-63: Logout button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Line 66-72: Login/Register buttons when not authenticated */}
                <Link to="/login" className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Register
                </Link>
              </>
            )}

            {/* Line 75-79: Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 text-2xl"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Line 83-100: Mobile menu (shown when toggled) */}
        {mobileMenuOpen && user.isAuthenticated && (
          <div className="md:hidden mt-4 pb-4 border-t">
            <Link to="/" className="block py-2 text-gray-700 hover:text-green-600">
              Dashboard
            </Link>
            <Link to="/profile" className="block py-2 text-gray-700 hover:text-green-600">
              Profile
            </Link>
            <Link to="/settings" className="block py-2 text-gray-700 hover:text-green-600">
              Settings
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
