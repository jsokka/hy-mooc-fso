import LogoutIcon from '@mui/icons-material/Logout'
import {
  AppBar,
  Box,
  Button,
  Container,
  Tab,
  Tabs,
  Toolbar,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Route, Routes, useLocation } from 'react-router'
import BlogDetails from './components/BlogDetails'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import UserDetails from './components/UserDetails'
import UsersList from './components/UserList'
import { fetchBlogs } from './reducers/blogReducer'
import { login, logout, tryRestoreLoggedInUser } from './reducers/userReducer'
import { fetchUsers } from './reducers/usersReducer'
import blogService from './services/blogs'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const location = useLocation()
  const [tabValue, setTabValue] = useState(0)

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  useEffect(() => {
    if (location.pathname.startsWith('/users')) {
      setTabValue(1)
    } else {
      setTabValue(0)
    }
  }, [location.pathname])

  return (
    <Container maxWidth="md">
      {!user && (
        <>
          <Notification />
          <LoginForm onLogin={handleLogin} />
        </>
      )}
      {user && (
        <>
          <AppBar position="static">
            <Toolbar
              disableGutters
              sx={{ justifyContent: 'space-between', px: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: '.15rem',
                    color: 'white'
                  }}
                >
                  Blogs
                </Typography>

                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{
                    '& .MuiTabs-indicator': {
                      backgroundColor: 'white',
                      height: 3
                    },
                    '& .MuiTab-root': {
                      minHeight: 64
                    }
                  }}
                >
                  <Tab
                    label="Blogs"
                    component={Link}
                    to="/"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      '&.Mui-selected': {
                        color: 'white'
                      },
                      fontWeight: 500
                    }}
                  />
                  <Tab
                    label="Users"
                    component={Link}
                    to="/users"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      '&.Mui-selected': {
                        color: 'white'
                      },
                      fontWeight: 500
                    }}
                  />
                </Tabs>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }}
                >
                  <Typography>{user.name || user.username}</Typography>
                </Box>
                <Button
                  type="button"
                  onClick={handleLogout}
                  color="inherit"
                  startIcon={<LogoutIcon />}
                  sx={{
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderColor: 'white'
                    }
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Toolbar>
          </AppBar>

          <Container maxWidth="md" sx={{ py: 3, flex: 1, px: 2 }}>
            <Notification />
            <Routes>
              <Route path="/" element={<BlogList currentUser={user} />} />
              <Route path="/blogs/:id" element={<BlogDetails />} />
              <Route path="/users" element={<UsersList />} />
              <Route path="/users/:id" element={<UserDetails />} />
            </Routes>
          </Container>
        </>
      )}
    </Container>
  )
}

export default App
