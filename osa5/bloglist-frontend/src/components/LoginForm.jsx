import { useState } from 'react'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await onLogin({ username, password })
      setUsername('')
      setPassword('')
    }
    catch { /* Handled by parent */ }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <h2>Log in to application</h2>
      <div>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
      </div>
      <button disabled={username.length === 0 || password.length === 0} type="submit">Login</button>
    </form>
  )
}

export default LoginForm