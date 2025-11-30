import { Box, Button, TextField } from '@mui/material'
import { forwardRef, useImperativeHandle, useState } from 'react'

const BlogCommentInput = forwardRef(({ onSubmit }, ref) => {
  const [newComment, setNewComment] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(newComment)
  }

  const clear = () => {
    setNewComment('')
  }

  useImperativeHandle(ref, () => ({ clear }))

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" justifyContent="left" gap={1}>
        <TextField
          size="small"
          placeholder="Add comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button size="small" variant="outlined" type="submit">
          Send
        </Button>
      </Box>
    </form>
  )
})

export default BlogCommentInput
