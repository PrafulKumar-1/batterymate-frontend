import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    vehicle_model: ''
  })

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match')
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    // Email domain validation
    const allowedDomains = [
      'gmail.com', 'icloud.com', 'yahoo.com', 'outlook.com', 
      'hotmail.com', 'yahoo.co.in', 'rediffmail.com'
    ]
    const emailParts = formData.email.split('@')
    if (emailParts.length !== 2) {
      setError('Invalid email format')
      return
    }
    const domain = emailParts[1].toLowerCase().trim()
    
    if (!allowedDomains.includes(domain)) {
      setError('Email must be from Gmail, iCloud, Yahoo, Outlook, Hotmail, or Rediffmail')
      return
    }

    // Validate vehicle selection
    if (!formData.vehicle_model) {
      setError('Please select a vehicle model')
      return
    }

    setLoading(true)
    setError('')

    try {
      const registerData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        vehicle_model: formData.vehicle_model
      }
      
      const response = await api.post('/api/auth/register', registerData)
      navigate('/login')
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const allEVs = [
    // Electric Cars
    'Tata Nexon EV', 'Tata Punch EV', 'Tata Tiago EV', 'MG Comet EV', 'MG ZS EV',
    'Mahindra XUV400', 'Hyundai Ioniq 5', 'Kia EV6', 'BYD Atto 3', 'BYD Seal',
    'Tesla Model 3', 'Tesla Model Y', 'BMW i4', 'BMW iX1', 'BMW i7',
    'Volvo EX30', 'Volvo EX40', 'Kia EV9', 'Mahindra BE 6', 'Mahindra XEV 9S',
    'MG M9', 'BYD Sealion 7', 'Citroen eC3', 'Tata Curvv EV',
    
    // Electric Two-Wheelers (Scooters & Bikes)
    'TVS iQube', 'Bajaj Chetak', 'Ather 450X', 'Ola S1 Pro', 'Hero Vida VX2',
    'Ather Rizta', 'Yulu Wynn', 'Honda Activa e', 'Okinawa Okhi-90', 'Ampere Magnus Pro',
    'Simple One', 'Revolt RV400', 'Ultraviolette F77', 'Tork Kratos', 'Oben Rorr',
    'Ola Roadster X', 'TVS Orbiter', 'Hero Electric Optima', 'BGauss RUV350',
    'Okinawa Ridge Plus', 'Vida V1 Pro', 'Ather 450 Apex'
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Create Account
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border-l-4 border-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="John Doe"
              />
            </div>

            {/* Email input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="you@gmail.com"
              />
            </div>

            {/* Password input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Confirm password input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Vehicle model dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                EV Vehicle Model (Car/Scooter/Bike) *
              </label>
              <select
                name="vehicle_model"
                value={formData.vehicle_model}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white cursor-pointer"
              >
                <option value="">Select your EV</option>
                {allEVs.map((vehicle) => (
                  <option key={vehicle} value={vehicle}>
                    {vehicle}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold mt-6 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
