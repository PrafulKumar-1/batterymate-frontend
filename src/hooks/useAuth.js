import { useSelector, useDispatch } from 'react-redux'
import { setUser, logout } from '../store/userSlice'
import { useCallback } from 'react'

// Line 5-20: Custom auth hook
export const useAuth = () => {
  // Line 6-7: Redux state and dispatch
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  // Line 9-15: Handle user login
  const login = useCallback((userData) => {
    dispatch(setUser(userData))
  }, [dispatch])

  // Line 17-20: Handle user logout
  const logout_fn = useCallback(() => {
    dispatch(logout())
    localStorage.removeItem('token')
  }, [dispatch])

  // Line 22-27: Return auth state and functions
  return {
    user,
    isAuthenticated: user.isAuthenticated,
    login,
    logout: logout_fn
  }
}
