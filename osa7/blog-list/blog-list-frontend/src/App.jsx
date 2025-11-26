import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'
import blogService from './services/blogs'
import { login, logout, tryRestoreLoggedInUser } from './reducers/userReducer'
import {
  createBlog,
  deleteBlog,
  fetchBlogs,
  likeBlog
} from './reducers/blogReducer'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const createBlogToggleRef = useRef()
  const createBlogFormRef = useRef()

  useEffect(() => {
    dispatch(fetchBlogs())
    dispatch(tryRestoreLoggedInUser())
  }, [dispatch])

  useEffect(() => {
    blogService.setToken(user?.token)
  }, [user])

  const handleLogin = ({ username, password }) =>
    dispatch(login(username, password))

  const handleLogout = () => dispatch(logout())

  const handleCreateBlog = async (blog) => {
    dispatch(
      createBlog(blog, user, () => {
        createBlogFormRef.current.resetForm()
        createBlogToggleRef.current.toggleVisibility()
      })
    )
  }

  const handleLikeBlog = (blog) => dispatch(likeBlog(blog))

  const handleRemoveBlog = (blog) => dispatch(deleteBlog(blog))

  return (
    <div>
      <Notification />
      {!user && <LoginForm onLogin={handleLogin} />}
      {user && (
        <>
          <h2>blogs</h2>
          <p>
            {user.name || user.username} logged in{' '}
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </p>
          <Toggleable buttonLabel="Create new blog" ref={createBlogToggleRef}>
            <CreateBlogForm
              onSubmit={handleCreateBlog}
              ref={createBlogFormRef}
            />
          </Toggleable>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              currentUser={user}
              onLike={handleLikeBlog}
              onRemove={handleRemoveBlog}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default App
