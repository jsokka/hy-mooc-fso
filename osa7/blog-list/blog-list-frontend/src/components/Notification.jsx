import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  const style = {
    border: '2px solid #000',
    borderRadius: 4,
    backgroundColor: notification?.type === 'error' ? '#ffcccc' : '#ccffcc',
    fontSize: '1.2rem',
    padding: 12,
    marginBottom: 16
  }

  if ((notification?.length || 0) === 0) {
    return null
  }

  return <div style={style}>{notification}</div>
}

export default Notification
