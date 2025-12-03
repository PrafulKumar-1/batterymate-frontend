import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import tripReducer from './tripSlice'
import vehicleReducer from './vehicleSlice'

// Line 6-11: Configure Redux store
export default configureStore({
  reducer: {
    user: userReducer,      // Line 8: User state
    trip: tripReducer,      // Line 9: Trip state
    vehicle: vehicleReducer // Line 10: Vehicle state
  }
})
