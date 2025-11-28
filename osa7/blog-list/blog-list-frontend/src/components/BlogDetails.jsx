import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { addComment, deleteBlog, likeBlog } from '../reducers/blogReducer'

const BlogDetails = () => {
  const id = useParams().id
  const currentUser = useSelector((state) => state.user)
  const blog = useSelector((state) => state.blogs.find((b) => b.id === id))
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [newComment, setNewComment] = useState('')

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

  const handleAddComment = (e) => {
    e.preventDefault()
    dispatch(
      addComment(blog.id, newComment, () => {
        setNewComment('')
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
      <h1>
        {blog.title} by {blog.author}
      </h1>
      <div>
        <a href={blog.url} target="_blank">
          {blog.url}
        </a>
      </div>
      <div>
        {blog.likes} likes
        <button onClick={handleLikeBlog}>like</button>
      </div>
      <div>added by {getDisplayName()}</div>
      {currentUser && currentUser.username === blog.user.username && (
        <button onClick={handleDeleteBlog}>delete</button>
      )}
      <h3>comments</h3>
      <form onSubmit={handleAddComment}>
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <input type="submit" />
      </form>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            {c.comment}
            <br />
            <small>{new Date(c.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogDetails
