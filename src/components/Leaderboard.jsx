import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Leaderboard() {
  // Line 5-9: State for leaderboard
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('eco-score')

  // Line 10-30: Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Line 14: API call
        const response = await api.get(`/api/eco-score/leaderboard?category=${category}`)
        
        // Line 16: Set state
        setLeaderboard(response.data || [])
        
        // Line 18: Set loading false
        setLoading(false)
      } catch (error) {
        // Line 20: Error handling
        console.error('Error fetching leaderboard:', error)
        setLoading(false)
      }
    }
    
    fetchLeaderboard()
  }, [category]) // Line 27: Re-fetch when category changes

  // Line 29-35: Get medal emoji based on rank
  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return rank
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <p className="text-gray-600">Loading leaderboard...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      
      {/* Line 48-52: Title and category filter */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
        
        {/* Line 51-62: Category select */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="eco-score">By EcoScore</option>
          <option value="distance">By Distance</option>
          <option value="co2-saved">By CO2 Saved</option>
          <option value="trips">By Trips</option>
        </select>
      </div>

      {/* Line 65-110: Leaderboard table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          
          {/* Line 68-75: Table header */}
          <thead className="border-b-2 border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Trips</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Badge</th>
            </tr>
          </thead>

          {/* Line 77-110: Table body */}
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={index} className={`border-b border-gray-100 ${index < 3 ? 'bg-yellow-50' : ''}`}>
                
                {/* Line 80-82: Rank column */}
                <td className="py-4 px-4">
                  <span className="text-lg">{getMedalEmoji(index + 1)}</span>
                </td>

                {/* Line 84-86: User name column */}
                <td className="py-4 px-4">
                  <p className="font-medium text-gray-800">{user.name}</p>
                </td>

                {/* Line 88-90: Score column */}
                <td className="py-4 px-4">
                  <p className="font-bold text-green-600">{user.score}</p>
                </td>

                {/* Line 92-94: Trips column */}
                <td className="py-4 px-4">
                  <p className="text-gray-700">{user.trips_count}</p>
                </td>

                {/* Line 96-100: Badge column */}
                <td className="py-4 px-4 text-right">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    {user.badge}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Line 107-112: Empty state */}
      {leaderboard.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No users on leaderboard yet.
          </p>
        </div>
      )}
    </div>
  )
}
