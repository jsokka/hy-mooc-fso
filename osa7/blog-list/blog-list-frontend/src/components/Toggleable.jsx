import { Button, Container, Box } from '@mui/material'
import { useState, useImperativeHandle } from 'react'

const Togglable = ({ buttonLabel, children, ref }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Button variant="outlined" size="small" onClick={toggleVisibility}>
            {buttonLabel}
          </Button>
        </Box>
      </div>
      <div style={showWhenVisible}>
        <Container
          maxWidth="sm"
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          {children}
        </Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Button variant="outlined" size="small" onClick={toggleVisibility}>
            Cancel
          </Button>
        </Box>
      </div>
    </div>
  )
}

export default Togglable
