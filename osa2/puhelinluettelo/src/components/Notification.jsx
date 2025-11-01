const Notification = ({ message }) => {
  const style = {
    border: '2px solid #000',
    borderRadius: 4,
    backgroundColor: message?.type === 'error' ? '#ffcccc' : '#ccffcc',
    fontSize: '1.2rem',
    padding: 12,
    marginBottom: 16
  }

  if ((message?.text?.length || 0) === 0) {
    return null
  }

  return (
    <div style={style}>
      {message.text}
    </div>
  )
}

export default Notification