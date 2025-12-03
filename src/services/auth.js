import api from './api'

// Line 3-10: Login function
export const login = async (email, password) => {
  // Line 5: Call login API
  const response = await api.post('/api/auth/login', { email, password })
  
  // Line 7-8: Store token
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
  }
  
  // Line 10: Return user data
  return response.data
}

// Line 13-16: Register function
export const register = async (userData) => {
  // Line 15: Call register API
  const response = await api.post('/api/auth/register', userData)
  return response.data
}

// Line 19-22: Logout function
export const logout = () => {
  // Line 21: Clear token
  localStorage.removeItem('token')
  
  // Line 22: Redirect to login
  window.location.href = '/login'
}

// Line 25-28: Get current user
export const getCurrentUser = async () => {
  // Line 27: Call profile API
  const response = await api.get('/api/auth/profile')
  return response.data
}
