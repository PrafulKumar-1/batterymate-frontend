import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('eco-score')
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get(`/api/eco-score/leaderboard?category=${category}`)
        
        // FIX: Access response.data.data (not just response.data)
        let data = response.data.data || []
        if (!Array.isArray(data)) {
          data = []
        }
        
        console.log('Leaderboard data:', data)
        setLeaderboard(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
        setError('Failed to load leaderboard. Please try again.')
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [category])

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `#${rank}`
    }
  }

  const getLevelBadge = (score) => {
    const numScore = parseFloat(score) || 0
    if (numScore >= 90)
      return { label: 'Platinum', color: 'from-blue-400 to-blue-600', emoji: '💎' }
    if (numScore >= 70)
      return { label: 'Gold', color: 'from-yellow-400 to-yellow-600', emoji: '🥇' }
    if (numScore >= 50)
      return { label: 'Silver', color: 'from-gray-400 to-gray-600', emoji: '🎖️' }
    return { label: 'Bronze', color: 'from-orange-400 to-orange-600', emoji: '🏅' }
  }

  const getScoreColor = (score) => {
    const numScore = parseFloat(score) || 0
    if (numScore >= 90) return 'text-blue-600'
    if (numScore >= 70) return 'text-green-600'
    if (numScore >= 50) return 'text-yellow-600'
    return 'text-orange-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">❌ {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            🏆 Global Eco-Score Leaderboard
          </h1>
          <p className="text-gray-600">Top eco-friendly drivers on BatteryMate</p>
        </div>

        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {[
            { id: 'eco-score', label: ' Eco Score', icon: '📊' },
            { id: 'distance', label: ' Distance', icon: '🚗' },
            { id: 'co2-saved', label: ' CO₂ Saved', icon: '🌱' },
            { id: 'trips', label: ' Trips', icon: '✈️' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id)
                setSelectedUser(null)
              }}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                category === cat.id
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {leaderboard && leaderboard.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Top 3 Champions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {leaderboard[1] && (
                  <div className="relative">
                    <div
                      className="bg-white rounded-lg shadow-lg p-6 border-4 border-gray-400 cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"
                      onClick={() => setSelectedUser(leaderboard[1])}
                    >
                      <div className="text-center">
                        <div className="text-5xl mb-2">🥈</div>
                        <h3 className="font-bold text-lg text-gray-800 truncate">
                          {leaderboard[1].name || 'Anonymous'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {leaderboard[1].vehicle_model || 'EV User'}
                        </p>
                        <div className={`text-3xl font-bold mt-3 ${getScoreColor(leaderboard[1].eco_score)}`}>
                          {parseFloat(leaderboard[1].eco_score || 0).toFixed(1)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">points</p>
                        <div className="mt-3 flex justify-center gap-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            📍 {leaderboard[1].distance_km || 0} km
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            🗺️ {leaderboard[1].trips_count || 0} trips
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {leaderboard[0] && (
                  <div className="relative lg:scale-110">
                    <div
                      className="bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg shadow-2xl p-8 border-4 border-yellow-600 cursor-pointer hover:shadow-2xl transition-all transform hover:scale-105"
                      onClick={() => setSelectedUser(leaderboard[0])}
                    >
                      <div className="text-center">
                        <div className="text-6xl mb-3 animate-bounce">🥇</div>
                        <h3 className="font-bold text-xl text-gray-900 truncate">
                          {leaderboard[0].name || 'Anonymous'}
                        </h3>
                        <p className="text-sm text-gray-700">{leaderboard[0].vehicle_model || 'EV User'}</p>
                        <div className="text-4xl font-bold mt-4 text-gray-900">
                          {parseFloat(leaderboard[0].eco_score || 0).toFixed(1)}
                        </div>
                        <p className="text-sm text-gray-700 mt-1 font-semibold">points</p>
                        <div className="mt-4 flex justify-center gap-2">
                          <span className="text-xs bg-yellow-100 px-2 py-1 rounded font-semibold">
                            📍 {leaderboard[0].distance_km || 0} km
                          </span>
                          <span className="text-xs bg-yellow-100 px-2 py-1 rounded font-semibold">
                            🗺️ {leaderboard[0].trips_count || 0} trips
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {leaderboard[2] && (
                  <div className="relative">
                    <div
                      className="bg-white rounded-lg shadow-lg p-6 border-4 border-orange-400 cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"
                      onClick={() => setSelectedUser(leaderboard[2])}
                    >
                      <div className="text-center">
                        <div className="text-5xl mb-2">🥉</div>
                        <h3 className="font-bold text-lg text-gray-800 truncate">
                          {leaderboard[2].name || 'Anonymous'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {leaderboard[2].vehicle_model || 'EV User'}
                        </p>
                        <div className={`text-3xl font-bold mt-3 ${getScoreColor(leaderboard[2].eco_score)}`}>
                          {parseFloat(leaderboard[2].eco_score || 0).toFixed(1)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">points</p>
                        <div className="mt-3 flex justify-center gap-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            📍 {leaderboard[2].distance_km || 0} km
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            🗺️ {leaderboard[2].trips_count || 0} trips
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
                  <h2 className="text-2xl font-bold">📊 Full Rankings</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-200">
                        <th className="px-6 py-4 text-left font-bold text-gray-700">Rank</th>
                        <th className="px-6 py-4 text-left font-bold text-gray-700">User</th>
                        <th className="px-6 py-4 text-left font-bold text-gray-700">Vehicle</th>
                        <th className="px-6 py-4 text-center font-bold text-gray-700">Eco Score</th>
                        <th className="px-6 py-4 text-center font-bold text-gray-700">Level</th>
                        <th className="px-6 py-4 text-center font-bold text-gray-700">Distance</th>
                        <th className="px-6 py-4 text-center font-bold text-gray-700">Trips</th>
                        <th className="px-6 py-4 text-center font-bold text-gray-700">CO₂ Saved</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((user, index) => {
                        const level = getLevelBadge(user.eco_score)
                        const isTop3 = index < 3
                        return (
                          <tr
                            key={user.id || index}
                            onClick={() => setSelectedUser(user)}
                            className={`border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-all ${
                              isTop3 ? 'bg-gradient-to-r from-yellow-50 to-blue-50 font-semibold' : ''
                            }`}
                          >
                            <td className="px-6 py-4">
                              <span className="text-2xl font-bold">{getRankBadge(index + 1)}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {(user.name || 'A')[0].toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800">{user.name || 'Anonymous'}</p>
                                  <p className="text-xs text-gray-500">{user.email || ''}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                🚗 {user.vehicle_model || 'EV'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className={`text-2xl font-bold ${getScoreColor(user.eco_score)}`}>
                                {parseFloat(user.eco_score || 0).toFixed(1)}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div
                                className={`inline-flex items-center gap-2 bg-gradient-to-r ${level.color} text-white px-3 py-1 rounded-full text-sm font-semibold`}
                              >
                                <span>{level.emoji}</span>
                                <span>{level.label}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <p className="font-semibold text-gray-800">
                                📍 {parseFloat(user.distance_km || 0).toFixed(1)} km
                              </p>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <p className="font-semibold text-gray-800">🗺️ {user.trips_count || 0}</p>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <p className="font-semibold text-green-600">
                                🌱 {parseFloat(user.co2_saved || 0).toFixed(1)} kg
                              </p>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-2xl text-gray-600 mb-4">📊 No users on leaderboard yet</p>
            <p className="text-gray-500">Start your eco-friendly journey to appear on the leaderboard!</p>
          </div>
        )}

        {selectedUser && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedUser(null)}
          >
            <div
              className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {(selectedUser.name || 'A')[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Eco Score</p>
                  <p className="text-3xl font-bold text-green-600">
                    {parseFloat(selectedUser.eco_score || 0).toFixed(1)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Vehicle</p>
                    <p className="text-sm font-bold text-gray-800">🚗 {selectedUser.vehicle_model || 'EV'}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Level</p>
                    <p className="text-sm font-bold text-green-600">
                      {getLevelBadge(selectedUser.eco_score).label}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Distance</p>
                    <p className="text-lg font-bold text-yellow-600">
                      📍 {parseFloat(selectedUser.distance_km || 0).toFixed(1)} km
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Trips</p>
                    <p className="text-lg font-bold text-purple-600">🗺️ {selectedUser.trips_count || 0}</p>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">CO₂ Saved</p>
                  <p className="text-lg font-bold text-orange-600">
                    🌱 {parseFloat(selectedUser.co2_saved || 0).toFixed(1)} kg
                  </p>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
