import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'

export default function Register() {
  // Line 6-12: Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    vehicle_model: ''
  })

  // Line 14: Navigation
  const navigate = useNavigate()

  // Line 16-18: Loading and error state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Line 20-26: Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Line 29-65: Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Line 32-35: Validate passwords match
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match')
      return
    }

    // Line 38-39: Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // Line 46: Prepare registration data
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        vehicle_model: formData.vehicle_model
      }
      
      // Line 52: Call register API
      const response = await api.post('/api/auth/register', registerData)
      
      // Line 54: Navigate to login
      navigate('/login')
    } catch (error) {
      // Line 57: Show error
      setError(error.response?.data?.error || 'Registration failed')
    } finally {
      // Line 59: Set loading false
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="w-full max-w-md">
        
        {/* Line 66-70: Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          
          {/* Line 69-71: Title */}
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Create Account
          </h1>

          {/* Line 73-76: Error message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Line 78-150: Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Line 80-88: Name input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="John Doe"
              />
            </div>

            {/* Line 90-98: Email input */}
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

            {/* Line 100-108: Password input */}
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

            {/* Line 110-118: Confirm password input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
              />
            </div>

            {/* Line 120-128: Vehicle model input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Model
              </label>
              <input
                type="text"
                name="vehicle_model"
                value={formData.vehicle_model}
                onChange={handleChange}
                placeholder="e.g., Tesla Model 3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Line 130-136: Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 font-semibold mt-6"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          {/* Line 139-144: Login link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
