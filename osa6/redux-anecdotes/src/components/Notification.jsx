import { useSelector, useDispatch } from "react-redux"
import { clearNotification } from "../reducers/notificationReducer"
import { useEffect, useRef } from "react";

const Notification = () => {
  const dispatch = useDispatch();
  const notification = useSelector(state => state.notification)
  const timeoutRef = useRef(null)

  useEffect(() => {
    // Clear timeout when component is dismounted (notification cleared)
    return clearTimeout(timeoutRef.current)
  }, [])

  if (notification) {
    if (timeoutRef.current) {
      // Clear timeout when a new notification is set
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  if (!notification) {
    return
  }

  return <div style={style}>{notification}</div>
}

export default Notification
