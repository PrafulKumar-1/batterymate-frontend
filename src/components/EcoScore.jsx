import { useState, useEffect } from 'react'
import api from '../services/api'

export default function EcoScore() {
  const [ecoScore, setEcoScore] = useState({
    score: 0,
    level: 'Bronze',
    badges: [],
    trees_equivalent: 0,
    carbon_offset: 0
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEcoScore = async () => {
      try {
        const response = await api.get('/api/eco-score/dashboard')
        const data = response.data
        
        // CRITICAL FIX: Map Backend Keys to Frontend State safely
        setEcoScore({
          // Backend: average_eco_score -> Frontend: score
          score: data.average_eco_score || 0,
          
          // Backend: badges (array) -> Frontend: level (string)
          level: (data.badges && data.badges.length > 0) ? data.badges[0] : 'Bronze',
          
          // Backend: badges (array of strings) -> Frontend: badges (array of objects)
          badges: Array.isArray(data.badges) ? data.badges.map(b => ({ name: b, description: 'Achievement Unlocked' })) : [],
          
          // Backend: total_trees_equivalent -> Frontend: trees_equivalent
          trees_equivalent: data.total_trees_equivalent || 0,
          
          // Backend: total_co2_saved_kg -> Frontend: carbon_offset
          carbon_offset: data.total_co2_saved_kg || 0
        })
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching eco score:', error)
        setLoading(false)
      }
    }
    
    fetchEcoScore()
  }, [])

  const getScoreColor = (level) => {
    if (ecoScore.score >= 90) return 'from-blue-500 to-blue-600'
    if (ecoScore.score >= 70) return 'from-green-500 to-green-600'
    return 'from-amber-500 to-amber-600'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <p className="text-gray-600">Loading eco score...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      
      {/* Main eco score card */}
      <div className={`bg-gradient-to-br ${getScoreColor(ecoScore.level)} rounded-lg shadow-lg p-8 text-white`}>
        <h3 className="text-sm font-semibold opacity-90">EcoScore</h3>
        <p className="text-5xl font-bold mt-4">{ecoScore.score}</p>
        <p className="text-lg mt-2 opacity-90">{ecoScore.level}</p>
        <p className="text-sm opacity-75 mt-2">Keep driving sustainably!</p>
      </div>

      {/* Trees equivalent card */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
        <p className="text-sm font-semibold opacity-90">Trees Planted Equivalent</p>
        <p className="text-3xl font-bold mt-2">{ecoScore.trees_equivalent}</p>
        <p className="text-xs opacity-75 mt-2">through eco-friendly driving</p>
      </div>

      {/* Carbon offset card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <p className="text-sm font-semibold opacity-90">Carbon Offset</p>
        {/* CRITICAL FIX: Safe render with (value || 0).toFixed() */}
        <p className="text-3xl font-bold mt-2">{(ecoScore.carbon_offset || 0).toFixed(2)} kg CO2</p>
        <p className="text-xs opacity-75 mt-2">offset from driving</p>
      </div>

      {/* Badges section */}
      {ecoScore.badges.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Achievements</h4>
          <div className="grid grid-cols-2 gap-4">
            {ecoScore.badges.map((badge, index) => (
              <div key={index} className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-2xl"></p>
                <p className="text-sm font-semibold text-gray-800 mt-2">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}