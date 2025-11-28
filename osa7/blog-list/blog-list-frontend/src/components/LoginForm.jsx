import { useState } from 'react'
import { TextField, Button, Stack } from '@mui/material'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <Stack spacing={2} width={300} justifySelf="center">
        <h2 style={{ textAlign: 'center' }}>Log in to Blog application</h2>
        <TextField
          size="small"
          label="Username"
          variant="outlined"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          size="small"
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          color="primary"
          variant="contained"
          disabled={username.length === 0 || password.length === 0}
          type="submit"
        >
          Login
        </Button>
      </Stack>
    </form>
  )
}

export default LoginForm
