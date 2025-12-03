import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function TripHistory() {
  const trips = useSelector(state => state.trip.trips)
  const [filteredTrips, setFilteredTrips] = useState([]) // Initialize as empty array

  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // Safety check: ensure trips is an array
    const allTrips = Array.isArray(trips) ? trips : []
    
    let filtered = [...allTrips]
    
    if (filter === 'today') {
      const today = new Date()
      filtered = filtered.filter(trip => {
        // Use started_at as fallback if created_at is missing
        const dateStr = trip.created_at || trip.started_at
        if (!dateStr) return false
        const tripDate = new Date(dateStr)
        return tripDate.toDateString() === today.toDateString()
      })
    } else if (filter === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(trip => {
        const dateStr = trip.created_at || trip.started_at
        if (!dateStr) return false
        const tripDate = new Date(dateStr)
        return tripDate >= weekAgo
      })
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.created_at || b.started_at) - new Date(a.created_at || a.started_at))
    
    setFilteredTrips(filtered)
  }, [trips, filter])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Trip History</h2>
        
        <div className="flex gap-2">
          {['all', 'today', 'week'].map(filterOption => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === filterOption
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b-2 border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Distance</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">CO2 Saved</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredTrips.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No trips found. Start your eco-friendly journey!
                </td>
              </tr>
            ) : (
              filteredTrips.map((trip, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    {/* CRITICAL FIX: Safe date formatting */}
                    {new Date(trip.created_at || trip.started_at || Date.now()).toLocaleDateString()}
                  </td>

                  <td className="py-4 px-4">
                    {/* CRITICAL FIX: Use correct key 'distance_km' */}
                    {trip.distance_km?.toFixed(2) || '0.00'} km
                  </td>

                  <td className="py-4 px-4">
                    {/* CRITICAL FIX: Use correct key and convert grams to kg */}
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {((trip.co2_saved_vs_petrol_grams || 0) / 1000).toFixed(2)} kg
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    {trip.duration_minutes ? trip.duration_minutes + ' min' : 'N/A'}
                  </td>

                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      (trip.status === 'completed' || trip.completed_at)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {trip.status || (trip.completed_at ? 'Completed' : 'In Progress')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}