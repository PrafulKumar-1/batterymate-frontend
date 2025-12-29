import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Navigation({ onTripComplete }) {
  const navigate = useNavigate()
  const [navigationState, setNavigationState] = useState('idle')
  const [directions, setDirections] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [tripData, setTripData] = useState(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
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
    const distance = route.route?.distance_km || 35.2
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

  // Simulate navigation steps - Updates every 3 seconds
  useEffect(() => {
    if (navigationState !== 'navigating' || !tripData || directions.length === 0) return

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 3)
      
      setCurrentStep((prev) => {
        const nextStep = prev + 1

        // Calculate actual trip statistics
        const totalDistance = tripData.route?.distance_km || 35.2
        const distanceTraveled = (nextStep / directions.length) * totalDistance
        const timeTraveledMinutes = Math.max(60, nextStep * 3) // At least 60 minutes
        const avgSpeed = timeTraveledMinutes > 0 
          ? parseFloat((distanceTraveled / timeTraveledMinutes * 60).toFixed(1))
          : 60

        setTripStats({
          distanceTraveled: parseFloat(distanceTraveled.toFixed(1)),
          co2Saved: parseFloat((distanceTraveled * 0.12).toFixed(2)),
          timeTraveled: timeTraveledMinutes,
          currentSpeed: avgSpeed,
        })

        // Check if trip completed
        if (nextStep >= directions.length) {
          // Finalize trip data with full statistics
          const finalTripStats = {
            distanceTraveled: parseFloat(totalDistance.toFixed(1)),
            co2Saved: parseFloat((totalDistance * 0.12).toFixed(2)),
            timeTraveled: Math.max(60, elapsedSeconds / 60),
            currentSpeed: 60,
          }
          
          handleTripComplete(finalTripStats)
          return prev
        }

        return nextStep
      })
    }, 3000) // Move to next step every 3 seconds

    return () => clearInterval(interval)
  }, [navigationState, tripData, directions.length, elapsedSeconds])

  // Handle trip completion
  const handleTripComplete = (finalStats) => {
    setNavigationState('completed')
    
    const completionData = {
      tripStats: finalStats || tripStats,
      route: tripData.route,
      startLocation: tripData.startLocation,
      endLocation: tripData.endLocation,
      startCoords: tripData.startCoords,
      endCoords: tripData.endCoords,
    }

    // Auto navigate to trip summary after 2 seconds
    setTimeout(() => {
      navigate('/trip-summary', {
        state: completionData,
      })
    }, 2000)

    // Also call callback if provided
    if (onTripComplete) {
      onTripComplete(completionData)
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
        <p className="text-gray-600 text-sm mt-2">Redirecting to summary...</p>
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
            {directions[currentStep]?.instruction || 'Starting navigation...'}
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

      {/* Progress Bar */}
      {navigationState === 'navigating' && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / directions.length) * 100}%` }}
          ></div>
        </div>
      )}

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
            <p className="text-gray-600 text-xs">
              Step {currentStep} of {directions.length} 
              ({Math.round((currentStep / directions.length) * 100)}%)
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Auto-completing in {Math.max(0, 18 - Math.floor(elapsedSeconds / 3))} steps
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
