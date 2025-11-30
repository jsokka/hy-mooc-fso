import { List, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import Blog from './Blog'

const UserDetails = () => {
  const id = useParams().id
  const user = useSelector((state) => state.users.find((u) => u.id === id))

  if (!user) {
    return null
  }

  return (
    <div>
      <Typography variant="h4" mb={2}>
        {user.name || user.username}
      </Typography>
      <Typography variant="h6">Blogs added by the user</Typography>
      {user.blogs.length === 0 && <div>No blogs added yet</div>}
      <List>
        {user.blogs.map((blog) => (
          <Blog blog={blog} />
        ))}
      </List>
    </div>
  )
}

export default UserDetails
