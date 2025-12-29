import { useState, useEffect } from 'react'
import api from '../services/api'

export default function TripSummary({ tripData }) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')

  // Use props or default values
  const {
    tripStats = {
      distanceTraveled: 0,
      co2Saved: 0,
      timeTraveled: 0,
      currentSpeed: 0,
    },
    route = {},
    startLocation = 'Unknown',
    endLocation = 'Unknown',
  } = tripData || {}

  const calculateEcoScore = () => {
    const score = Math.min(100, Math.floor(parseFloat(tripStats.co2Saved) * 5))
    return score
  }

  const treesEquivalent = Math.round(parseFloat(tripStats.co2Saved) / 0.021) // 1 tree = 21kg CO2/year

  const handleSaveTrip = async () => {
    if (!tripData) {
      setError('No trip data available')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const payload = {
        start_location: startLocation,
        end_location: endLocation,
        distance_km: parseFloat(tripStats.distanceTraveled),
        duration_minutes: parseInt(tripStats.timeTraveled),
        co2_saved_grams: parseFloat(tripStats.co2Saved) * 1000,
        eco_score: calculateEcoScore(),
        date: new Date().toISOString(),
      }

      console.log('Saving trip:', payload)

      const response = await api.post('/api/trips/save', payload)
      console.log('Trip saved:', response.data)

      setSaveSuccess(true)
      // Keep success message visible for 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Error saving trip:', error)
      setError(error.response?.data?.message || 'Failed to save trip')
    } finally {
      setIsSaving(false)
    }
  }

  const ecoScore = calculateEcoScore()

  if (!tripData) {
    return (
      <div className="text-center py-12 bg-yellow-50 rounded-lg border-2 border-yellow-200">
        <p className="text-yellow-600 font-semibold">⏳ Complete navigation to see summary</p>
        <p className="text-gray-600 text-sm mt-2">Start navigation to begin tracking your eco-friendly trip</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Trip Info Card */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-2 border-blue-200">
        <h3 className="text-lg font-bold text-gray-800 mb-2">📍 Trip Route</h3>
        <p className="text-blue-900 font-semibold text-center">
          {startLocation} → {endLocation}
        </p>
      </div>

      {/* Trip Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center border-2 border-blue-200">
          <p className="text-gray-600 text-xs font-medium">Distance Traveled</p>
          <p className="text-blue-600 font-bold text-2xl mt-2">{tripStats.distanceTraveled}</p>
          <p className="text-gray-500 text-xs">km</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center border-2 border-green-200">
          <p className="text-gray-600 text-xs font-medium">CO₂ Saved</p>
          <p className="text-green-600 font-bold text-2xl mt-2">{tripStats.co2Saved}</p>
          <p className="text-gray-500 text-xs">kg</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center border-2 border-yellow-200">
          <p className="text-gray-600 text-xs font-medium">Duration</p>
          <p className="text-yellow-600 font-bold text-2xl mt-2">{tripStats.timeTraveled}</p>
          <p className="text-gray-500 text-xs">minutes</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center border-2 border-purple-200">
          <p className="text-gray-600 text-xs font-medium">Avg Speed</p>
          <p className="text-purple-600 font-bold text-2xl mt-2">{tripStats.currentSpeed}</p>
          <p className="text-gray-500 text-xs">km/h</p>
        </div>
      </div>

      {/* Eco Score & Environmental Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Eco Score */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg text-white">
          <p className="text-sm font-medium opacity-90">Eco Score</p>
          <p className="text-5xl font-bold mt-2">{ecoScore}</p>
          <p className="text-sm mt-2 opacity-90">
            {ecoScore >= 90 ? '🌟 Excellent' : ecoScore >= 70 ? '✅ Good' : '📈 Fair'} eco-driving
          </p>
        </div>

        {/* Environmental Impact */}
        <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-lg text-white">
          <p className="text-sm font-medium opacity-90">Trees Planted Equivalent</p>
          <p className="text-5xl font-bold mt-2">{treesEquivalent}</p>
          <p className="text-sm mt-2 opacity-90">Environmental offset from this trip</p>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 text-center">
          <p className="text-green-700 font-bold">✅ Trip saved to your history!</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 text-center">
          <p className="text-red-700 font-bold">❌ {error}</p>
        </div>
      )}

      {/* Save Trip Button */}
      <button
        onClick={handleSaveTrip}
        disabled={isSaving || saveSuccess}
        className={`w-full py-3 font-bold rounded-lg transition-all ${
          saveSuccess
            ? 'bg-green-600 text-white'
            : isSaving
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isSaving ? '💾 Saving...' : saveSuccess ? '✅ Saved to History' : '💾 Save Trip to History'}
      </button>

      {/* Impact Statement */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
        <p className="text-center text-gray-700">
          <span className="font-bold text-green-600">🌍 You're making a positive environmental impact!</span>
        </p>
        <p className="text-center text-sm text-gray-600 mt-2">
          This trip saved {tripStats.co2Saved} kg of CO₂ and is equivalent to planting{' '}
          <span className="font-bold text-green-600">{treesEquivalent} trees</span>
        </p>
      </div>
    </div>
  )
}
