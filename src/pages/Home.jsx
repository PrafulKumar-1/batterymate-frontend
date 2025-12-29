import { useState } from 'react'
import { useSelector } from 'react-redux'
import Dashboard from '../components/Dashboard'
import TripHistory from '../components/TripHistory'
import EcoScore from '../components/EcoScore'
import RoutePlanner from '../components/RoutePlanner'
import Navigation from '../components/Navigation'
import TripSummary from '../components/TripSummary'
import ChargingStations from '../components/ChargingStations'
import AirQualityMap from '../components/AirQualityMap'
import Chatbot from '../components/Chatbot'

export default function Home() {
  const user = useSelector((state) => state.user)
  const [activeStep, setActiveStep] = useState(null)
  const [completedTripData, setCompletedTripData] = useState(null)

  if (!user.isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const handleNavigationComplete = (tripData) => {
    setCompletedTripData(tripData)
    setActiveStep('summary')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* SECTION 1: WELCOME HEADER */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="text-green-600">{user.name || 'Rider'}</span>
          </h1>
          <p className="text-gray-600 mt-2">Here is your eco-driving summary and tools for your next trip.</p>
        </div>

        {/* SECTION 2: MAIN STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Dashboard />
          </div>
          <div className="lg:col-span-1">
            <EcoScore />
          </div>
        </div>

        {/* SECTION 3: TRIP PLANNING WORKFLOW */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🚗 Trip Planning Workflow</h2>

          {/* Tab Indicators */}
          <div className="flex justify-between mb-8 gap-4">
            <div
              className={`flex-1 text-center pb-4 border-b-4 cursor-pointer transition ${
                activeStep === 'plan' ? 'border-green-600' : 'border-gray-200'
              }`}
              onClick={() => setActiveStep(activeStep === 'plan' ? null : 'plan')}
            >
              <div className={`text-3xl mb-2 ${activeStep === 'plan' ? 'text-green-600' : 'text-gray-400'}`}>
                📍
              </div>
              <div className={`font-semibold ${activeStep === 'plan' ? 'text-green-600' : 'text-gray-600'}`}>
                Plan Route
              </div>
            </div>

            <div
              className={`flex-1 text-center pb-4 border-b-4 cursor-pointer transition ${
                activeStep === 'navigate' ? 'border-blue-600' : 'border-gray-200'
              }`}
              onClick={() => setActiveStep(activeStep === 'navigate' ? null : 'navigate')}
            >
              <div className={`text-3xl mb-2 ${activeStep === 'navigate' ? 'text-blue-600' : 'text-gray-400'}`}>
                🗺️
              </div>
              <div className={`font-semibold ${activeStep === 'navigate' ? 'text-blue-600' : 'text-gray-600'}`}>
                Navigate
              </div>
            </div>

            <div
              className={`flex-1 text-center pb-4 border-b-4 cursor-pointer transition ${
                activeStep === 'summary' ? 'border-purple-600' : 'border-gray-200'
              }`}
              onClick={() => setActiveStep(activeStep === 'summary' ? null : 'summary')}
              disabled={!completedTripData}
            >
              <div
                className={`text-3xl mb-2 ${
                  completedTripData
                    ? activeStep === 'summary'
                      ? 'text-purple-600'
                      : 'text-gray-400'
                    : 'text-gray-300'
                }`}
              >
                ✅
              </div>
              <div
                className={`font-semibold ${
                  completedTripData
                    ? activeStep === 'summary'
                      ? 'text-purple-600'
                      : 'text-gray-600'
                    : 'text-gray-400'
                }`}
              >
                Summary
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {/* Plan Route */}
            {(!activeStep || activeStep === 'plan') && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">📍</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Plan Your Route</h3>
                    <p className="text-gray-600 text-sm">Enter your destination and get optimized eco-friendly routes</p>
                  </div>
                </div>
                <RoutePlanner onStartNavigation={() => setActiveStep('navigate')} />
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setActiveStep('navigate')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Next: Navigate →
                  </button>
                </div>
              </div>
            )}

            {/* Navigation */}
            {(!activeStep || activeStep === 'navigate') && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-2 border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">🗺️</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Turn-by-Turn Navigation</h3>
                    <p className="text-gray-600 text-sm">
                      Real-time navigation with eco-driving tips and battery optimization
                    </p>
                  </div>
                </div>
                <Navigation onTripComplete={handleNavigationComplete} />
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setActiveStep('plan')}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    ← Back: Plan
                  </button>
                  {completedTripData && (
                    <button
                      onClick={() => setActiveStep('summary')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                      View Summary →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Summary - Only show if trip completed */}
            {completedTripData && (!activeStep || activeStep === 'summary') && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">✅</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Trip Summary</h3>
                    <p className="text-gray-600 text-sm">Review your trip statistics and environmental impact</p>
                  </div>
                </div>
                <TripSummary tripData={completedTripData} />
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setActiveStep('navigate')}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    ← Back: Navigate
                  </button>
                  <button
                    onClick={() => {
                      setActiveStep('plan')
                      setCompletedTripData(null)
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    New Trip →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: Air Quality & Charging */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span>🌍</span> Live Air Quality
            </h2>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <AirQualityMap />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span>⚡</span> Nearby Charging Stations
            </h2>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <ChargingStations />
            </div>
          </div>
        </div>

        {/* SECTION 5: Trip History */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>📋</span> Your Journey History
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <TripHistory />
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}
