import { useState, useEffect } from 'react'
import api from '../services/api'

export default function ChargingStations() {
  // Line 5-10: State for charging stations
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('nearby')
  const [selectedStation, setSelectedStation] = useState(null)

  // Line 11-30: Fetch charging stations
  useEffect(() => {
    const fetchStations = async () => {
      try {
        // Line 14: API call to get charging stations
        const response = await api.get('/api/charging/stations')
        
        // Line 16: Set stations state
        setStations(response.data || [])
        
        // Line 18: Loading false
        setLoading(false)
      } catch (error) {
        // Line 20: Error handling
        console.error('Error fetching stations:', error)
        setLoading(false)
      }
    }
    
    fetchStations()
  }, []) // Line 27: Dependency array

  // Line 29-45: Filter stations based on criteria
  const getFilteredStations = () => {
    if (filter === 'nearby') {
      // Line 31: Sort by distance (assumes distance property exists)
      return stations.slice(0, 5).sort((a, b) => a.distance - b.distance)
    } else if (filter === 'available') {
      // Line 34: Filter by availability
      return stations.filter(s => s.available_slots > 0)
    } else if (filter === 'fast-charging') {
      // Line 37: Filter by fast charging
      return stations.filter(s => s.charging_speed === 'fast')
    }
    return stations
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <p className="text-gray-600">Loading charging stations...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      
      {/* Line 50-54: Title and filters */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Charging Stations</h2>
        
        {/* Line 53-70: Filter buttons */}
        <div className="flex gap-2">
          {['nearby', 'available', 'fast-charging'].map(filterOption => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filterOption.replace('-', ' ').charAt(0).toUpperCase() + filterOption.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Line 72-100: Stations grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {getFilteredStations().map((station, index) => (
          <div
            key={index}
            onClick={() => setSelectedStation(station)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedStation?.id === station.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            
            {/* Line 82-86: Station name and distance */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800">
                {station.name}
              </h3>
              <span className="text-sm text-gray-500">
                {station.distance?.toFixed(1)} km away
              </span>
            </div>

            {/* Line 89-94: Address */}
            <p className="text-sm text-gray-600 mb-3">
              {station.address}
            </p>

            {/* Line 96-110: Details grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-50 p-2 rounded">
                <p className="text-gray-600">Available Slots</p>
                <p className="font-bold text-blue-600">
                  {station.available_slots}/{station.total_slots}
                </p>
              </div>

              <div className="bg-green-50 p-2 rounded">
                <p className="text-gray-600">Charging Speed</p>
                <p className="font-bold text-green-600">
                  {station.charging_speed}
                </p>
              </div>

              <div className="bg-purple-50 p-2 rounded">
                <p className="text-gray-600">Cost/Hour</p>
                <p className="font-bold text-purple-600">
                  {station.cost_per_hour}
                </p>
              </div>

              <div className="bg-amber-50 p-2 rounded">
                <p className="text-gray-600">Rating</p>
                <p className="font-bold text-amber-600">
                   {station.rating || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Line 126-135: Empty state */}
      {getFilteredStations().length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No charging stations found with current filters.
          </p>
        </div>
      )}
    </div>
  )
}
