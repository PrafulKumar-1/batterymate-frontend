import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

// Indian cities with GPS coordinates
const INDIAN_CITIES = {
  'Mumbai': { lat: 19.0760, lon: 72.8777 },
  'Goa': { lat: 15.4909, lon: 73.8278 },
  'Bangalore': { lat: 12.9716, lon: 77.5946 },
  'Hyderabad': { lat: 17.3850, lon: 78.4867 },
  'Delhi': { lat: 28.7041, lon: 77.1025 },
  'Chennai': { lat: 13.0827, lon: 80.2707 },
  'Pune': { lat: 18.5204, lon: 73.8567 },
  'Ahmedabad': { lat: 23.0225, lon: 72.5714 },
  'Kolkata': { lat: 22.5726, lon: 88.3639 },
  'Jaipur': { lat: 26.9124, lon: 75.7873 }
}

export default function RoutePlanner() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [routeData, setRouteData] = useState({
    startLocation: '',
    endLocation: '',
    preferences: 'balanced'
  })

  const [routes, setRoutes] = useState([])
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [startCoords, setStartCoords] = useState(null)
  const [endCoords, setEndCoords] = useState(null)

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setRouteData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  // Get coordinates for location
  const getCoordinates = (locationName) => {
    const coords = INDIAN_CITIES[locationName]
    if (!coords) {
      throw new Error(`Location "${locationName}" not found`)
    }
    return coords
  }

  // Search for routes
  const handleSearch = async () => {
    if (!routeData.startLocation.trim() || !routeData.endLocation.trim()) {
      setError('Please enter both start and end locations')
      return
    }

    if (routeData.startLocation === routeData.endLocation) {
      setError('Start and end location cannot be the same')
      return
    }

    try {
      setLoading(true)
      setError('')

      const start = getCoordinates(routeData.startLocation)
      const end = getCoordinates(routeData.endLocation)

      setStartCoords(start)
      setEndCoords(end)

      const response = await api.post('/api/predictions/route-recommendation', {
        start_latitude: start.lat,
        start_longitude: start.lon,
        end_latitude: end.lat,
        end_longitude: end.lon,
        preferences: routeData.preferences
      })

      setRoutes(response.data || [])
      setSelectedRoute(null)
    } catch (error) {
      console.error('Error fetching routes:', error)
      setError(error.response?.data?.error || error.message || 'Failed to get routes')
    } finally {
      setLoading(false)
    }
  }

  //  NEW: Handle Start Navigation
  const handleStartNavigation = async (route) => {
    if (!selectedRoute) {
      setError('Please select a route first')
      return
    }

    try {
      setLoading(true)

      // Store route data in sessionStorage for Navigation component
      const navigationData = {
        route: selectedRoute,
        startLocation: routeData.startLocation,
        endLocation: routeData.endLocation,
        startCoords: startCoords,
        endCoords: endCoords,
        startTime: new Date().toISOString()
      }

      sessionStorage.setItem('activeRoute', JSON.stringify(navigationData))

      // Navigate to turn-by-turn navigation
      navigate('/navigate')

    } catch (error) {
      console.error('Error starting navigation:', error)
      setError('Failed to start navigation')
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6"> Route Planner</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
           {error}
        </div>
      )}

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
         Available cities: {Object.keys(INDIAN_CITIES).join(', ')}
      </div>

      {/* Start Location */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Start Location</label>
        <input
          type="text"
          name="startLocation"
          value={routeData.startLocation}
          onChange={handleChange}
          placeholder="e.g., Mumbai"
          list="cities-list"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <datalist id="cities-list">
          {Object.keys(INDIAN_CITIES).map(city => (
            <option key={city} value={city} />
          ))}
        </datalist>
      </div>

      {/* End Location */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">End Location</label>
        <input
          type="text"
          name="endLocation"
          value={routeData.endLocation}
          onChange={handleChange}
          placeholder="e.g., Goa"
          list="cities-list"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Route Preference */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Route Preference</label>
        <select
          name="preferences"
          value={routeData.preferences}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="balanced"> Balanced</option>
          <option value="fastest"> Fastest</option>
          <option value="cheapest"> Cheapest</option>
          <option value="cleanest"> Cleanest</option>
        </select>
      </div>

      {/* Find Routes Button */}
      <button
        onClick={handleSearch}
        disabled={loading}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-6"
      >
        {loading ? ' Finding Routes...' : ' Find Routes'}
      </button>

      {/* Routes Display */}
      {routes.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4"> Available Routes</h3>
          {routes.map((route) => (
            <div 
              key={route.id} 
              className={`mb-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedRoute?.id === route.id 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-green-500'
              }`}
              onClick={() => setSelectedRoute(route)}
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-lg">{route.name}</h4>
                <span className="text-gray-600">{route.time_minutes} mins</span>
              </div>

              <div className="grid grid-cols-4 gap-3 text-sm mb-3">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-gray-600">Distance</div>
                  <div className="text-lg font-bold text-blue-600">{route.distance_km?.toFixed(2)} km</div>
                </div>

                <div className="bg-green-50 p-3 rounded">
                  <div className="text-gray-600">CO2 Saved</div>
                  <div className="text-lg font-bold text-green-600">{route.co2_kg?.toFixed(2)} kg</div>
                </div>

                <div className="bg-yellow-50 p-3 rounded">
                  <div className="text-gray-600">Cost</div>
                  <div className="text-lg font-bold text-yellow-600">₹{route.cost?.toFixed(2)}</div>
                </div>

                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-gray-600">Air Quality</div>
                  <div className="text-lg font-bold text-purple-600">{route.aqi_level || 'N/A'}</div>
                </div>
              </div>

              {selectedRoute?.id === route.id && (
                <div className="p-3 bg-green-100 border border-green-400 rounded text-green-700">
                   Selected Route
                </div>
              )}
            </div>
          ))}

          {/*  NEW: Start Navigation Button */}
          {selectedRoute && (
            <button
              onClick={handleStartNavigation}
              disabled={loading}
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
               {loading ? 'Starting Navigation...' : 'Start Navigation'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}