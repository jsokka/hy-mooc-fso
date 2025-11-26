import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(_state, action) {
      return action.payload
    },
    clearNotification() {
      return null
    }
  }
})

let timeoutId = null

export const showNotification = (message, duration = 5000) => {
  return (dispatch) => {
    dispatch(notificationSlice.actions.setNotification(message))
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    if ((message ?? '').length > 0) {
      timeoutId = setTimeout(() => {
        dispatch(notificationSlice.actions.clearNotification())
      }, duration)
    }
  }
}

export default notificationSlice.reducer
