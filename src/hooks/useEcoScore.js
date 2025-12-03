import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import api from '../services/api'

// Line 5-30: Custom eco score hook
export const useEcoScore = () => {
  // Line 6: Get user from Redux
  const user = useSelector(state => state.user)

  // Line 8-14: State for eco score
  const [ecoScore, setEcoScore] = useState({
    score: 0,
    level: 'Bronze',
    badges: [],
    trees_equivalent: 0,
    carbon_offset: 0
  })

  // Line 16: Loading state
  const [loading, setLoading] = useState(false)

  // Line 18-35: Fetch eco score on component mount
  useEffect(() => {
    if (!user.isAuthenticated) return

    const fetchEcoScore = async () => {
      setLoading(true)
      try {
        // Line 24: Call eco score API
        const response = await api.get('/api/eco-score/dashboard')
        setEcoScore(response.data)
      } catch (error) {
        console.error('Error fetching eco score:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEcoScore()
  }, [user.isAuthenticated]) // Line 35: Dependency array

  // Line 37-39: Return state
  return {
    ecoScore,
    loading
  }
}
