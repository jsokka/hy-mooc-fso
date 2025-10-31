const Notification = ({ text }) => {
  const style = {
    border: '2px solid #000',
    borderRadius: 4,
    backgroundColor: '#45a72aff',
    fontSize: '1.2rem',
    padding: 12,
    marginBottom: 16
  }

  if ((text?.length || 0) === 0) {
    return null
  }

  return (
    <div style={style}>
      {text}
    </div>
  )
}

export default Notification