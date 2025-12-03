import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../store/userSlice'
import api from '../services/api'

export default function Profile() {
  // Line 7: Get user and dispatch from Redux
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  // Line 10-12: Local state for form editing
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    vehicle_model: user.vehicleModel || ''
  })

  // Line 17-18: Track editing state
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')

  // Line 21-26: Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Line 28-40: Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Line 32: Call API to update user
      const response = await api.put('/api/auth/profile', formData)
      
      // Line 34: Update Redux store
      dispatch(updateUser(response.data))
      
      // Line 36-37: Show success message
      setMessage('Profile updated successfully!')
      setIsEditing(false)
      
      // Line 39: Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      // Line 42: Show error message
      setMessage('Error updating profile: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Line 48-51: Page title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          My Profile
        </h1>

        {/* Line 52-56: Success/Error message */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        {/* Line 58-62: Profile form card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Line 62-70: Name input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              />
            </div>

            {/* Line 73-81: Email input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              />
            </div>

            {/* Line 84-92: Phone input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              />
            </div>

            {/* Line 95-103: Vehicle model input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Model
              </label>
              <input
                type="text"
                name="vehicle_model"
                value={formData.vehicle_model}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
              />
            </div>

            {/* Line 106-115: Edit/Save buttons */}
            <div className="flex gap-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
