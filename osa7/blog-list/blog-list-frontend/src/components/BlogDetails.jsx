import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tooltip,
  Typography
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { addComment, deleteBlog, likeBlog } from '../reducers/blogReducer'
import BlogCommentInput from './BlogCommentInput'
import { useRef } from 'react'

const BlogDetails = () => {
  const id = useParams().id
  const currentUser = useSelector((state) => state.user)
  const blog = useSelector((state) => state.blogs.find((b) => b.id === id))
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const commentInputRef = useRef()

  if (!blog) {
    return null
  }

  const handleLikeBlog = () => dispatch(likeBlog(blog))
  const handleDeleteBlog = () =>
    dispatch(
      deleteBlog(blog, () => {
        navigate('/')
      })
    )

  const handleAddComment = (newComment) => {
    dispatch(
      addComment(blog.id, newComment, () => {
        commentInputRef.current.clear()
      })
    )
  }

  const getDisplayName = () => {
    if (!blog.user) {
      return 'unknown user'
    }
    if (blog.user.name?.length > 0) {
      return blog.user.name
    }
    return blog.user.username
  }

  const comments = [...(blog.comments || [])].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  )

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ mb: 1 }}
      >
        <Box display="flex" flexDirection="column" gap={0}>
          <Typography variant="h4">{blog.title}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0 }}>
            by {blog.author}
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
          gap={1}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h5">{blog.likes}</Typography>
            <Tooltip title="Like blog">
              <IconButton size="small" onClick={handleLikeBlog} sx={{ p: 1 }}>
                <FavoriteBorderIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifySelf="center">
        <Stack>
          <a href={blog.url} target="_blank" rel="noreferrer">
            <Typography>{blog.url}</Typography>
          </a>
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', color: 'text.secondary' }}
          >
            added by {getDisplayName()}
          </Typography>
        </Stack>
      </Box>
      {currentUser && currentUser.username === blog.user.username && (
        <button onClick={handleDeleteBlog}>delete</button>
      )}
      <Typography variant="h6" mb={2}>
        Comments
      </Typography>
      <BlogCommentInput onSubmit={handleAddComment} ref={commentInputRef} />
      <List dense={true}>
        {comments.map((c) => (
          <ListItem key={c.id} divider={true}>
            <ListItemText
              primary={c.comment}
              secondary={new Date(c.timestamp).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default BlogDetails
