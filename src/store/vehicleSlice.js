import { createSlice } from '@reduxjs/toolkit'

// Line 3-20: Create vehicle slice
const vehicleSlice = createSlice({
  name: 'vehicle',            // Line 4: Slice name
  initialState: {             // Line 5: Initial state
    vehicles: [],
    currentVehicle: null
  },
  
  // Line 10-25: Reducers
  reducers: {
    // Line 12-14: Set vehicles action
    setVehicles: (state, action) => {
      state.vehicles = action.payload
    },
    
    // Line 16-18: Add vehicle action
    addVehicle: (state, action) => {
      state.vehicles.push(action.payload)
    },
    
    // Line 20-22: Select vehicle action
    selectVehicle: (state, action) => {
      state.currentVehicle = action.payload
    }
  }
})

// Line 25-27: Export actions and reducer
export const { setVehicles, addVehicle, selectVehicle } = vehicleSlice.actions
export default vehicleSlice.reducer
