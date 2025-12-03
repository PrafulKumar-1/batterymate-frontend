import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Navigation({ onTripComplete }) {
  const [navigationState, setNavigationState] = useState('idle')
  const [directions, setDirections] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [tripData, setTripData] = useState(null)
  const [tripStats, setTripStats] = useState({
    distanceTraveled: 0,
    co2Saved: 0,
    timeTraveled: 0,
    currentSpeed: 0
  })

  // Get navigation data from sessionStorage
  useEffect(() => {
    const activeRoute = sessionStorage.getItem('activeRoute')
    if (activeRoute) {
      const route = JSON.parse(activeRoute)
      setTripData(route)
      generateDirections(route)
    }
  }, [])

  // Generate turn-by-turn directions
  const generateDirections = (route) => {
    const distance = route.route?.distance_km || 100
    const newDirections = [
      {
        step: 1,
        instruction: ` Start from ${route.startLocation}`,
        direction: 'Start',
        distance: 0.2,
        nextTurn: 'Turn right in 200m'
      },
      {
        step: 2,
        instruction: ' Turn right onto Main Street',
        direction: 'Right',
        distance: 2.5,
        nextTurn: 'Continue straight'
      },
      {
        step: 3,
        instruction: ' Continue straight on Highway',
        direction: 'Straight',
        distance: distance * 0.4,
        nextTurn: 'Turn left in 15km'
      },
      {
        step: 4,
        instruction: ' Turn left onto State Road',
        direction: 'Left',
        distance: distance * 0.3,
        nextTurn: 'Continue on this road'
      },
      {
        step: 5,
        instruction: ' Continue on the scenic route',
        direction: 'Straight',
        distance: distance * 0.25,
        nextTurn: 'Turn right for destination'
      },
      {
        step: 6,
        instruction: ` You have arrived at ${route.endLocation}!`,
        direction: 'End',
        distance: 0.3,
        nextTurn: null
      }
    ]
    setDirections(newDirections)
  }

  // Simulate navigation steps
  useEffect(() => {
    if (navigationState !== 'navigating' || !tripData) return

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1
        
        // Update stats
        const totalDistance = tripData.route?.distance_km || 100
        const distanceTraveled = (nextStep / directions.length) * totalDistance
        setTripStats({
          distanceTraveled: distanceTraveled.toFixed(1),
          co2Saved: (distanceTraveled * 0.12).toFixed(2),
          timeTraveled: nextStep * 2,
          currentSpeed: 60
        })

        // Check if trip completed
        if (nextStep >= directions.length) {
          handleTripComplete()
          return prev
        }

        return nextStep
      })
    }, 3000) // Move to next step every 3 seconds

    return () => clearInterval(interval)
  }, [navigationState, tripData, directions.length])

  // Handle trip completion - use callback instead of routing
  const handleTripComplete = async () => {
    setNavigationState('completed')

    try {
      // Call parent callback with trip data
      if (onTripComplete) {
        onTripComplete({
          tripStats: tripStats,
          route: tripData.route,
          startLocation: tripData.startLocation,
          endLocation: tripData.endLocation,
          startCoords: tripData.startCoords,
          endCoords: tripData.endCoords
        })
      }
    } catch (error) {
      console.error('Error completing trip:', error)
    }
  }

  if (!tripData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No route selected. Please plan a route first.</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h3 className="text-xl font-bold text-gray-800"> Turn-by-Turn Navigation</h3>
        <p className="text-sm text-gray-600 mt-1">
          {tripData.startLocation} → {tripData.endLocation}
        </p>
      </div>

      {/* Trip Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-purple-50 p-3 rounded-lg text-center border border-purple-200">
          <p className="text-xs text-gray-600">Distance</p>
          <p className="text-lg font-bold text-purple-600">{tripStats.distanceTraveled} km</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
          <p className="text-xs text-gray-600">CO₂ Saved</p>
          <p className="text-lg font-bold text-green-600">{tripStats.co2Saved} g</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-200">
          <p className="text-xs text-gray-600">Time</p>
          <p className="text-lg font-bold text-blue-600">{tripStats.timeTraveled} min</p>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg text-center border border-orange-200">
          <p className="text-xs text-gray-600">Speed</p>
          <p className="text-lg font-bold text-orange-600">{tripStats.currentSpeed} km/h</p>
        </div>
      </div>

      {/* Current Direction */}
      {directions[currentStep] && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-300">
          <div className="flex items-start gap-4">
            <div className="text-5xl">
              {directions[currentStep].direction === 'Start' ? '' :
               directions[currentStep].direction === 'End' ? '' :
               directions[currentStep].direction === 'Right' ? '' :
               directions[currentStep].direction === 'Left' ? '' :
               ''}
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-gray-800">{directions[currentStep].instruction}</p>
              <p className="text-sm text-gray-600 mt-2">
                Distance: {directions[currentStep].distance.toFixed(1)} km
              </p>
              {directions[currentStep].nextTurn && (
                <p className="text-sm text-gray-600 mt-1">Next: {directions[currentStep].nextTurn}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Directions Progress */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        <p className="text-sm font-semibold text-gray-700">Route:</p>
        {directions.map((dir, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border transition text-sm ${
              idx === currentStep
                ? 'bg-blue-100 border-blue-500 font-semibold text-gray-800'
                : idx < currentStep
                ? 'bg-gray-100 border-gray-300 opacity-50 text-gray-600'
                : 'bg-white border-gray-200 text-gray-600'
            }`}
          >
            Step {dir.step}: {dir.instruction}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        {navigationState === 'idle' && (
          <button
            onClick={() => setNavigationState('navigating')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition"
          >
             Start Navigation
          </button>
        )}
        
        {navigationState === 'navigating' && (
          <>
            <button
              onClick={() => setNavigationState('paused')}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-semibold transition"
            >
               Pause
            </button>
            <button
              onClick={() => {
                setNavigationState('idle')
                setCurrentStep(0)
                setTripStats({
                  distanceTraveled: 0,
                  co2Saved: 0,
                  timeTraveled: 0,
                  currentSpeed: 0
                })
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold transition"
            >
               Cancel
            </button>
          </>
        )}

        {navigationState === 'paused' && (
          <>
            <button
              onClick={() => setNavigationState('navigating')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition"
            >
               Resume
            </button>
            <button
              onClick={() => {
                setNavigationState('idle')
                setCurrentStep(0)
                setTripStats({
                  distanceTraveled: 0,
                  co2Saved: 0,
                  timeTraveled: 0,
                  currentSpeed: 0
                })
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold transition"
            >
               Cancel
            </button>
          </>
        )}

        {navigationState === 'completed' && (
          <div className="w-full bg-green-100 border border-green-500 p-4 rounded-lg text-center">
            <p className="text-green-800 font-semibold"> Trip completed successfully!</p>
            <p className="text-sm text-green-700 mt-1">Check summary for details</p>
          </div>
        )}
      </div>

      {/* Eco Tips */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <p className="text-sm font-semibold text-green-800 mb-2"> Eco Driving Tips</p>
        <ul className="text-xs text-green-700 space-y-1">
          <li>✓ Maintain steady speed for better efficiency</li>
          <li>✓ Avoid rapid acceleration and braking</li>
          <li>✓ Plan ahead for turns and smooth navigation</li>
          <li>✓ Use regen braking on downhill stretches</li>
        </ul>
      </div>
    </div>
  )
}