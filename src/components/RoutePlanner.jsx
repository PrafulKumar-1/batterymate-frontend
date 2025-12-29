import { useState } from 'react'
import api from '../services/api'

const INDIAN_CITIES = {
  Mumbai: { lat: 19.076, lon: 72.8777 },
  Bangalore: { lat: 12.9716, lon: 77.5946 },
  Delhi: { lat: 28.7041, lon: 77.1025 },
  Hyderabad: { lat: 17.385, lon: 78.4867 },
  Pune: { lat: 18.5204, lon: 73.8567 },
  Goa: { lat: 15.4909, lon: 73.8278 },
  Chennai: { lat: 13.0827, lon: 80.2707 },
  Kolkata: { lat: 22.5726, lon: 88.3639 },
  Ahmedabad: { lat: 23.0225, lon: 72.5714 },
  Jaipur: { lat: 26.9124, lon: 75.7873 },
}

export default function RoutePlanner({ onStartNavigation }) {
  const [routeData, setRouteData] = useState({
    startLocation: '',
    endLocation: '',
    preferences: 'balanced',
  })
  const [routes, setRoutes] = useState([])
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [startCoords, setStartCoords] = useState(null)
  const [endCoords, setEndCoords] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setRouteData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const getCoordinates = (locationName) => {
    const coords = INDIAN_CITIES[locationName]
    if (!coords) throw new Error(`Location "${locationName}" not found`)
    return coords
  }

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
        preferences: routeData.preferences,
      })

      const routesList = response.data?.routes || response.data || []
      console.log('Routes received:', routesList)
      
      // Enrich routes with mock data if missing
      const enrichedRoutes = routesList.map((route, idx) => ({
        ...route,
        title: route.title || `Route ${idx + 1}`,
        description: route.description || 'Optimized eco-friendly route',
        distance_km: route.distance_km || (100 + idx * 20),
        duration_minutes: route.duration_minutes || (120 + idx * 15),
        co2_saved_kg: route.co2_saved_kg || (12 + idx * 2),
        cost_estimate: route.cost_estimate || (1200 + idx * 200),
        air_quality_label: route.air_quality_label || ['Good', 'Moderate', 'Fair'][idx] || 'Good',
      }))

      setRoutes(enrichedRoutes)
      setSelectedRouteIdx(null)
    } catch (err) {
      console.error('Error fetching routes:', err)
      setError(err.response?.data?.error || err.message || 'Failed to get routes')
      setRoutes([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectRoute = (index) => {
    setSelectedRouteIdx(selectedRouteIdx === index ? null : index)
  }

  const handleStartNavigation = () => {
    if (selectedRouteIdx === null) {
      setError('Please select a route first')
      return
    }

    const selectedRoute = routes[selectedRouteIdx]
    if (!selectedRoute) {
      setError('Selected route not found')
      return
    }

    const navigationData = {
      route: selectedRoute,
      startLocation: routeData.startLocation,
      endLocation: routeData.endLocation,
      startCoords,
      endCoords,
      startTime: new Date().toISOString(),
    }

    sessionStorage.setItem('activeRoute', JSON.stringify(navigationData))
    if (onStartNavigation) onStartNavigation(navigationData)
  }

  return (
    <div className="space-y-4">
      {/* Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">📍 Start Location</label>
          <input
            name="startLocation"
            value={routeData.startLocation}
            onChange={handleChange}
            list="indian-cities"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g. Mumbai"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">🎯 Destination</label>
          <input
            name="endLocation"
            value={routeData.endLocation}
            onChange={handleChange}
            list="indian-cities"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g. Bangalore"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">⚙️ Preference</label>
          <select
            name="preferences"
            value={routeData.preferences}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="balanced">Balanced</option>
            <option value="eco">Most Eco-friendly</option>
            <option value="fastest">Fastest</option>
          </select>
        </div>
      </div>

      <datalist id="indian-cities">
        {Object.keys(INDIAN_CITIES).map((city) => (
          <option key={city} value={city} />
        ))}
      </datalist>

      {/* Search Button & Error */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {loading ? '🔄 Searching...' : '🔍 Find Routes'}
        </button>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>

      {/* Routes List */}
      {routes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-800">Available Routes ({routes.length})</h3>

          {routes.map((route, idx) => {
            const isSelected = selectedRouteIdx === idx
            return (
              <div
                key={idx}
                onClick={() => handleSelectRoute(idx)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {isSelected && '✅'} {route.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{route.description}</p>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    {route.duration_minutes} mins
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-blue-50 rounded p-2 text-center">
                    <p className="text-gray-600 text-xs font-medium">Distance</p>
                    <p className="text-blue-600 font-bold text-sm">
                      {route.distance_km?.toFixed(1)} km
                    </p>
                  </div>
                  <div className="bg-green-50 rounded p-2 text-center">
                    <p className="text-gray-600 text-xs font-medium">CO₂ Saved</p>
                    <p className="text-green-600 font-bold text-sm">
                      {route.co2_saved_kg?.toFixed(1)} kg
                    </p>
                  </div>
                  <div className="bg-amber-50 rounded p-2 text-center">
                    <p className="text-gray-600 text-xs font-medium">Cost</p>
                    <p className="text-amber-600 font-bold text-sm">
                      ₹{route.cost_estimate?.toFixed(0)}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded p-2 text-center">
                    <p className="text-gray-600 text-xs font-medium">Air Quality</p>
                    <p className="text-purple-600 font-bold text-sm">
                      {route.air_quality_label}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded text-xs text-green-800 font-medium">
                    ✅ This route is selected
                  </div>
                )}
              </div>
            )
          })}

          {/* Start Navigation Button */}
          <button
            onClick={handleStartNavigation}
            disabled={selectedRouteIdx === null}
            className={`w-full mt-4 py-3 font-bold rounded-lg transition-all ${
              selectedRouteIdx !== null
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            🗺️ Start Navigation
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && routes.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-sm">
            Enter locations and click "Find Routes" to see available options.
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="text-gray-600 text-sm mt-2">Finding best routes...</p>
        </div>
      )}
    </div>
  )
}
