import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { forwardRef, useImperativeHandle, useState } from 'react'

const CreateBlogForm = forwardRef(({ onSubmit }, ref) => {
  const emptyState = {
    title: '',
    author: '',
    url: ''
  }
  const [state, setState] = useState(emptyState)

  const resetForm = () => {
    setState(emptyState)
  }

  useImperativeHandle(ref, () => ({ resetForm }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      title: state.title,
      author: state.author,
      url: state.url
    })
  }

  const handleFieldChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2" align="center">
            Create New Blog
          </Typography>
          <TextField
            label="Title"
            size="small"
            type="text"
            name="title"
            value={state.title}
            onChange={handleFieldChange}
            fullWidth
          />
          <TextField
            label="Author"
            size="small"
            type="text"
            name="author"
            value={state.author}
            onChange={handleFieldChange}
            fullWidth
          />
          <TextField
            label="URL"
            size="small"
            type="text"
            name="url"
            value={state.url}
            onChange={handleFieldChange}
            fullWidth
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Button
              size="small"
              type="submit"
              variant="contained"
              color="primary"
            >
              Create
            </Button>
          </Box>
        </Stack>
      </form>
    </Container>
  )
})

export default CreateBlogForm
