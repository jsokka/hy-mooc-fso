import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState()
  const timeoutRef = useRef(null)

  useEffect(() => {
    async function fetch() {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
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

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('blogAppUser', JSON.stringify(user))
      setUser(user)
    } catch (error) {
      console.error(error)
      showNotification(`Login failed: ${error?.response?.data?.error || ''}`, "error")
      throw error
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('blogAppUser')
    setUser(null)
  }

  const handleCreateBlog = async (blog) => {
    try {
      var newBlog = await blogService.createBlog(blog)
      setBlogs(blogs.concat([newBlog]))
      showNotification(`Added a new blog ${blog.title} by ${blog.author} 🎉`)
    }
    catch (error) {
      console.error(error)
      showNotification(`Failed to create a blog: ${error?.response?.data?.error || ''}`, "error")
      throw error
    }
  }

  const showNotification = (message, type = "", clearTimeout = 5000) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }
    setNotification({ message, type })
    timeoutRef.current = setTimeout(() => {
      setNotification(null)
      timeoutRef.current = null
    }, clearTimeout)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div>
      {notification && <Notification notification={notification} />}
      {!user && <LoginForm onLogin={handleLogin} />}
      {user && (
        <>
          <h2>blogs</h2>
          <p>{user.name || user.username} logged in <button type='button' onClick={handleLogout}>Logout</button></p>
          <CreateBlogForm onSubmit={handleCreateBlog} />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </>
      )}
    </div>
  )
}

export default App