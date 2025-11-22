import { useContext } from "react"
import NotificationContext from "./NotificationProvider"


const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  const { notification } = useContext(NotificationContext)

  if (!notification?.message) return null

  return (
    <div style={style}>
      {notification.message}
    </div>
  )
}

export default Notification
