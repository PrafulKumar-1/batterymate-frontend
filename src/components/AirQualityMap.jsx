import { useState, useEffect } from 'react'
import api from '../services/api'

export default function AirQuality() {
  // Line 5-10: State for air quality
  const [airQuality, setAirQuality] = useState({
    aqi: 0,
    level: 'Good',
    pm25: 0,
    routes: []
  })

  // Line 12-13: Loading state
  const [loading, setLoading] = useState(true)

  // Line 15-30: Fetch air quality data
  useEffect(() => {
    const fetchAirQuality = async () => {
      try {
        // Line 19: API call
        const response = await api.get('/api/air-quality/current')
        
        // Line 21: Set state
        setAirQuality(response.data)
        
        // Line 23: Set loading false
        setLoading(false)
      } catch (error) {
        // Line 25: Error handling
        console.error('Error fetching air quality:', error)
        setLoading(false)
      }
    }
    
    fetchAirQuality()
  }, [])

  // Line 32-40: Get AQI color
  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'text-green-600'
    if (aqi <= 100) return 'text-yellow-600'
    if (aqi <= 150) return 'text-orange-600'
    if (aqi <= 200) return 'text-red-600'
    return 'text-purple-600'
  }

  // Line 42-48: Get AQI label
  const getAQILevel = (aqi) => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Moderate'
    if (aqi <= 150) return 'Unhealthy for Sensitive'
    if (aqi <= 200) return 'Unhealthy'
    return 'Very Unhealthy'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <p className="text-gray-600">Loading air quality...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      
      {/* Line 58-62: Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Air Quality
      </h2>

      {/* Line 64-85: Main AQI card */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        
        {/* Line 66-68: AQI value */}
        <div className="text-center mb-4">
          <p className={`text-5xl font-bold ${getAQIColor(airQuality.aqi)}`}>
            {airQuality.aqi}
          </p>
        </div>

        {/* Line 71-75: AQI level */}
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-800">
            {getAQILevel(airQuality.aqi)}
          </p>
          <p className="text-gray-600 mt-2">
            PM2.5: {airQuality.pm25} µg/m³
          </p>
        </div>

        {/* Line 79-85: Description */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {airQuality.aqi <= 100
              ? ' Air quality is good. Safe to travel via any route.'
              : ' Air quality is poor. Consider avoiding this route.'}
          </p>
        </div>
      </div>

      {/* Line 88-110: Route recommendations */}
      {airQuality.routes && airQuality.routes.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Routes by Air Quality
          </h3>
          
          {/* Line 93-110: Routes list */}
          <div className="space-y-3">
            {airQuality.routes.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Route {index + 1}</p>
                  <p className="text-sm text-gray-600">{route.name}</p>
                </div>
                
                {/* Line 103-108: AQI badge */}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  route.aqi <= 100
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  AQI: {route.aqi}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
