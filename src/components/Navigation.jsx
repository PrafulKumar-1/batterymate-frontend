import { useState, useEffect } from 'react'

export default function Navigation({ onTripComplete }) {
  const [navigationState, setNavigationState] = useState('idle')
  const [directions, setDirections] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [tripData, setTripData] = useState(null)
  const [tripStats, setTripStats] = useState({
    distanceTraveled: 0,
    co2Saved: 0,
    timeTraveled: 0,
    currentSpeed: 0,
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
        instruction: `Start from ${route.startLocation}`,
        direction: 'Start',
        distance: 0.2,
        nextTurn: 'Turn right in 200m',
      },
      {
        step: 2,
        instruction: 'Turn right onto Main Street',
        direction: 'Right',
        distance: 2.5,
        nextTurn: 'Continue straight',
      },
      {
        step: 3,
        instruction: 'Continue straight on Highway',
        direction: 'Straight',
        distance: distance * 0.4,
        nextTurn: 'Turn left in 15km',
      },
      {
        step: 4,
        instruction: 'Turn left onto State Road',
        direction: 'Left',
        distance: distance * 0.3,
        nextTurn: 'Continue on this road',
      },
      {
        step: 5,
        instruction: 'Continue on the scenic route',
        direction: 'Straight',
        distance: distance * 0.25,
        nextTurn: 'Turn right for destination',
      },
      {
        step: 6,
        instruction: `You have arrived at ${route.endLocation}!`,
        direction: 'End',
        distance: 0.3,
        nextTurn: null,
      },
    ]
    setDirections(newDirections)
  }

  // Simulate navigation steps
  useEffect(() => {
    if (navigationState !== 'navigating' || !tripData) return

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = prev + 1

        // Update stats
        const totalDistance = tripData.route?.distance_km || 100
        const distanceTraveled = (nextStep / directions.length) * totalDistance
        setTripStats({
          distanceTraveled: distanceTraveled.toFixed(1),
          co2Saved: (distanceTraveled * 0.12).toFixed(2),
          timeTraveled: nextStep * 2,
          currentSpeed: 60,
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

  // Handle trip completion
  const handleTripComplete = async () => {
    setNavigationState('completed')
    try {
      if (onTripComplete) {
        onTripComplete({
          tripStats: tripStats,
          route: tripData.route,
          startLocation: tripData.startLocation,
          endLocation: tripData.endLocation,
          startCoords: tripData.startCoords,
          endCoords: tripData.endCoords,
        })
      }
    } catch (error) {
      console.error('Error completing trip:', error)
    }
  }

  if (!tripData) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg border-2 border-red-200">
        <p className="text-red-600 font-semibold">❌ No route selected</p>
        <p className="text-gray-600 text-sm mt-2">Please plan a route first</p>
      </div>
    )
  }

  if (navigationState === 'completed') {
    return (
      <div className="text-center py-12 bg-green-50 rounded-lg border-2 border-green-200">
        <div className="text-5xl mb-4">✅</div>
        <p className="text-green-600 font-bold text-lg">Trip completed successfully!</p>
        <p className="text-gray-600 text-sm mt-2">Check summary for details</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Trip Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm font-semibold text-blue-900">
          {tripData.startLocation} → {tripData.endLocation}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 font-medium">Distance</p>
          <p className="text-blue-600 font-bold text-lg">{tripStats.distanceTraveled} km</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 font-medium">CO₂ Saved</p>
          <p className="text-green-600 font-bold text-lg">{tripStats.co2Saved} kg</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 font-medium">Time</p>
          <p className="text-yellow-600 font-bold text-lg">{tripStats.timeTraveled} min</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600 font-medium">Speed</p>
          <p className="text-purple-600 font-bold text-lg">{tripStats.currentSpeed} km/h</p>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
        <h3 className="font-bold text-gray-800 mb-3">📍 Current Direction</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700 font-semibold text-center">
            {directions[currentStep]?.instruction}
          </p>
          <p className="text-gray-600 text-sm text-center mt-2">
            Distance: {directions[currentStep]?.distance.toFixed(1)} km
          </p>
          {directions[currentStep]?.nextTurn && (
            <p className="text-blue-600 text-xs text-center mt-2 font-medium">
              Next: {directions[currentStep].nextTurn}
            </p>
          )}
        </div>
      </div>

      {/* Route Overview */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
        <h3 className="font-bold text-gray-800 mb-3">🗺️ Route Overview</h3>
        <div className="space-y-2">
          {directions.map((dir, idx) => (
            <div
              key={idx}
              className={`text-sm p-2 rounded transition-all ${
                idx === currentStep
                  ? 'bg-blue-100 border-l-4 border-blue-600 text-blue-900 font-semibold'
                  : idx < currentStep
                    ? 'bg-green-50 text-gray-600 line-through'
                    : 'bg-gray-50 text-gray-600'
              }`}
            >
              Step {dir.step}: {dir.instruction}
            </div>
          ))}
        </div>
      </div>

      {/* Start Navigation Button */}
      {navigationState === 'idle' && (
        <button
          onClick={() => setNavigationState('navigating')}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
        >
          ▶️ Start Navigation
        </button>
      )}

      {navigationState === 'navigating' && (
        <div className="text-center py-3">
          <div className="inline-block animate-pulse">
            <p className="text-green-600 font-semibold">🚗 Navigating...</p>
            <p className="text-gray-600 text-xs">Step {currentStep} of {directions.length}</p>
          </div>
        </div>
      )}
    </div>
  )
}
