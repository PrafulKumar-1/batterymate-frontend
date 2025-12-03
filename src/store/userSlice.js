import { createSlice } from '@reduxjs/toolkit'

// Line 3-20: Create user slice
const userSlice = createSlice({
  name: 'user',           // Line 4: Slice name
  initialState: {         // Line 5: Initial state
    id: null,
    name: '',
    email: '',
    phone: '',
    vehicleModel: '',
    isAuthenticated: false
  },
  
  // Line 13-30: Reducers
  reducers: {
    // Line 15-20: Set user action
    setUser: (state, action) => {
      state.id = action.payload.id
      state.name = action.payload.name
      state.email = action.payload.email
      state.isAuthenticated = true
    },
    
    // Line 22-26: Update user action
    updateUser: (state, action) => {
      Object.assign(state, action.payload)
    },
    
    // Line 28-30: Logout action
    logout: (state) => {
      state.id = null
      state.name = ''
      state.email = ''
      state.isAuthenticated = false
    }
  }
})

// Line 33-35: Export actions and reducer
export const { setUser, updateUser, logout } = userSlice.actions
export default userSlice.reducer
