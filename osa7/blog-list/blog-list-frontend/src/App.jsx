import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState()
  const timeoutRef = useRef()
  const createBlogToggleRef = useRef()

  useEffect(() => {
    async function fetch() {
      const blogs = await blogService.getAll()
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    }
    fetch()
  }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('blogAppUser')
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }
  }, [])

  useEffect(() => {
    blogService.setToken(user?.token)
  }, [user])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('blogAppUser', JSON.stringify(user))
      setUser(user)
    } catch (error) {
      console.error(error)
      showNotification(
        `Login failed: ${error?.response?.data?.error || ''}`,
        'error'
      )
      throw error
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('blogAppUser')
    setUser(null)
  }

  const handleCreateBlog = async (blog) => {
    try {
      const newBlog = await blogService.createBlog(blog)
      // Backend only returns userid
      newBlog.user = {
        id: user.id,
        username: user.username,
        name: user.name
      }
      setBlogs(blogs.concat([newBlog]))
      showNotification(`Added a new blog ${blog.title} by ${blog.author} 🎉`)
      createBlogToggleRef.current.toggleVisibility()
    } catch (error) {
      console.error(error)
      showNotification(
        `Failed to create a blog: ${error?.response?.data?.error || ''}`,
        'error'
      )
      throw error
    }
  }

  const handleLike = async (blog) => {
    const payload = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    await blogService.updateBlog(blog.id, payload)
    setBlogs(
      blogs
        .map((b) => (b.id === blog.id ? { ...b, likes: b.likes + 1 } : b))
        .sort((a, b) => b.likes - a.likes)
    )
  }

  const handleRemove = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.deleteBlog(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      showNotification(`Removed blog ${blog.title} by ${blog.author}`)
    }
  }

  const showNotification = (message, type = '', clearTimeout = 5000) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }
    setNotification({ message, type })
    timeoutRef.current = setTimeout(() => {
      setNotification(null)
      timeoutRef.current = null
    }, clearTimeout)
  }

  return (
    <div>
      {notification && <Notification notification={notification} />}
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
            <CreateBlogForm onSubmit={handleCreateBlog} />
          </Toggleable>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              currentUser={user}
              onLike={handleLike}
              onRemove={handleRemove}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default App
