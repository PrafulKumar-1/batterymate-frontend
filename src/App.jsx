// Line 1-3: Import dependencies
import { useEffect } from 'react' // Added useEffect
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux' // Added useDispatch
import api from './services/api' // Import api to verify token
import { setUser } from './store/userSlice' // Import action

// Line 4-10: Import store and pages
import store from './store/store'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

// Line 11-15: Import auth component
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Leaderboard from './components/Leaderboard'


// Line 16-20: Import main navigation
import Navbar from './components/Navbar'

// New Component to handle Auth Initialization
function AuthInitializer({ children }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          // Try to fetch profile to verify token
          const response = await api.get('/api/auth/profile')
          const userData = response.data
          const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
          
          dispatch(setUser({
            id: userData.id,
            name: fullName,
            email: userData.email,
            isAuthenticated: true
          }))
        } catch (error) {
          console.log("Session expired")
          localStorage.removeItem('token')
        }
      }
    }
    checkAuth()
  }, [dispatch])

  return children
}

// Line 21-30: Main App component
export default function App() {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <Router>
          <Navbar />
          <Routes>
            {/* Line 27: Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Line 30: Protected routes - require authentication */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* Line 33: Catch-all 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthInitializer>
    </Provider>
  )
}