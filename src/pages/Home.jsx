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
  const user = useSelector(state => state.user)
  const [activeStep, setActiveStep] = useState(null) // Track which step is active
  const [completedTripData, setCompletedTripData] = useState(null) // Store trip data after navigation

  if (!user.isAuthenticated) {
    return <div className="text-center py-20 text-lg">Loading...</div>
  }

  // Handle navigation completion
  const handleNavigationComplete = (tripData) => {
    setCompletedTripData(tripData)
    setActiveStep('summary')  // Switch to summary tab
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 1. Welcome Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="text-green-600">{user.name || 'Rider'}</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Here is your eco-driving summary and tools for your next trip.
          </p>
        </div>

        {/* 2. Main Stats Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Dashboard />
          </div>
          <div className="lg:col-span-1">
            <EcoScore />
          </div>
        </div>

        {/* 3. Trip Planning Workflow - Three Step Process */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6"> Trip Planning Workflow</h2>
          
          {/* Step Indicators */}
          <div className="flex justify-between mb-8 gap-4">
            <div 
              className={`flex-1 text-center pb-4 border-b-4 cursor-pointer transition ${activeStep === 'plan' ? 'border-green-600' : 'border-gray-200'}`} 
              onClick={() => setActiveStep(activeStep === 'plan' ? null : 'plan')}
            >
              <div className={`text-3xl mb-2 ${activeStep === 'plan' ? 'text-green-600' : 'text-gray-400'}`}></div>
              <div className={`font-semibold ${activeStep === 'plan' ? 'text-green-600' : 'text-gray-600'}`}>Plan Route</div>
            </div>
            
            <div 
              className={`flex-1 text-center pb-4 border-b-4 cursor-pointer transition ${activeStep === 'navigate' ? 'border-blue-600' : 'border-gray-200'}`} 
              onClick={() => setActiveStep(activeStep === 'navigate' ? null : 'navigate')}
            >
              <div className={`text-3xl mb-2 ${activeStep === 'navigate' ? 'text-blue-600' : 'text-gray-400'}`}></div>
              <div className={`font-semibold ${activeStep === 'navigate' ? 'text-blue-600' : 'text-gray-600'}`}>Navigate</div>
            </div>
            
            <div 
              className={`flex-1 text-center pb-4 border-b-4 cursor-pointer transition ${activeStep === 'summary' ? 'border-purple-600' : 'border-gray-200'}`} 
              onClick={() => setActiveStep(activeStep === 'summary' ? null : 'summary')}
            >
              <div className={`text-3xl mb-2 ${activeStep === 'summary' ? 'text-purple-600' : 'text-gray-400'}`}></div>
              <div className={`font-semibold ${activeStep === 'summary' ? 'text-purple-600' : 'text-gray-600'}`}>Summary</div>
            </div>
          </div>

          {/* Step Content - Show all by default, collapse when clicked */}
          <div className="space-y-6">
            {/* Step 1: Route Planner */}
            {(!activeStep || activeStep === 'plan') && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Plan Your Route</h3>
                    <p className="text-gray-600 text-sm">Enter your destination and get optimized eco-friendly routes</p>
                  </div>
                </div>
                <RoutePlanner />
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

            {/* Step 2: Navigation */}
            {(!activeStep || activeStep === 'navigate') && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Turn-by-Turn Navigation</h3>
                    <p className="text-gray-600 text-sm">Real-time navigation with eco-driving tips and battery optimization</p>
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

            {/* Step 3: Trip Summary */}
            {(!activeStep || activeStep === 'summary') && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3"></div>
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
                      setCompletedTripData(null)  // Reset for new trip
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

        {/* 4. Air Quality & Charging Stations - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Air Quality Map */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800"> Live Air Quality</h2>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <AirQualityMap />
            </div>
          </div>
          
          {/* Charging Stations */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800"> Nearby Charging Stations</h2>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <ChargingStations />
            </div>
          </div>
        </div>

        {/* 5. Trip History Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800"> Your Journey History</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <TripHistory />
          </div>
        </div>

      </div>
      
      {/* 6. Floating Chatbot */}
      <Chatbot />
    </div>
  )
}