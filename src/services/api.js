import axios from 'axios'

// Line 3-4: Create axios instance
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Line 6-10: Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Line 13-20: Request interceptor - add token to headers
api.interceptors.request.use(
  (config) => {
    // Line 15-17: Get token from localStorage
    const token = localStorage.getItem('token')
    if (token) {
      // Line 17-18: Add to Authorization header
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Line 23-40: Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Line 27: If 401 (unauthorized), redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Line 42: Export api instance
export default api
