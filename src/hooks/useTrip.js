import { useSelector, useDispatch } from 'react-redux'
import { setTrips, startTrip, endTrip } from '../store/tripSlice'
import { useCallback } from 'react'
import api from '../services/api'

// Line 6-25: Custom trip hook
export const useTrip = () => {
  // Line 7-8: Redux state
  const trips = useSelector(state => state.trip.trips)
  const currentTrip = useSelector(state => state.trip.currentTrip)
  const dispatch = useDispatch()

  // Line 11-18: Fetch all trips
  const fetchTrips = useCallback(async () => {
    try {
      const response = await api.get('/api/trips')
      dispatch(setTrips(response.data))
    } catch (error) {
      console.error('Error fetching trips:', error)
    }
  }, [dispatch])

  // Line 20-27: Start a trip
  const start_trip = useCallback(async (tripData) => {
    try {
      const response = await api.post('/api/trips/start', tripData)
      dispatch(startTrip(response.data))
    } catch (error) {
      console.error('Error starting trip:', error)
    }
  }, [dispatch])

  // Line 29-36: End a trip
  const end_trip = useCallback(async (tripId) => {
    try {
      const response = await api.post(`/api/trips/${tripId}/end`)
      dispatch(endTrip(response.data))
    } catch (error) {
      console.error('Error ending trip:', error)
    }
  }, [dispatch])

  // Line 38-43: Return state and functions
  return {
    trips,
    currentTrip,
    fetchTrips,
    startTrip: start_trip,
    endTrip: end_trip
  }
}
