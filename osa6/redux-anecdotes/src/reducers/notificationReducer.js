import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state = '', action) {
      return action.payload ?? state
    },
    clearNotification() {
      return ''
    }
  }
})

let timeoutId = null

export const setNotification = (notification, duration = 5) => {
  return async (dispatch) => {
    dispatch(notificationSlice.actions.setNotification(notification))
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    if ((notification ?? '').length > 0) {
      timeoutId = setTimeout(() => {
        dispatch(notificationSlice.actions.clearNotification())
      }, duration * 1000);
    }
  }
}

export default notificationSlice.reducer