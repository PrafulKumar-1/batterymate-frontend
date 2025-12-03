import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../services/api'

export default function TripSummary() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const tripState = location.state || {
    tripStats: {
      distanceTraveled: 0,
      co2Saved: 0,
      timeTraveled: 0,
      currentSpeed: 0
    },
    route: {},
    startLocation: 'Unknown',
    endLocation: 'Unknown'
  }

  const { tripStats, route, startLocation, endLocation } = tripState

  // Save trip to database
  const handleSaveTrip = async () => {
    setIsSaving(true)
    try {
      await api.post('/api/trips/save', {
        start_location: startLocation,
        end_location: endLocation,
        distance_km: tripStats.distanceTraveled,
        duration_minutes: tripStats.timeTraveled,
        co2_saved_grams: tripStats.co2Saved * 1000,
        eco_score: calculateEcoScore()
      })

      setSaveSuccess(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (error) {
      console.error('Error saving trip:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Calculate eco score based on trip
  const calculateEcoScore = () => {
    const score = Math.min(100, Math.floor(tripStats.co2Saved * 5))
    return score
  }

  const ecoScore = calculateEcoScore()
  const treesEquivalent = Math.round(tripStats.co2Saved / 0.021) // 1 tree = 21kg CO2/year

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600"> Trip Saved Successfully!</div>
            <div className="text-gray-600">Redirecting to dashboard...</div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2"> Trip Complete!</h1>
          <p className="text-xl text-gray-600">
            {startLocation} → {endLocation}
          </p>
        </div>

        {/* Main Stats */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {/* Eco Score Circle */}
          <div className="flex justify-center mb-8">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke={ecoScore >= 80 ? '#10b981' : ecoScore >= 60 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  strokeDasharray={`${(ecoScore / 100) * 440} 440`}
                  className="transition-all duration-500"
                />
                <text
                  x="80"
                  y="90"
                  textAnchor="middle"
                  className="text-3xl font-bold"
                  fill={ecoScore >= 80 ? '#10b981' : ecoScore >= 60 ? '#f59e0b' : '#ef4444'}
                >
                  {ecoScore}
                </text>
              </svg>
            </div>
          </div>

          {/* Eco Score Label */}
          <div className="text-center mb-8">
            <div className="text-2xl font-bold mb-2">
              {ecoScore >= 80 ? ' Excellent' : ecoScore >= 60 ? ' Good' : ' Fair'} Eco Score
            </div>
            <p className="text-gray-600">
              You're making a positive environmental impact!
            </p>
          </div>

          {/* Main Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <div className="text-gray-600 text-sm mb-1">Distance Traveled</div>
              <div className="text-3xl font-bold text-blue-600">{tripStats.distanceTraveled.toFixed(1)} km</div>
              <div className="text-xs text-gray-500 mt-1">at avg {(tripStats.distanceTraveled / (tripStats.timeTraveled || 1) * 60).toFixed(1)} km/h</div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <div className="text-gray-600 text-sm mb-1">CO2 Saved</div>
              <div className="text-3xl font-bold text-green-600">{tripStats.co2Saved.toFixed(2)} kg</div>
              <div className="text-xs text-gray-500 mt-1">vs petrol vehicle</div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
              <div className="text-gray-600 text-sm mb-1">Time Traveled</div>
              <div className="text-3xl font-bold text-purple-600">{tripStats.timeTraveled} min</div>
              <div className="text-xs text-gray-500 mt-1">at avg {tripStats.currentSpeed.toFixed(1)} km/h</div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
              <div className="text-gray-600 text-sm mb-1">Trees Equivalent</div>
              <div className="text-3xl font-bold text-yellow-600">{treesEquivalent} </div>
              <div className="text-xs text-gray-500 mt-1">CO2 offset</div>
            </div>
          </div>

          {/* Route Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-bold text-lg mb-3"> Route Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Route Selected:</span>
                <span className="font-bold">{route.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Route Cost:</span>
                <span className="font-bold">₹{(route.cost || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Air Quality:</span>
                <span className="font-bold">{route.aqi_level || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Savings:</span>
                <span className="font-bold text-green-600">₹{((route.cost || 0) * 0.2).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3"> Achievements Unlocked</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white p-3 rounded text-center">
                <div className="text-2xl mb-1"></div>
                <div className="text-xs font-bold">First Trip</div>
              </div>
              <div className="bg-white p-3 rounded text-center">
                <div className="text-2xl mb-1"></div>
                <div className="text-xs font-bold">Eco Warrior</div>
              </div>
              <div className="bg-white p-3 rounded text-center">
                <div className="text-2xl mb-1"></div>
                <div className="text-xs font-bold">EV Pioneer</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleSaveTrip}
            disabled={isSaving || saveSuccess}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSaving ? ' Saving...' : saveSuccess ? ' Saved!' : ' Save Trip'}
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition-colors"
          >
             View Dashboard
          </button>
        </div>

        {/* Share Options */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h3 className="font-bold mb-3"> Share Your Achievement</h3>
          <div className="flex gap-3">
            <button className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
               Facebook
            </button>
            <button className="flex-1 bg-sky-500 text-white py-2 rounded hover:bg-sky-600">
               Twitter
            </button>
            <button className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600">
               WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}