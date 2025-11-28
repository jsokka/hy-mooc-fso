import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Route, Routes } from 'react-router'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import { login, logout, tryRestoreLoggedInUser } from './reducers/userReducer'
import { fetchUsers } from './reducers/usersReducer'
import { fetchBlogs } from './reducers/blogReducer'
import UsersList from './components/UserList'
import BlogList from './components/BlogList'
import UserDetails from './components/UserDetails'
import BlogDetails from './components/BlogDetails'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(tryRestoreLoggedInUser())
    dispatch(fetchUsers())
    dispatch(fetchBlogs())
  }, [dispatch])

  useEffect(() => {
    blogService.setToken(user?.token)
  }, [user])

  const handleLogin = ({ username, password }) =>
    dispatch(login(username, password))

  const handleLogout = () => dispatch(logout())

  return (
    <div>
      <Notification />
      {!user && <LoginForm onLogin={handleLogin} />}
      {user && (
        <>
          <h2>blogs</h2>
          <div
            style={{ backgroundColor: '#aaa', padding: 4, marginBottom: 12 }}
          >
            <Link style={{ marginLeft: 6 }} to="/">
              blogs
            </Link>
            <Link style={{ marginLeft: 6 }} to="/users">
              users
            </Link>
            <span style={{ marginLeft: 6 }}>
              {user.name || user.username} logged in{' '}
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </span>
          </div>
          <Routes>
            <Route path="/" element={<BlogList currentUser={user} />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/:id" element={<UserDetails />} />
          </Routes>
        </>
      )}
    </div>
  )
}

export default App
