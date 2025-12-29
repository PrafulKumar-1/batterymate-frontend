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
        console.log('Dashboard response:', response.data)
        
        const data = response.data
        
        // FIX: Map correct keys from backend response
        setEcoScore({
          score: data.eco_score?.score || 0,
          level: data.eco_score?.level || 'Bronze',
          badges: data.eco_score?.badges || [],
          trees_equivalent: data.statistics?.total_trees_equivalent || 0,
          carbon_offset: data.statistics?.total_co2_saved_kg || 0
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
      <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl p-8 text-white text-center">
        <p>Loading eco score...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* EcoScore Card */}
      <div className={`bg-gradient-to-br ${getScoreColor(ecoScore.level)} rounded-xl p-8 text-white`}>
        <h3 className="text-sm font-medium opacity-90">EcoScore</h3>
        <p className="text-5xl font-bold my-4">{ecoScore.score.toFixed(1)}</p>
        <p className="text-lg font-semibold">{ecoScore.level}</p>
        <p className="text-sm opacity-90 mt-2">Keep driving sustainably!</p>
      </div>

      {/* Trees Card */}
      <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-8 text-white">
        <h3 className="text-sm font-medium opacity-90">Trees Planted Equivalent</h3>
        <p className="text-5xl font-bold my-4">{ecoScore.trees_equivalent}</p>
        <p className="text-sm opacity-90">through eco-friendly driving</p>
      </div>

      {/* Carbon Offset Card */}
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-8 text-white">
        <h3 className="text-sm font-medium opacity-90">Carbon Offset</h3>
        <p className="text-4xl font-bold my-4">{(ecoScore.carbon_offset || 0).toFixed(2)} kg CO₂</p>
        <p className="text-sm opacity-90">offset from driving</p>
      </div>

      {/* Badges */}
      {ecoScore.badges && ecoScore.badges.length > 0 && (
        <div className="bg-white rounded-xl p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Achievements</h4>
          <div className="grid grid-cols-2 gap-3">
            {ecoScore.badges.map((badge, idx) => (
              <div key={idx} className="bg-amber-100 rounded-lg p-3 text-center">
                <p className="text-2xl">🏆</p>
                <p className="text-xs font-semibold text-gray-800 mt-1">
                  {badge.name || badge}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
