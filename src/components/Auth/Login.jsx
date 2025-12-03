import { useState, useEffect } from 'react' // Added useEffect
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux' // Added useSelector
import { setUser } from '../../store/userSlice'
import api from '../../services/api'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // 1. Get auth state
  const { isAuthenticated } = useSelector(state => state.user)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 2. Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
 const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await api.post('/api/auth/login', formData)
      
      console.log("Login Response:", response.data) // Debugging log

      // CRITICAL FIX: Check if token exists before saving
      const token = response.data.access_token || response.data.token
      
      if (!token) {
        throw new Error("No access token received from server")
      }

      localStorage.setItem('token', token)
      
      const userData = response.data.user
      const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.name;

      dispatch(setUser({
        id: userData.id,
        name: fullName,
        email: userData.email,
        isAuthenticated: true
      }))
      
      navigate('/')
    } catch (error) {
      console.error("Login Error:", error)
      setError(error.response?.data?.error || error.message || 'Login failed')
      localStorage.removeItem('token') // Cleanup if failed
    } finally {
      setLoading(false)
    }
  }

  // If authenticated, don't render the form (prevents flash before redirect)
  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
             BatteryMate
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 font-semibold mt-6"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}