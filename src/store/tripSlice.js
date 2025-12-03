import { createSlice } from '@reduxjs/toolkit'

// Line 3-20: Create trip slice
const tripSlice = createSlice({
  name: 'trip',               // Line 4: Slice name
  initialState: {             // Line 5: Initial state
    trips: [],
    currentTrip: null,
    stats: {
      totalDistance: 0,
      totalCO2: 0,
      totalTrips: 0
    }
  },
  
  // Line 14-35: Reducers
  reducers: {
    // Line 16-18: Set trips action
    setTrips: (state, action) => {
      state.trips = action.payload
    },
    
    // Line 20-22: Start trip action
    startTrip: (state, action) => {
      state.currentTrip = action.payload
    },
    
    // Line 24-26: End trip action
    endTrip: (state, action) => {
      state.trips.push(action.payload)
      state.currentTrip = null
    },
    
    // Line 28-32: Update stats action
    updateStats: (state, action) => {
      state.stats = action.payload
    }
  }
})

// Line 35-37: Export actions and reducer
export const { setTrips, startTrip, endTrip, updateStats } = tripSlice.actions
export default tripSlice.reducer
