import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { deleteBlog, likeBlog } from '../reducers/blogReducer'

const BlogDetails = () => {
  const id = useParams().id
  const currentUser = useSelector((state) => state.user)
  const blog = useSelector((state) => state.blogs.find((b) => b.id === id))
  const dispatch = useDispatch()
  const navigate = useNavigate()

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

  const getDisplayName = () => {
    if (!blog.user) {
      return 'unknown user'
    }
    if (blog.user.name?.length > 0) {
      return blog.user.name
    }
    return blog.user.username
  }

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
    </div>
  )
}

export default BlogDetails
