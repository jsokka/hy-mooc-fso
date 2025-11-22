import { createContext, useReducer, useRef } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return {
        message: action.payload.message,
        duration: action.payload.duration ?? 5
      }
    case 'CLEAR':
      return {}
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, {})
  const notificationTimeoutRef = useRef(null)

  if (notification?.message) {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }
    notificationTimeoutRef.current = setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
      notificationTimeoutRef.current = null
    }, (notification.duration ?? 5) * 1000)
  }

  return (
    <NotificationContext.Provider value={{ notification, notificationDispatch }}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext