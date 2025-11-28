import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

const UserDetails = () => {
  const id = useParams().id
  const user = useSelector((state) => state.users.find((u) => u.id === id))

  if (!user) {
    return null
  }

  return (
    <div>
      {user.name || user.username}
      <h3>added blogs</h3>
      {user.blogs.length === 0 && <div>No blogs added yet</div>}
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserDetails
