import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import { showNotification } from './notificationReducer'

const localStorageKey = 'blogAppUser'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(_state, action) {
      return action.payload
    }
  }
})

export const tryRestoreLoggedInUser = () => {
  return (dispatch) => {
    const loggedInUser = window.localStorage.getItem(localStorageKey)
    if (loggedInUser) {
      dispatch(userSlice.actions.setUser(JSON.parse(loggedInUser)))
    }
  }
}

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(localStorageKey, JSON.stringify(user))
      dispatch(userSlice.actions.setUser(user))
    } catch (error) {
      console.error(error)
      dispatch(
        showNotification(
          `Login failed: ${error?.response?.data?.error || ''}`,
          'error'
        )
      )
      throw error
    }
  }
}

export const logout = () => {
  return (dispatch) => {
    window.localStorage.removeItem(localStorageKey)
    dispatch(userSlice.actions.setUser(null))
  }
}

export default userSlice.reducer
